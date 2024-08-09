<template>
    <div id="app">
      <v-app>
        <v-app-bar app>
          <v-toolbar-title>Expense Tracker</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text @click="navigateTo('/home')">Home</v-btn>
          <v-btn text @click="navigateTo('/about')">Dashboard</v-btn>
          <v-btn text @click="navigateTo('/transactions')">Transaction</v-btn>
          <v-btn text @click="navigateTo('/budgets')">Budget</v-btn>
          <v-btn text @click="logout">Logout</v-btn>
        </v-app-bar>
        <v-main>
          
            <router-view></router-view>
          
        </v-main>
      </v-app>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const navigateTo = (path) => {
    router.push(path)
  }
  
  const logout = () => {
    localStorage.removeItem('authToken')
    router.push('/')
  }
  </script>
  
  <style>
  .v-app-bar {
    background-color: #1976d2;
    color: white;
  }
  
  .v-btn {
    color: white;
  }
  
  .v-main {
    padding: 20px;
  }
  </style>
  