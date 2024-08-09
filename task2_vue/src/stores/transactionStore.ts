import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const url = 'http://127.0.0.1:3333'

export const useTransactionStore = defineStore('transactionStore', () => {
  const totalAmount = ref(0)
  const transactions = ref([])
  const paginatedTransactions = ref([])
  const transactionDialog = ref(false)
  const isEditing = ref(false)
  const selectedTransaction = ref(null)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  const fetchTotalAmount = async () => {
    try {
      const response = await axios.get(`${url}/transactions/total`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      totalAmount.value = response.data.totalAmount
    } catch (error) {
      console.error('Error fetching total amount:', error)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${url}/transactions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      transactions.value = response.data.transactions
      paginateTransactions()
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const paginateTransactions = () => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    paginatedTransactions.value = transactions.value.slice(start, end)
  }

  const setPage = (page) => {
    currentPage.value = page
    paginateTransactions()
  }

  const editTransaction = (transaction) => {
    selectedTransaction.value = { ...transaction }
    isEditing.value = true
    transactionDialog.value = true
  }

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${url}/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
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

  const handleSave = () => {
    transactionDialog.value = false
    fetchTransactions()
  }

  const saveTransaction = async (form) => {
    try {
      if (isEditing.value) {
        await axios.put(`${url}/transactions/${form.id}`, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        })
      } else {
        await axios.post(`${url}/transactions`, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        })
      }
      handleSave()
    } catch (error) {
      console.error('Error saving transaction:', error)
    }
  }

  return {
    totalAmount,
    transactions,
    paginatedTransactions,
    transactionDialog,
    isEditing,
    selectedTransaction,
    currentPage,
    itemsPerPage,
    fetchTotalAmount,
    fetchTransactions,
    setPage,
    editTransaction,
    deleteTransaction,
    openTransactionForm,
    handleSave,
    saveTransaction
  }
})
