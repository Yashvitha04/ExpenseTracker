<template>
  <div class="container">
    <h1>Edit Transaction</h1>
    <TransactionForm :transaction="transaction" @save="navigateToTransactions" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import TransactionForm from '../components/TransactionForm.vue'

const route = useRoute()
const router = useRouter()
const transaction = ref(null)

onMounted(async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:3333/transactions/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    transaction.value = response.data
  } catch (error) {
    console.error('Error fetching transaction:', error)
  }
})

const navigateToTransactions = () => {
  router.push('/transactions')
}
</script>

<style scoped>

</style>
