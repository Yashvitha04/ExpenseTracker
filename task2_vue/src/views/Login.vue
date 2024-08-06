<template>
  <div class="container">
    <h2>Login</h2>
    <form @submit.prevent="submitForm" class="login-form">
      <div>
        <label for="email">Email</label>
        <input
          v-model="form.email"
          type="email"
          id="email"
          placeholder="Enter email"
        />
      </div>
      <div>
        <label for="password">Password</label>
        <input
          v-model="form.password"
          type="password"
          id="password"
          placeholder="Enter password"
        />
      </div>
      <button type="submit">Login</button>
    </form>
    <router-link to="/signin" class="link">Register, If you don't have an account</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const form = ref({
  email: '',
  password: ''
})

const router = useRouter()

const submitForm = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:3333/login', {
      email: form.value.email,
      password: form.value.password
    })

    console.log('Response data:', response.data) // Check the response data
    if (response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token.token)
      localStorage.setItem('user_id', response.data.user_id)
      console.log('User stored:', response.data.user_id)
    } else {
      console.error('No token found in response:', response.data)
      alert('Login failed. Please check your credentials and try again.')
      return
    }
    
    form.value.email = ''
    form.value.password = ''
    
    router.push('/About')
  } catch (error) {
    console.error('Login failed:', error)
    alert('Login failed. Please check your credentials and try again.')
  }
}

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #8ccbe73e;
  width: 800px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-left: 30%;
}

.login-form {
  width: 100%;
  max-width: 800px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.login-form div {
  margin-bottom: 15px;
}

.login-form label {
  display: block;
  margin-bottom: 5px;
}

.login-form input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.login-form button {
  display: block;
  margin: 0 auto;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-form button:hover {
  background-color: #36976a;
}
</style>
