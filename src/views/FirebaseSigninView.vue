<template>
  <div class="container mt-5">
    <!-- 1) Login form -->
    <div v-if="stage === 'form'">
      <h2>Sign in</h2>

      <div class="mb-3">
        <input type="email" class="form-control" placeholder="Email" v-model="email" />
      </div>
      <div class="mb-3">
        <input type="password" class="form-control" placeholder="Password" v-model="password" />
      </div>

      <!-- choose role to sign in as (optional gate) -->
      <div class="mb-3">
        <label class="form-label d-block">Sign in as</label>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" id="roleUser" value="user" v-model="desiredRole">
          <label class="form-check-label" for="roleUser">User</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" id="roleAdmin" value="admin" v-model="desiredRole">
          <label class="form-check-label" for="roleAdmin">Admin</label>
        </div>
      </div>

      <button class="btn btn-primary" :disabled="loading" @click="signin">
        {{ loading ? 'Signing in...' : 'Sign in via Firebase' }}
      </button>

      <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-success mt-3">{{ successMessage }}</p>
    </div>

    <!-- 2) Admin area -->
    <div v-else-if="stage === 'admin'">
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome, admin.</p>
      </div>
      <button class="btn btn-outline-secondary mt-3" @click="logout">Sign out</button>
    </div>

    <!-- 3) User area -->
    <div v-else-if="stage === 'user'">
      <div>
        <h1>User Home</h1>
        <p>Welcome, user.</p>
      </div>
      <button class="btn btn-outline-secondary mt-3" @click="logout">Sign out</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth, db } from '@/firebase/init'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const email = ref('')
const password = ref('')
const desiredRole = ref('user')      // 'user' | 'admin'
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const stage = ref('form')            // 'form' | 'admin' | 'user'

async function signin () {
  errorMessage.value = ''
  successMessage.value = ''
  if (!email.value || !password.value) {
    errorMessage.value = 'Email and password are required.'
    return
  }

  try {
    loading.value = true
    const { user } = await signInWithEmailAndPassword(auth, email.value, password.value)

    // read role from Firestore
    const snap = await getDoc(doc(db, 'users', user.uid))
    if (!snap.exists() || !snap.data()?.role) {
      errorMessage.value = 'No role found for this account.'
      return
    }
    const storedRole = String(snap.data().role)

    // enforce chosen role
    if (desiredRole.value && storedRole !== desiredRole.value) {
      errorMessage.value = `Role mismatch: this account is "${storedRole}".`
      return
    }

    successMessage.value = `Sign in successful: ${user.email} (${storedRole})`
    localStorage.setItem('role', storedRole)

    // switch section on the same page
    stage.value = storedRole === 'admin' ? 'admin' : 'user'
  } catch (e) {
    errorMessage.value = `Sign in failed: ${e.code}`
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function logout () {
  await signOut(auth)
  localStorage.removeItem('role')
  stage.value = 'form'
  email.value = ''
  password.value = ''
  successMessage.value = ''
  errorMessage.value = ''
}
</script>

 



