<template>
  <v-form @submit.prevent="submitForm">
    <v-select
      v-model="form.category_name"
      :items="['Groceries', 'Travel', 'Entertainment', 'Insurance']"
      label="Category Name"
      required
    />
    <v-text-field
      v-model="form.amount"
      label="Amount"
      type="number"
      required
    />
    <v-text-field
      v-model="form.start_date"
      label="Start Date"
      type="date"
      required
    />
    <v-text-field
      v-model="form.end_date"
      label="End Date"
      type="date"
      required
    />
    <v-btn type="submit" color="primary">{{ isEditing ? 'Update' : 'Save' }}</v-btn>
    
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="5000">
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </v-form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useBudgetStore } from '../stores/budgetStore'

const props = defineProps({
  budget: Object
})

const emit = defineEmits(['save'])

const store = useBudgetStore()
const isEditing = ref(false)
const form = ref({
  id: null,
  category_name: '',
  amount: '',
  start_date: '',
  end_date: ''
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'error'
})

watch(() => props.budget, (newValue) => {
  if (newValue) {
    isEditing.value = true
    form.value = {
      id: newValue.id,
      category_name: newValue.category_name,
      amount: newValue.amount,
      start_date: formatDateToYMD(newValue.start_date),
      end_date: formatDateToYMD(newValue.end_date)
    }
  } else {
    isEditing.value = false
    form.value = {
      id: null,
      category_name: '',
      amount: '',
      start_date: '',
      end_date: ''
    }
  }
}, { immediate: true })

function formatDateToYMD(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

const submitForm = async () => {
  try {
    form.value.amount = Number(form.value.amount)

    if (isEditing.value) {
      const response = await store.checkOverlapsEdit(form.value)
      if (response.overlaps) {
        snackbar.value = {
          show: true,
          message: 'Cannot update: overlapping budgets found.',
          color: 'error'
        }
      } else {
        const result = await store.saveBudget(form.value)
        if (result.success) {
          emit('save')
        } else {
          console.error(result.message)
        }
      }
    } else {
      const response = await store.checkOverlaps(form.value)
      if (response.overlaps) {
        snackbar.value = {
          show: true,
          message: 'Cannot add: overlapping budgets found.',
          color: 'error'
        }
      } else {
        const result = await store.saveBudget(form.value)
        if (result.success) {
          emit('save')
        } else {
          console.error(result.message)
        }
      }
    }
  } catch (error) {
    console.error('Error saving budget:', error)
  }
}
</script>

<style scoped>
.v-form {
  max-width: 600px;
  margin: 0 auto;
}
</style>
