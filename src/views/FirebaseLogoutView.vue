<template>
  <div class="container mt-5 text-center">
    <h2>Signed out</h2>
    <p class="mt-3">Your current account: <strong>{{ prevEmail || 'null' }}</strong></p>
    <p class="text-success fw-bold">Log out successfully</p>

    <div class="mt-4">
      <router-link to="/" class="btn btn-primary me-2">Back to Home</router-link>
      <router-link to="/signin" class="btn btn-outline-secondary">Go to Sign in</router-link>
    </div>

    <div class="mt-4 small">
      <div>Before: {{ prevEmail || 'null' }}</div>
      <div>After: {{ afterEmail || 'null' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { auth } from '../firebase/init'

const route = useRoute()
const prevEmail = ref(null)
const afterEmail = ref(auth.currentUser?.email ?? null)

onMounted(() => {
  prevEmail.value = route.query.prev || sessionStorage.getItem('lastEmail') || null
  console.log('Logout page – previous account:', prevEmail.value)
  console.log('Logout page – current user:', auth.currentUser?.email ?? null)
})
</script>

<style scoped>
.container { max-width: 720px; }
</style>