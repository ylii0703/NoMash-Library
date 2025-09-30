<template>
  <div class="container mt-5">
    <h2>Sign in</h2>
    <div class="mb-3">
      <input
        type="email"
        placeholder="Email"
        v-model="email"
        class="form-control"
      />
    </div>
    <div class="mb-3">
      <input
        type="password"
        placeholder="Password"
        v-model="password"
        class="form-control"
      />
    </div>
    <button class="btn btn-primary" @click="signin">Sign in via Firebase</button>

    <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
    <p v-if="successMessage" class="text-success mt-3">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()
const auth = getAuth()

function signin() {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(({ user }) => {
      successMessage.value = `Sign in Successful: ${user.email}`
      errorMessage.value = ''
      console.log('Current user:', user) // 用上 userCredential.user 避免 ESLint 报错
      router.push('/')
    })
    .catch(error => {
      errorMessage.value = `Sign in Failed: ${error.code}`
      successMessage.value = ''
      console.error(error.code, error.message)
    })
}
</script>