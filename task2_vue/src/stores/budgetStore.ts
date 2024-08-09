import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const url = 'http://127.0.0.1:3333/budgets'

export const useBudgetStore = defineStore('budgetStore', () => {
  const totalAmount = ref(0)
  const budgets = ref([])
  const paginatedBudgets = ref([])
  const budgetDialog = ref(false)
  const isEditing = ref(false)
  const selectedBudget = ref(null)
  const currentPage = ref(1)
  const itemsPerPage = ref(5)
  const overlappingBudgets = ref([])

  const fetchTotalAmount = async () => {
    try {
      const response = await axios.get(`${url}/total`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      totalAmount.value = response.data.totalAmount
    } catch (error) {
      console.error('Error fetching total amount:', error)
    }
  }

  const fetchBudgets = async () => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      budgets.value = response.data.budgets
      paginateBudgets()
    } catch (error) {
      console.error('Error fetching budgets:', error)
    }
  }

  const paginateBudgets = () => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    paginatedBudgets.value = budgets.value.slice(start, end)
  }

  const setPage = (page) => {
    currentPage.value = page
    paginateBudgets()
  }

  const editBudget = (budget) => {
    selectedBudget.value = { ...budget }
    isEditing.value = true
    budgetDialog.value = true
  }

  const deleteBudget = async (id) => {
    try {
      await axios.delete(`${url}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      fetchBudgets()
    } catch (error) {
      console.error('Error deleting budget:', error)
    }
  }

  const openBudgetForm = () => {
    isEditing.value = false
    selectedBudget.value = null
    budgetDialog.value = true
  }

  const handleSave = () => {
    budgetDialog.value = false
    fetchBudgets()
  }

  const checkOverlaps = async (form) => {
    try {
      const response = await axios.post(`${url}/checkOverlaps`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (response.data.message === 'Overlapping records found.') {
        overlappingBudgets.value = response.data.data.map(budget => ({
          ...budget,
          start_date: formatDateWithoutTime(budget.start_date),
          end_date: formatDateWithoutTime(budget.end_date)
        }))
        return { overlaps: true, data: response.data.data }
      }

      return { overlaps: false }
    } catch (error) {
      console.error('Error checking overlaps:', error)
      return { overlaps: false }
    }
  }

  const checkOverlapsEdit = async (form) => {
    try {
      const response = await axios.post(`${url}/checkOverlapsEdit/${form.id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (response.data.message === 'Overlapping records found.') {
        overlappingBudgets.value = response.data.data.map(budget => ({
          ...budget,
          start_date: formatDateWithoutTime(budget.start_date),
          end_date: formatDateWithoutTime(budget.end_date)
        }))
        return { overlaps: true, data: response.data.data }
      }

      return { overlaps: false }
    } catch (error) {
      console.error('Error checking overlaps during edit:', error)
      return { overlaps: false }
    }
  }

  const saveBudget = async (form, allowOverlaps = false) => {
    try {
      form.amount = Number(form.amount)

      if (isEditing.value) {
        await axios.put(`${url}/${form.id}`, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        })
      } else {
        if (!allowOverlaps) {
          const response = await checkOverlaps(form)
          if (response.overlaps) {
            return { success: false, message: 'Overlapping records found.' }
          }
        }
        await axios.post(url, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        })
      }

      return { success: true }
    } catch (error) {
      console.error('Error saving budget:', error)
      return { success: false, message: error.message }
    }
  }

  const formatDateWithoutTime = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return {
    totalAmount,
    budgets,
    paginatedBudgets,
    budgetDialog,
    isEditing,
    selectedBudget,
    currentPage,
    itemsPerPage,
    overlappingBudgets,
    fetchTotalAmount,
    fetchBudgets,
    setPage,
    editBudget,
    deleteBudget,
    openBudgetForm,
    handleSave,
    saveBudget,
    checkOverlaps,
    checkOverlapsEdit
  }
})
