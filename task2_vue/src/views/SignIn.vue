<template>
  <div class="container">
    <h2>Sign Up</h2>
    <form @submit.prevent="submitForm" class="login-form">
      <div>
        <label for="username">Username</label>
        <input
          v-model="form.username"
          type="text"
          id="username"
          placeholder="Enter username"
          required
        />
      </div>
      <div>
        <label for="email">Email</label>
        <input
          v-model="form.email"
          type="email"
          id="email"
          placeholder="Enter email"
          required
        />
      </div>
      <div>
        <label for="password">Password</label>
        <div class="password-container">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            placeholder="Enter password"
            required
          />
          <button type="button" @click="togglePasswordVisibility" class="password-toggle">
            <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
          </button>
        </div>
      </div>
      <button type="submit">Sign Up</button>
    </form>
    <router-link to="/" class="link">Already have an account?</router-link>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const form = ref({
  username: '',
  email: '',
  password: ''
})

const showPassword = ref(false)
const router = useRouter()

const submitForm = async () => {
  if (!form.value.username || !form.value.email || !form.value.password) {
    alert('Please fill out all fields.')
    return
  }

  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
  if (!passwordPattern.test(form.value.password)) {
    alert('Password must be at least 6 characters long and contain letters, numbers, and at least one special character.')
    return
  }

  try {
    const response = await axios.post('http://127.0.0.1:3333/register', {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password
    })

    localStorage.setItem('authToken', response.data.token.token)
    localStorage.setItem('user', response.data.user_id)
    router.push('/About')
  } catch (error) {
    alert('Sign up failed. Please try again.')
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
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
  background-color: #e0f7fa;
  width: 800px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 10%;
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
  position: relative;
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

.password-container {
  display: flex;
  align-items: center;
}

.password-container input {
  flex: 1;
}

.password-container .password-toggle {
  position: absolute;
  right: 10px;
  border: none;
  background: none;
  cursor: pointer;
  color: #42b983;
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

.error-message {
  color: red;
  font-size: 0.875em;
}
</style>
