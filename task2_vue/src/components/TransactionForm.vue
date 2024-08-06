<template>
  <v-form @submit.prevent="submitForm">
    <v-text-field
      v-model="form.category_name"
      label="Category Name"
      required
    />
    <v-select
      v-model="form.type"
      :items="['Income', 'Expense']"
      label="Type"
      required
    />
    <v-text-field
      v-model="form.amount"
      label="Amount"
      type="number"
      required
    />
    <v-textarea
      v-model="form.description"
      label="Description"
    />
    <v-btn type="submit" color="primary">{{ isEditing ? 'Update' : 'Save' }}</v-btn>
  </v-form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const props = defineProps({
  transaction: Object
})

const emit = defineEmits(['save'])

const router = useRouter()
const isEditing = ref(false)
const form = ref({
  category_name: '',
  type: '',
  amount: '',
  description: ''
})

watch(() => props.transaction, (newValue) => {
  if (newValue) {
    isEditing.value = true
    form.value = { ...newValue }
  }
}, { immediate: true })

const submitForm = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`http://127.0.0.1:3333/transactionsupdate/${form.value.id}`, form.value, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
    } else {
      await axios.post('http://127.0.0.1:3333/transactions', form.value, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
    }
    emit('save')
    router.push('/transactions')
  } catch (error) {
    console.error('Error saving transaction:', error)
  }
}
</script>

<style scoped>
.v-form {
  max-width: 600px;
  margin: 0 auto;
}
</style>
