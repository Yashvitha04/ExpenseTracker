<template>
  <div class="container">
    <h1>Welcome to Your Transactions</h1>
    <div class="total-amount">
      <h2>Total Transaction Amount: {{ totalAmount }}</h2>
    </div>

    <div class="transaction-table">
      <div class="table-header">
        <div class="header-item">Category Name</div>
        <div class="header-item">Type</div>
        <div class="header-item">Amount</div>
        <div class="header-item">Description</div>
        <div class="header-item">Actions</div>
      </div>

      <div v-for="transaction in paginatedTransactions" :key="transaction.transaction_id" class="table-row">
        <div class="table-item">{{ transaction.category_name }}</div>
        <div class="table-item">{{ transaction.type }}</div>
        <div class="table-item">{{ transaction.amount }}</div>
        <div class="table-item">{{ transaction.description }}</div>
        <div class="table-item actions">
          <v-btn @click="editTransaction(transaction)" color="primary" icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn @click="deleteTransaction(transaction.transaction_id)" color="red" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div> 
      </div>
    </div>

    <div class="pagination-controls">
      <v-btn @click="setPage(currentPage - 1)" :disabled="currentPage === 1">Previous</v-btn>
      <v-btn @click="setPage(currentPage + 1)" :disabled="currentPage === totalPages">Next</v-btn>
    </div>

    <div class="buttons">
      <v-btn @click="navigateToDashboard" color="primary" outlined>
        Back to Dashboard
      </v-btn>
      <v-btn @click="openTransactionForm" color="success" outlined>
        Add Transaction
      </v-btn>
    </div>

    <v-dialog v-model="transactionDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ isEditing ? 'Edit Transaction' : 'Add Transaction' }}</span>
        </v-card-title>
        <v-card-text>
          <TransactionForm :transaction="selectedTransaction" @save="handleSave" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="transactionDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTransactionStore } from '@/stores/transactionStore'
import TransactionForm from '../components/TransactionForm.vue'

const transactionStore = useTransactionStore()
const { 
  totalAmount, 
  paginatedTransactions, 
  transactionDialog, 
  isEditing, 
  selectedTransaction, 
  currentPage, 
  itemsPerPage 
} = storeToRefs(transactionStore)

const router = useRouter()

const fetchTotalAmount = transactionStore.fetchTotalAmount
const fetchTransactions = transactionStore.fetchTransactions
const editTransaction = transactionStore.editTransaction
const deleteTransaction = transactionStore.deleteTransaction
const openTransactionForm = transactionStore.openTransactionForm
const handleSave = transactionStore.handleSave
const setPage = transactionStore.setPage

const totalPages = computed(() => Math.ceil(transactionStore.transactions.length / itemsPerPage.value))

const navigateToDashboard = () => {
  router.push('/about')
}

onMounted(() => {
  fetchTotalAmount()
  fetchTransactions()
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
  overflow: auto; 
}

.total-amount {
  margin-bottom: 20px;
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
  max-height: 400px; 
  overflow-y: auto; 
  display: block;
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

.table-body {
  display: block;
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

.pagination-controls {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.buttons {
  margin-top: 20px;
}
</style>
