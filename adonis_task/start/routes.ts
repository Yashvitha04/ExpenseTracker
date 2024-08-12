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
  Route.get('/', 'TransactionsController.index')
  Route.get('/total', 'TransactionsController.total')
  Route.post('/', 'TransactionsController.create')
  Route.put('/:id', 'TransactionsController.update').where('id', /^[0-9]+$/)
  Route.delete('/:id', 'TransactionsController.delete').where('id', /^[0-9]+$/)
  Route.get('/balance', 'TransactionsController.balance')
}).prefix('/transactions').middleware('auth')

Route.group(() => {
  Route.get('/', 'BudgetsController.index')
  Route.get('/total', 'BudgetsController.total')
  Route.post('/', 'BudgetsController.create')
  Route.post('/checkOverlaps', 'BudgetsController.checkOverlaps')
  Route.post('/checkOverlapsEdit/:id', 'BudgetsController.checkOverlapsEdit').where('id', /^[0-9]+$/)
  Route.put('/:id', 'BudgetsController.update').where('id', /^[0-9]+$/)
  Route.delete('/:id', 'BudgetsController.delete').where('id', /^[0-9]+$/)
  Route.get('/category/:categoryName', 'BudgetsController.category')//.where('categoryName',/^[a-z,A-Z]+$/)
  Route.get('/date/:date', 'BudgetsController.filter')
}).prefix('/budgets').middleware('auth')




