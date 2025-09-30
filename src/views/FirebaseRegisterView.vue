<template>
  <div class="container mt-5">
    <h2>Firebase Register</h2>

    <form @submit.prevent="register">
      <div class="mb-3">
        <label>Email</label>
        <input v-model="email" type="email" class="form-control" required />
      </div>

      <div class="mb-3">
        <label>Password</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>

      <button type="submit" class="btn btn-primary">Register</button>
    </form>

    <p v-if="ok" class="text-success mt-3">Registration Successful: {{ ok }}</p>
    <p v-if="err" class="text-danger mt-3">Registration Failed: {{ err }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '../main'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const ok = ref('')
const err = ref('')

function register() {
  ok.value = ''
  err.value = ''
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(({ user }) => { ok.value = user.email; console.log('Registered:', user) })
    .catch(e => { err.value = e.code; console.error(e.code, e.message) })
}
</script>