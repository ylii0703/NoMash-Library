<script setup>
import BHeader from './components/BHeader.vue'
import Form from './components/Form.vue'
</script>

<template>
  <header>
    <BHeader />
  </header>

  <main class="app-container">
    <router-view />
    <Form />
  </main>
</template>

<style scoped>
.app-container {
  max-width: 80vw;
  margin: 40px auto;
  padding: 20px;
}

header { position: relative; z-index: 1000; background: #fff; }
</style>
