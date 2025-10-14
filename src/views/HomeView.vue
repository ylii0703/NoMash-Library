<template>
  <div class="container mt-5 text-center">
    <h1>Welcome to NoMash Library</h1>
    <p class="lead">This is the homepage. Use the navigation bar to access features.</p>
    <div class="mt-4">
      <router-link to="/register" class="btn btn-primary me-2">Go to Register</router-link>
      <router-link to="/signin" class="btn btn-outline-secondary">Go to Sign in</router-link>
    </div>
  </div>
</template>

<script setup>
// No logic needed for the home page
</script>

<style scoped>
.container {
  max-width: 700px;
}
</style>