<template>
  <v-form @submit.prevent="submitForm">
    <v-select
      v-model="form.type"
      :items="['income', 'expense']"
      label="Type"
      required
    />
    <v-select
      v-model="form.category_name"
      :items="categoryOptions"
      label="Category Name"
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
import { ref, watch, computed } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'

const props = defineProps({
  transaction: Object
})

const emit = defineEmits(['save'])

const transactionStore = useTransactionStore()
const saveTransaction = transactionStore.saveTransaction

const isEditing = ref(false)
const form = ref({
  id: null,
  category_name: '',
  type: '',
  amount: '',
  description: ''
})

const categoriesIncome = ['salary', 'others']
const categoriesExpense = ['Groceries', 'Travel', 'Entertainment', 'Insurance']

const categoryOptions = computed(() => {
  return form.value.type === 'income' ? categoriesIncome : categoriesExpense
})

watch(() => props.transaction, (newValue) => {
  if (newValue) {
    isEditing.value = true
    form.value = {
      id: newValue.transaction_id,
      category_name: newValue.category_name,
      type: newValue.type,
      amount: newValue.amount,
      description: newValue.description
    }
  } else {
    isEditing.value = false
    form.value = {
      id: null,
      category_name: '',
      type: '',
      amount: '',
      description: ''
    }
  }
}, { immediate: true })

const submitForm = async () => {
  await saveTransaction(form.value)
  emit('save')
}
</script>

<style scoped>
.v-form {
  max-width: 600px;
  margin: 0 auto;
}
</style>

