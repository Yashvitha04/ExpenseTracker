import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Budget from 'App/Models/Budget'
import { DateTime } from 'luxon'

export default class BudgetsController {
  public async create({ request, response, auth }: HttpContextContract) {
    const user = auth.user!
    
    const category_name = request.input('category_name')
    const amount = parseFloat(request.input('amount'))
    const start_date = request.input('start_date')
    const end_date = request.input('end_date')
  
    try {
      const parsedStartDate = DateTime.fromISO(start_date).toUTC()
      const parsedEndDate = DateTime.fromISO(end_date).toUTC()
      const validCategories = ['Groceries', 'Travel', 'Entertainment', 'Insurance']
      
      if (!validCategories.includes(category_name)) {
        return response.badRequest({
          error: 'Invalid category',
          details: 'Category must be one of Groceries, Travel, Entertainment, Insurance',
        })
      }
  
      const overlappingBudgets = await Budget.query()
        .where('user_id', user.id)
        .where('category_name', category_name)
        .where((query) => {
          query
            .where('start_date', '<=', parsedEndDate.toFormat('yyyy-MM-dd HH:mm:ss'))
            .where('end_date', '>=', parsedStartDate.toFormat('yyyy-MM-dd HH:mm:ss'))
        })
  
      if (overlappingBudgets.length > 0) {
        let remainingAmount = amount
        let updatedBudgets = []
        let remainingStartDate = parsedStartDate
  
        for (const budget of overlappingBudgets) {
          const existingStartDate = DateTime.fromISO(budget.start_date).toUTC()
          const existingEndDate = DateTime.fromISO(budget.end_date).toUTC()
          if (parsedStartDate <= existingStartDate && parsedEndDate >= existingEndDate) {
            budget.amount += remainingAmount
            budget.start_date = parsedStartDate.toFormat('yyyy-MM-dd HH:mm:ss')
            budget.end_date = parsedEndDate.toFormat('yyyy-MM-dd HH:mm:ss')
            await budget.save()
            updatedBudgets.push(budget)
            remainingAmount = 0
            break
          }
          else if (parsedStartDate >= existingStartDate && parsedEndDate <= existingEndDate) {
            budget.amount += remainingAmount
            await budget.save()
            updatedBudgets.push(budget)
            remainingAmount = 0
            break
          }
          else if (parsedStartDate <= existingEndDate && parsedEndDate >= existingStartDate) {
            const overlapStart = DateTime.max(parsedStartDate, existingStartDate)
            const overlapEnd = DateTime.min(parsedEndDate, existingEndDate)
            const overlapDays = overlapEnd.diff(overlapStart, 'days').days + 1
            const totalDays = parsedEndDate.diff(parsedStartDate, 'days').days + 1
            const overlapAmount = (overlapDays / totalDays) * remainingAmount
  
            budget.amount += overlapAmount
            await budget.save()
            updatedBudgets.push(budget)
  
            remainingAmount -= overlapAmount
  
            if (parsedStartDate < existingStartDate) {
              remainingStartDate = overlapEnd.plus({ days: 1 })
            } else {
              remainingStartDate = overlapEnd.plus({ days: 1 })
            }
          }
        }
  
        if (remainingAmount > 0) {
          await Budget.create({
            user_id: user.id,
            category_name,
            amount: remainingAmount,
            start_date: remainingStartDate.toFormat('yyyy-MM-dd HH:mm:ss'),
            end_date: parsedEndDate.toFormat('yyyy-MM-dd HH:mm:ss'),
          })
        }
  
        return response.ok({
          message: 'Budget updated and new budget created successfully',
          updatedBudgets: updatedBudgets.map(budget => ({
            id: budget.id,
            amount: budget.amount,
            start_date: budget.start_date,
            end_date: budget.end_date,
          })),
        })
      } else {
        const budget = await Budget.create({
          user_id: user.id,
          category_name,
          amount,
          start_date: parsedStartDate.toFormat('yyyy-MM-dd HH:mm:ss'),
          end_date: parsedEndDate.toFormat('yyyy-MM-dd HH:mm:ss'),
        })
  
        return response.created({
          message: 'Budget created successfully',
          budget: {
            id: budget.id,
            amount: budget.amount,
            start_date: budget.start_date,
            end_date: budget.end_date,
          }
        })
      }
    } catch (error) {
      return response.badRequest({
        error: 'Budget creation failed',
        details: error.message,
      })
    }
  }
  
  public async checkOverlaps({ request, response, auth }: HttpContextContract) {
    const user = auth.user!;
    const { start_date, end_date, category_name } = request.only(['start_date', 'end_date', 'category_name']);
    
    try {
      if (!start_date || !end_date || !category_name) {
        return response.status(400).json({ message: 'Start date, end date, and category name are required.' });
      }
      
      const overlappingBudgets = await Budget.query()
        .where('user_id', user.id) 
        .where('category_name', category_name) 
        .andWhere((query) => {
          query
            .where('start_date', '<=', end_date) 
            .andWhere('end_date', '>=', start_date); 
        });

      const overlapData = overlappingBudgets.map(budget => budget.toJSON());

      if (overlapData.length > 0) {
        return response.status(200).json({
          message: 'Overlapping records found.',
          count: overlapData.length,
          data: overlapData.map(budget => ({
            id: budget.id,
            category: budget.category_name,
            start_date: budget.start_date,
            end_date: budget.end_date,
            amount: budget.amount,
            description: budget.description,
          })),
        });
      } else {
        return response.status(200).json({ message: 'No overlapping records found.' });
      }
    } catch (error) {
      console.error('Error checking for overlaps:', error);
      return response.status(500).json({ message: 'Error checking for overlaps', error: error.message });
    }
  }    

  public async checkOverlapsEdit({ request, response, auth, params }: HttpContextContract) {
    const user = auth.user!;
    const budgetId = params.id;
    const { start_date, end_date } = request.only(['start_date', 'end_date']);
  
    try {
      if (!start_date && !end_date) {
        return response.status(400).json({ message: 'Start date or end date must be provided.' });
      }

      const existingBudget = await Budget.findOrFail(budgetId);
      const category_name = existingBudget.category_name;

      const parsedStartDate = start_date 
        ? DateTime.fromISO(start_date).toUTC().toISO() 
        : existingBudget.start_date.toISO();
      const parsedEndDate = end_date 
        ? DateTime.fromISO(end_date).toUTC().toISO() 
        : existingBudget.end_date.toISO();

      const overlappingBudgets = await Budget.query()
        .where('user_id', user.id)
        .where('category_name', category_name) 
        .whereNot('id', budgetId) 
        .where((query) => {
          query
            .where('start_date', '<=', parsedEndDate)
            .andWhere('end_date', '>=', parsedStartDate);
        });
  
      const overlapData = overlappingBudgets.map(budget => budget.toJSON());
  
      if (overlapData.length > 0) {
        return response.status(200).json({
          message: 'Overlapping records found.',
          count: overlapData.length,
          data: overlapData.map(budget => ({
            id: budget.id,
            category: budget.category_name,
            start_date: DateTime.fromISO(budget.start_date).toFormat('yyyy-MM-dd'),
            end_date: DateTime.fromISO(budget.end_date).toFormat('yyyy-MM-dd'),
            amount: budget.amount,
            description: budget.description,
          })),
        });
      } else {
        return response.status(200).json({ message: 'No overlapping records found.' });
      }
    } catch (error) {
      console.error('Error checking for overlaps during edit:', error);
      return response.status(500).json({ message: 'Error checking for overlaps during edit', error: error.message });
    }
  }
  

  public async update({ request, response, auth, params }: HttpContextContract) {
    const user = auth.user!
    const budgetId = params.id

    const category_name = request.input('category_name')
    const amount = request.input('amount')
    const start_date = request.input('start_date')
    const end_date = request.input('end_date')

    try {
      const budget = await Budget.findOrFail(budgetId)

      if (budget.user_id !== user.id) {
        return response.unauthorized('You can only update your own budgets')
      }
      const parsedStartDate = start_date ? DateTime.fromISO(start_date).toUTC() : budget.start_date
      const parsedEndDate = end_date ? DateTime.fromISO(end_date).toUTC() : budget.end_date

      budget.merge({
        category_name: category_name ?? budget.category_name,
        amount: amount ?? budget.amount,
        start_date: parsedStartDate,
        end_date: parsedEndDate
      })

      await budget.save()

      return response.ok({
        message: 'Budget updated successfully',
        budget
      })
    } catch (error) {
      return response.badRequest({
        error: 'Budget update failed',
        details: error.message
      })
    }
  }


  public async index({ response, auth }: HttpContextContract) {
    const user = auth.user!

    try {
      const budgets = await Budget.query().where('user_id', user.id)
      return response.ok({
        message: 'Budgets retrieved successfully',
        budgets
      })
    } catch (error) {
      return response.badRequest({
        error: 'Failed to retrieve budgets',
        details: error.message
      })
    }
  }

  public async delete({ response, auth, params }: HttpContextContract) {
    const user = auth.user!
    const budgetId = params.id

    try {
      const budget = await Budget.findOrFail(budgetId)

      if (budget.user_id !== user.id) {
        return response.unauthorized('You can only delete your own budgets')
      }

      await budget.delete()

      return response.ok({
        message: 'Budget deleted successfully'
      })
    } catch (error) {
      return response.badRequest({
        error: 'Budget deletion failed',
        details: error.message
      })
    }
  }

  public async total({ request, response, auth }: HttpContextContract) {
    const user = auth.user!
    const category_name = request.input('category_name')
    try {
      let query = Budget.query().where('user_id', user.id)

      if (category_name) {
        query = query.where('category_name', category_name)
      }
      const budgets = await query

      const totalAmount = budgets.reduce((total, budget) => total + budget.amount, 0)

      return response.ok({
        message: 'Budgets retrieved successfully',
        totalAmount
      })
    } catch (error) {
      return response.badRequest({
        error: 'Failed to retrieve budgets',
        details: error.message
      })
    }
  }

  public async category({ params, auth, response }: HttpContextContract) {
    const user = auth.user!
    try {
      const { categoryName } = params
      const budgets = await Budget.query()
        .where('category_name', categoryName)
        .andWhere('user_id', user.id)

      if (budgets.length === 0) {
        return response.status(404).json({ message: 'No budgets found for this category.' })
      }
      return response.json({ budgets })
    } catch (error) {
      console.error('Error fetching budgets for this category:', error)
      return response.status(500).json({ message: 'An error occurred while fetching budgets.' })
    }
  }

  public async filter({ params, auth, response }: HttpContextContract) {
    const user = auth.user!
    try {
      const { date } = params
      const budgets = await Budget.query()
        .where('user_id', user.id)
        .where((query) => {
          query
            .where('start_date', '<=', date)
            .andWhere('end_date', '>=', date)
        })

      if (budgets.length === 0) {
        return response.status(404).json({ message: 'No budgets found for this date.' })
      }

      return response.json({ budgets })
    } catch (error) {
      console.error('Error fetching budgets for the date:', error)
      return response.status(500).json({ message: 'An error occurred while fetching budgets.' })
    }
  }
  
}

