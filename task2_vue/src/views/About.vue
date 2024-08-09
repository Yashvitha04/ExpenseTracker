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
        <h3>Total expense till date: {{ expenses[selectedCategory] }}</h3>
      </div>
    </div>
    <div class="navigation-buttons">
      <button @click="navigateToTransactions" class="btn-primary">View Transactions</button>
      <button @click="navigateToBudgets" class="btn-secondary">View Budgets</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboardStore'
import { storeToRefs } from 'pinia'

const dashboardStore = useDashboardStore()
const { totalAmount, budgets, expenses, categories, selectedCategory } = storeToRefs(dashboardStore)
const router = useRouter()

const fetchDashboardData = dashboardStore.fetchDashboardData
const fetchBudgetData = dashboardStore.fetchBudgetData

const navigateToTransactions = () => {
  router.push('/transactions')
}

const navigateToBudgets = () => {
  router.push('/budgets')
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.date-filter {
  margin-bottom: 20px;
}
.date-filter label {
  margin-right: 10px;
}
.date-filter input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-right: 10px;
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 1200px;
  margin: 0 auto;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 630px;
  background: url("C:\Users\Yashvitha PR\Desktop\Assessment_task\task2_vue\public\expense tracker.png") no-repeat center center;
  background-size: cover;
  position: relative;
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
.date-filter {
  margin-bottom: 20px;
}
.date-filter label {
  margin-right: 10px;
}
.date-filter input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-right: 10px;
}
</style>