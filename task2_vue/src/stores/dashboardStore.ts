import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const url = 'http://127.0.0.1:3333'

export const useDashboardStore = defineStore('dashboard', () => {
  const totalAmount = ref(0)
  const budgets = ref<Record<string, number>>({})
  const expenses = ref<Record<string, number>>({})
  const categories = ref<string[]>(['Groceries', 'Travel', 'Entertainment', 'Insurance'])
  const selectedCategory = ref<string>('')
  const filteredBudgets = ref<any[]>([]) 
  const balanceData = ref({
    totalIncome: 0,
    totalExpense: 0,
    balanceAmount: 0
  })

  const fetchDashboardData = async () => {
    try {
      const authToken = localStorage.getItem('authToken')
      const totalResponse = await axios.get(`${url}/transactions/total`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      totalAmount.value = totalResponse.data.totalAmount
      const balanceResponse = await axios.get(`${url}/transactions/balance`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      balanceData.value = balanceResponse.data.data
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const fetchBudgetData = async () => {
    try {
      if (!selectedCategory.value) return
      const authToken = localStorage.getItem('authToken')
      const budgetResponse = await axios.get(`${url}/budgets/total?category_name=${selectedCategory.value}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      budgets.value[selectedCategory.value] = budgetResponse.data.totalAmount

      const transactionsResponse = await axios.get(`${url}/transactions/total?category_name=${selectedCategory.value}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      const transactions = transactionsResponse.data.transactions
      expenses.value[selectedCategory.value] = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0)
    } catch (error) {
      console.error('Error fetching budget data:', error)
    }
  }

  const fetchBudgetsByDate = async (date: string) => {
    try {
      const authToken = localStorage.getItem('authToken')
      const response = await axios.get(`${url}/budgets/date/${date}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      filteredBudgets.value = response.data.budgets
    } catch (error) {
      console.error('Error fetching budgets by date:', error)
    }
  }

  return {
    totalAmount,
    budgets,
    expenses,
    categories,
    selectedCategory,
    filteredBudgets,
    balanceData, 
    fetchDashboardData,
    fetchBudgetData,
    fetchBudgetsByDate
  }
})
