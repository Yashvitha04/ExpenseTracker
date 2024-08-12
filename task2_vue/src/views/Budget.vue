<template>
  <div class="container">
    <h1>Welcome to Your Budgets</h1>
    <div class="total-amount">
      <h2>Total Amount: {{ totalAmount }}</h2>
    </div>

    <div class="budget-table">
      <div class="table-header">
        <div class="header-item">Category Name</div>
        <div class="header-item">Amount</div>
        <div class="header-item">Start Date</div>
        <div class="header-item">End Date</div>
        <div class="header-item">Actions</div>
      </div>

      <div v-for="budget in paginatedBudgets" :key="budget.id" class="table-row">
        <div class="table-item">{{ budget.category_name }}</div>
        <div class="table-item">{{ budget.amount.toFixed(2) }}</div>
        <div class="table-item">{{ formatDate(budget.start_date) }}</div>
        <div class="table-item">{{ formatDate(budget.end_date) }}</div>
        <div class="table-item actions">
          <v-btn @click="editBudget(budget)" color="primary" icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn @click="deleteBudget(budget.id)" color="red" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" @click="setPage(currentPage - 1)" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li v-for="page in visiblePages" :key="page" :class="{ active: page === currentPage }" class="page-item">
          <a class="page-link" @click="setPage(page)">
            {{ page }}
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" @click="setPage(currentPage + 1)" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>

    <div class="buttons">
      <v-btn @click="navigateToDashboard" color="primary" outlined>
        Back to Dashboard
      </v-btn>
      <v-btn @click="openBudgetForm" color="success" outlined>
        Add Budget
      </v-btn>
    </div>

    <v-dialog v-model="budgetDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ isEditing ? 'Edit Budget' : 'Add Budget' }}</span>
        </v-card-title>
        <v-card-text>
          <BudgetForm :budget="selectedBudget" @save="handleSave" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="budgetDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBudgetStore } from '@/stores/budgetStore'
import BudgetForm from '../components/BudgetForm.vue'

const budgetStore = useBudgetStore()
const { 
  totalAmount, 
  paginatedBudgets, 
  budgetDialog, 
  isEditing, 
  selectedBudget, 
  currentPage, 
  itemsPerPage 
} = storeToRefs(budgetStore)

const router = useRouter()

const totalPages = computed(() => Math.ceil(budgetStore.budgets.length / itemsPerPage.value))

const fetchTotalAmount = budgetStore.fetchTotalAmount
const fetchBudgets = budgetStore.fetchBudgets
const editBudget = budgetStore.editBudget
const deleteBudget = budgetStore.deleteBudget
const openBudgetForm = budgetStore.openBudgetForm
const handleSave = budgetStore.handleSave
const setPage = budgetStore.setPage

const navigateToDashboard = () => {
  router.push('/about')
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (currentPage.value > 3) pages.push('...')
    for (let i = Math.max(currentPage.value - 1, 2); i <= Math.min(currentPage.value + 1, total - 1); i++) {
      pages.push(i)
    }
    if (currentPage.value < total - 2) pages.push('...')
    if (total > 1) pages.push(total)
  }
  
  return pages
})

onMounted(() => {
  fetchTotalAmount()
  fetchBudgets()
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 1200px;
  margin: 0 auto;
  background-color: #f5f5f5;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 600px;
}

.total-amount {
  margin-bottom: 20px;
}

.budget-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background-color: #e0e0e0;
  font-weight: bold;
}

.header-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

.table-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.actions {
  display: flex;
  justify-content: space-around;
}

.pagination {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 20px 0;
  justify-content: center;
}

.page-item {
  margin: 0 2px;
}

.page-link {
  display: block;
  padding: 8px 16px;
  color: #007bff;
  text-decoration: none;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.page-item.disabled .page-link {
  color: #6c757d;
  cursor: not-allowed;
}

.page-item.active .page-link {
  background-color: #007bff;
  color: white;
}

.page-link:hover {
  background-color: #e9ecef;
}
</style>