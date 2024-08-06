<template>
  <v-container>
    <h1>Add Transaction</h1>
    <TransactionForm :isEditMode="false" :form="form" :submitForm="submitForm" />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import TransactionForm from '../components/TransactionForm.vue'
import { useRouter } from 'vue-router'

const form = ref({
  category_name: '',
  type: '',
  amount: '',
  description: '',
})

const router = useRouter()

const submitForm = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:3333/transactions', form.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    })
    console.log('Transaction created:', response.data.transaction)
    router.push('/transactions')
  } catch (error) {
    console.error('Error adding transaction:', error)
  }
}
</script>
