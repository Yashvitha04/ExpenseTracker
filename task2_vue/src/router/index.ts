import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import SignIn from '../views/SignIn.vue'
import About from '../views/About.vue'
import Transaction from '../views/Transaction.vue'
import AddTransaction from '../views/AddTransaction.vue'
import EditTransaction from '../views/EditTransaction.vue'

const routes = [
  { path: '/', name: 'Login', component: Login ,meta: { requiresAuth: false } },
  { path: '/signin', name: 'SignIn', component: SignIn },
  { path: '/about', name: 'About', component: About, meta: { requiresAuth: true } },
  { path: '/transactions', name: 'Transaction', component: Transaction, meta: { requiresAuth: true } },
  { path: '/addtransaction', name: 'AddTransaction', component: AddTransaction, meta: { requiresAuth: true } },
  { path: '/edittransaction', name: 'EditTransaction', component: EditTransaction, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken')
  const isAuthenticated = !!token

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
