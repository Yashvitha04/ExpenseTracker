<template>
  <div class="dashboard-container">
    <h1>Welcome to Your Dashboard</h1>
    <div class="total-amount">
      <h2>Total Transaction Amount: {{ totalAmount }}</h2>
    </div>
    <div class="budget-info">
      <div class="budget-selector">
        <label for="category-select">Select Budget Category:</label>
        <select id="category-select" v-model="selectedCategory" @change="fetchBudgetData">
          <option v-for="category in categories" :key="category" :value="category">
            {{ category.charAt(0).toUpperCase() + category.slice(1) }}
          </option>
        </select>
      </div>
      <div v-if="selectedCategory" class="selected-budget-info">
        <h2>{{ selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) }} Budget</h2>
        <h3>Budget: {{ budgets[selectedCategory] }}</h3>
        <h3>Total Income for {{ selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) }}: {{ income[selectedCategory] }}</h3>
        <h3>Total Expense for {{ selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) }}: {{ expense[selectedCategory] }}</h3>
      </div>
    </div>
    <div class="navigation-buttons">
      <button @click="navigateToTransactions" class="btn-primary">View Transactions</button>
      <button @click="navigateToBudgets" class="btn-secondary">View Budgets</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const totalAmount = ref(0)
const budgets = ref({})
const income = ref({})
const expense = ref({})
const selectedCategory = ref('')
const categories = ['grocery', 'travel', 'entertainment', 'insurance']
const router = useRouter()

const fetchDashboardData = async () => {
  try {
    const authToken = localStorage.getItem('authToken')
    const user_id = localStorage.getItem('user_id')
    const totalResponse = await axios.get('http://127.0.0.1:3333/transactions/total', {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
    totalAmount.value = totalResponse.data.totalAmount
    for (const category of categories) {
      const budgetResponse = await axios.get(`http://127.0.0.1:3333/budgets/total?category_name=${category}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      budgets.value[category] = budgetResponse.data.totalAmount

      const transactionsResponse = await axios.get(`http://127.0.0.1:3333/transactions/total?category_name=${category}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      const transactions = transactionsResponse.data.transactions
      income.value[category] = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((total, transaction) => total + transaction.amount, 0)
      expense.value[category] = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0)
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

const fetchBudgetData = async () => {
  try {
    if (!selectedCategory.value) return
    const authToken = localStorage.getItem('authToken')
    const budgetResponse = await axios.get(`http://127.0.0.1:3333/budgets/total?category_name=${selectedCategory.value}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
    budgets.value[selectedCategory.value] = budgetResponse.data.totalAmount

    const transactionsResponse = await axios.get(`http://127.0.0.1:3333/transactions/total?category_name=${selectedCategory.value}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
    const transactions = transactionsResponse.data.transactions
    income.value[selectedCategory.value] = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0)
    expense.value[selectedCategory.value] = transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0)
  } catch (error) {
    console.error('Error fetching budget data:', error)
  }
}

const navigateToTransactions = () => {
  router.push('/transactions')
}

const navigateToBudgets = () => {
  router.push('/budgets')
}

onMounted(() => {
  fetchDashboardData()
})

watch(selectedCategory, fetchBudgetData)
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #8ccbe73e;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.total-amount,
.budget-info {
  margin-bottom: 20px;
}

.budget-selector {
  margin-bottom: 20px;
}

.budget-selector label {
  margin-right: 10px;
}

.budget-selector select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.selected-budget-info {
  margin-top: 20px;
}

.selected-budget-info h2 {
  margin-bottom: 10px;
}

.selected-budget-info h3 {
  margin: 5px 0;
}

.navigation-buttons {
  display: flex;
  gap: 10px;
}

.navigation-buttons .btn-primary,
.navigation-buttons .btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.navigation-buttons .btn-primary {
  background-color: #42b983;
  color: white;
}

.navigation-buttons .btn-primary:hover {
  background-color: #36976a;
}

.navigation-buttons .btn-secondary {
  background-color: #f5f5f5;
  color: #333;
}

.navigation-buttons .btn-secondary:hover {
  background-color: #ddd;
}
</style>
