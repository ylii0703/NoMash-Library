<template>
  <div class="container">
    <header class="d-flex justify-content-between align-items-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link">Home (Week 12)</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link">About</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/register" class="nav-link">Register</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/signin" class="nav-link">Sign in</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/addbook" class="nav-link">Add book</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/getbookcount" class="nav-link">Get book count</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/weather" class="nav-link">Weather</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/getallbookAPI" class="nav-link">Get all book api</router-link>
        </li>
      </ul>

      <div class="d-flex align-items-center gap-3">
        <span v-if="user" class="text-muted small">Signed in: {{ user.email }}</span>
        <button
          v-if="user"
          class="btn btn-outline-secondary btn-sm"
          @click="logout"
        >
          Log out
        </button>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'          // + add
import { auth } from '@/firebase/init'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const user = ref(null)
const router = useRouter()                       // + add

onMounted(() => {
  onAuthStateChanged(auth, (u) => { user.value = u })
})

async function logout() {
  try {
    const prev = auth.currentUser?.email ?? ''   // + add
    sessionStorage.setItem('lastEmail', prev)    // + add（备份到 sessionStorage）
    await signOut(auth)
    console.log('Signed out')
    router.push({ path: '/logout', query: { prev } }) // + add: 跳到新页面显示提示
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>
.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  color: #fff;
  background-color: var(--bs-primary);
}
</style>