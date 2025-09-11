<script setup>
import BHeader from '@/components/BHeader.vue'
</script>

<template>
  <header>
    <BHeader />
  </header>

  <main class="app-container">
    <router-view />
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
