/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('/register', 'AuthController.register')

Route.post('/login', 'AuthController.login')

Route.group(() => {
  Route.get('/transactions', 'TransactionsController.index')
  Route.get('/transactions/total', 'TransactionsController.total')
  Route.post('/transactions', 'TransactionsController.create')
  Route.put('/transactionsupdate/:id', 'TransactionsController.update')
  Route.delete('/transactions/:id', 'TransactionsController.delete')
  Route.get('/transactions/balance', 'TransactionsController.balance')
  
  Route.get('/budget', 'BudgetsController.index')
  Route.get('/budgets/total', 'BudgetsController.total')
  Route.post('/budget', 'BudgetsController.create')
  Route.put('/budget/:id', 'BudgetsController.update')
  Route.delete('/budget/:id', 'BudgetsController.delete')
}).middleware('auth')


