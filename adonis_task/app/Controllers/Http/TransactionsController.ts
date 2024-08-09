import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction'

export default class TransactionsController {
  public async create({ request, response, auth }: HttpContextContract) {
    const user = auth.user!

    const category_name = request.input('category_name')
    const type = request.input('type')
    const amount = request.input('amount')
    const description = request.input('description')

    try {
      const transaction = await Transaction.create({
        user_id: user.id,
        category_name,
        type,
        amount,
        description
      })

      return response.created({
        message: 'Transaction created successfully',
        transaction
      })
    } catch (error) {
      return response.badRequest({
        error: 'Transaction creation failed',
        details: error.message
      })
    }
  }

  public async index({ response, auth }: HttpContextContract) {
  const user = auth.user!

  try {
    const transactions = await Transaction.query()
      .where('user_id', user.id)

    return response.ok({
      message: 'Transactions retrieved successfully',
      transactions
    })
  } catch (error) {
    return response.badRequest({
      error: 'Failed to retrieve transactions',
      details: error.message
    })
  }
}

  public async update({ request, response, auth, params }: HttpContextContract) {
    const user = auth.user!
    const transactionId = params.id
  
    const category_name = request.input('category_name')
    const type = request.input('type')
    const amount = request.input('amount')
    const description = request.input('description')
  
    try {
      const transaction = await Transaction.findOrFail(transactionId)
  
      if (transaction.user_id !== user.id) {
        return response.unauthorized('You can only update your own transactions')
      }
  
      transaction.merge({
        category_name: category_name ?? transaction.category_name,
        type: type ?? transaction.type,
        amount: amount ?? transaction.amount,
        description: description ?? transaction.description
      })
  
      await transaction.save()
  
      return response.ok({
        message: 'Transaction updated successfully',
        transaction
      })
    } catch (error) {
      return response.badRequest({
        error: 'Transaction update failed',
        details: error.message
      })
    }
  }  

  public async delete({ response, auth, params }: HttpContextContract) {
    const user = auth.user!
    const transactionId = params.id

    try {
      const transaction = await Transaction.findOrFail(transactionId)

      if (transaction.user_id !== user.id) {
        return response.unauthorized('You can only delete your own transactions')
      }

      await transaction.delete()

      return response.ok({
        message: 'Transaction deleted successfully'
      })
    } catch (error) {
      return response.badRequest({
        error: 'Transaction deletion failed',
        details: error.message
      })
    }
  }

  public async total({ request, response, auth }: HttpContextContract) {
    const user = auth.user!
    const type = request.input('type')
    const category_name = request.input('category_name')

    try {
      let query = Transaction.query().where('user_id', user.id)

      if (type) {
        query = query.where('type', type)
      }

      if (category_name) {
        query = query.where('category_name', category_name)
      }
      const transactions = await query

      const totalAmount = transactions.reduce((total, transaction) => total + transaction.amount, 0)

      return response.ok({
        message: 'Transactions retrieved successfully',
        transactions,
        totalAmount
      })
    } catch (error) {
      return response.badRequest({
        error: 'Failed to retrieve transactions',
        details: error.message
      })
    }
  }
  public async balance({ response, auth }: HttpContextContract) {
    const user = auth.user!
  
    try {
      const transactions = await Transaction.query().where('user_id', user.id)
      const totalIncome = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((total, transaction) => total + transaction.amount, 0)
      const totalExpense = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0)
      const balanceAmount = totalIncome - totalExpense
      return response.ok({
        message: 'Balance calculated successfully',
        data: {
          totalIncome,
          totalExpense,
          balanceAmount
        }
      })
    } catch (error) {
      return response.badRequest({
        error: 'Failed to calculate balance',
        details: error.message
      })
    }
  }
  
}


