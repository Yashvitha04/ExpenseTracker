<template>
  <div class="dashboard-container">
    <h1>Welcome to Your Dashboard</h1>

    <div class="main-content">
      <div class="left-side">
        <div class="total-amount">
          <h2>Total Transaction Amount: {{ totalAmount }}</h2>
        </div>

        <div class="balance-info">
          <h3>Total Income: {{ balanceData.totalIncome }}</h3>
          <h3>Total Expense: {{ balanceData.totalExpense }}</h3>
          <h3>Balance: {{ balanceData.balanceAmount }}</h3>
        </div>

        <div class="budget-info">
          <div class="budget-selector">
            <label for="category-select">Select Budget Category:</label>
            <select id="category-select" v-model="selectedCategory" @change="fetchBudgetData">
              <option v-for="category in staticcategories" :key="category" :value="category">
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

        <div class="action-buttons">
          <button @click="navigateToTransactions">View Transactions</button>
          <button @click="navigateToBudgets">View Budgets</button>
        </div>
      </div>

      <div class="right-side">
        <div class="calendar-container">
          <div class="calendar-header">
            <button @click="changeMonth(-1)">&#9654;</button>
            <span>{{ currentMonthName }} {{ currentYear }}</span>
            <button @click="changeMonth(1)">&#9654;</button>
          </div>
          <table class="calendar-table">
            <thead>
              <tr>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="week in generateCalendar()" :key="week[0]?.date">
                <td v-for="day in week" :key="day.date"
                    :class="{ 'current-day': isCurrentDay(day.date), 'selected-day': isSelectedDay(day.date), 'disabled': !day.date }"
                    @click="selectDay(day.date)">
                  {{ day.date ? day.date.getDate() : '' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="filtered-budget-table" v-if="filteredBudgets.length">
      <h3>Budgets for {{ selectedDate }}:</h3>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="budget in filteredBudgets" :key="budget.id">
            <td>{{ budget.category_name }}</td>
            <td>{{ budget.amount }}</td>
            <td>{{ formatDate(budget.start_date) }}</td>
            <td>{{ formatDate(budget.end_date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboardStore'
import { storeToRefs } from 'pinia'

const dashboardStore = useDashboardStore()
const { totalAmount, budgets, expenses, categories, selectedCategory, filteredBudgets, balanceData } = storeToRefs(dashboardStore)
const router = useRouter()
const staticcategories = ['Entertainment', 'Travel', 'Insurance', 'Groceries']; 

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())
const selectedDate = ref(today.toISOString().substr(0, 10))
const selectedDay = ref(today.toISOString().substr(0, 10))

const fetchDashboardData = async () => {
  await dashboardStore.fetchDashboardData()
  fetchBudgetsByDate()
}

const fetchBudgetData = dashboardStore.fetchBudgetData
const fetchBudgetsByDate = () => {
  dashboardStore.fetchBudgetsByDate(selectedDate.value)
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

const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString(undefined, options)
}

const generateCalendar = () => {
  const weeks = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)

  let week = []
  for (let i = 0; i < firstDay.getDay(); i++) {
    week.push({ date: null, disabled: true })
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const currentDate = new Date(currentYear.value, currentMonth.value, day)
    week.push({ date: currentDate })
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  
  if (week.length > 0) {
    while (week.length < 7) {
      week.push({ date: null, disabled: true })
    }
    weeks.push(week)
  }

  return weeks
}

const changeMonth = (offset) => {
  const newMonth = currentMonth.value + offset
  if (newMonth < 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else if (newMonth > 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value = newMonth
  }
}

const currentMonthName = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value)
  return date.toLocaleString('default', { month: 'long' })
})

const isCurrentDay = (date) => {
  if (!date) return false
  const today = new Date()
  return today.getDate() === date.getDate() &&
         today.getMonth() === date.getMonth() &&
         today.getFullYear() === date.getFullYear()
}

const selectDay = (date) => {
  if (!date) return;
  selectedDate.value = date.toISOString().substr(0, 10);
  selectedDay.value = date.toISOString().substr(0, 10);
  const adjustedDate = new Date(date);
  adjustedDate.setDate(adjustedDate.getDate() + 1);
  selectedDate.value = adjustedDate.toISOString().substr(0, 10);
  fetchBudgetsByDate();
};


const isSelectedDay = (date) => {
  if (!date) return false
  return selectedDay.value === date.toISOString().substr(0, 10)
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 1200px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: url("/expense tracker.png") ;
  background-size: cover;
}

.main-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
}

.left-side {
  width: 65%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
}

.right-side {
  width: 30%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.budget-info {
  margin-bottom: 20px;
}

.budget-selector {
  margin-bottom: 20px;
}

.budget-selector label {
  font-weight: bold;
}

.budget-selector select {
  margin-top: 5px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
}

.selected-budget-info {
  margin-top: 20px;
  background: #f0f4f7;
  padding: 10px;
  border-radius: 5px;
}

.selected-budget-info h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.selected-budget-info h3 {
  font-size: 1.2em;
  margin-bottom: 5px;
}

.filtered-budget-table {
  margin-top: 40px;
  width: 100%;
}

.filtered-budget-table h3 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.filtered-budget-table table {
  width: 100%;
  border-collapse: collapse;
}

.filtered-budget-table th, .filtered-budget-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.filtered-budget-table th {
  background: #f7f7f7;
  font-weight: bold;
}

.calendar-container {
  width: 100%;
  margin-top: 20px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.calendar-header button {
  border: none;
  background-color: transparent;
  font-size: 1.5em;
  cursor: pointer;
}

.calendar-header span {
  font-size: 1.2em;
}

.calendar-table {
  width: 100%;
  border-collapse: collapse;
  background: #f7f7f7;
  border-radius: 5px;
  overflow: hidden;
}

.calendar-table th, .calendar-table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

.calendar-table th {
  background: #007bff;
  color: white;
}

.calendar-table td {
  cursor: pointer;
  transition: background-color 0.3s;
}

.calendar-table .current-day {
  background-color: #28a745;
  color: white;
  font-weight: bold;
  border-radius: 50%;
}

.calendar-table .selected-day {
  background-color: #007bff;
  color: white;
  font-weight: bold;
  border-radius: 50%;
}

.calendar-table .selected-day:hover {
  background-color: #0056b3;
}

.calendar-table .disabled {
  background-color: #e9ecef;
  cursor: default;
}

.action-buttons {
  margin-top: 20px;
}

.action-buttons button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-buttons button:hover {
  background-color: #0056b3;
}
</style>
