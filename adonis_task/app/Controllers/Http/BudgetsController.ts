import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Budget from 'App/Models/Budget'
import { DateTime } from 'luxon'

export default class BudgetsController {
  public async create({ request, response, auth }: HttpContextContract) {
    const user = auth.user!

    const category_name = request.input('category_name')
    const amount = request.input('amount')
    const start_date = request.input('start_date')
    const end_date = request.input('end_date')

    try {
      const parsedStartDate = DateTime.fromISO(start_date).toUTC()
      const parsedEndDate = DateTime.fromISO(end_date).toUTC()

      const budget = await Budget.create({
        user_id: user.id,
        category_name,
        amount,
        start_date: parsedStartDate,
        end_date: parsedEndDate
      })

      return response.created({
        message: 'Budget created successfully',
        budget
      })
    } catch (error) {
      return response.badRequest({
        error: 'Budget creation failed',
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
}
