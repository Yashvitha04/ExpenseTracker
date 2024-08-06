<template>
  <div class="container">
    <h1>Welcome to Your Transactions</h1>
    <div class="total-amount">
      <h2>Total Amount: {{ totalAmount }}</h2>
    </div>

    <div class="transaction-table">
      <div class="table-header">
        <div class="header-item">Category Name</div>
        <div class="header-item">Type</div>
        <div class="header-item">Amount</div>
        <div class="header-item">Description</div>
        <div class="header-item">Actions</div>
      </div>

      <div v-for="transaction in transactions" :key="transaction.id" class="table-row">
        <div class="table-item">{{ transaction.category_name }}</div>
        <div class="table-item">{{ transaction.type }}</div>
        <div class="table-item">{{ transaction.amount }}</div>
        <div class="table-item">{{ transaction.description }}</div>
        <div class="table-item actions">
          <v-btn @click="editTransaction(transaction.id)" color="primary" icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn @click="deleteTransaction(transaction.id)" color="red" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>
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
          <TransactionForm :transaction="selectedTransaction" @save="fetchTransactions" />
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import TransactionForm from '../components/TransactionForm.vue'

const totalAmount = ref(0)
const transactions = ref([])
const transactionDialog = ref(false)
const isEditing = ref(false)
const selectedTransaction = ref(null)
const router = useRouter()

const fetchTotalAmount = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333/transactions/total', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    totalAmount.value = response.data.totalAmount
  } catch (error) {
    console.error('Error fetching total amount:', error)
  }
}

const fetchTransactions = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3333/transactions', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    transactions.value = response.data.transactions
  } catch (error) {
    console.error('Error fetching transactions:', error)
  }
}

const editTransaction = (id) => {
  isEditing.value = true
  selectedTransaction.value = transactions.value.find(tx => tx.id === id)
  transactionDialog.value = true
}

const deleteTransaction = async (id) => {
  try {
    await axios.delete(`http://127.0.0.1:3333/transactions/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    fetchTransactions()
  } catch (error) {
    console.error('Error deleting transaction:', error)
  }
}

const openTransactionForm = () => {
  isEditing.value = false
  selectedTransaction.value = null
  transactionDialog.value = true
}

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
  max-width: 800px;
  margin: 0 auto;
  background-color: #f5f5f5;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.total-amount {
  margin-bottom: 20px;
}

.transaction-table {
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

.buttons {
  margin-top: 20px;
}
</style>
