<!-- src/views/GetAllBookAPI.vue -->
<template>
  <div class="container mt-5">
    <h1 class="text-center">Get All Books API</h1>

    <div class="text-center">
      <button class="btn btn-primary" :disabled="loading" @click="fetchBooks">
        {{ loading ? "Loading..." : "Get All Books" }}
      </button>
    </div>

    <div v-if="error" class="text-danger text-center mt-3">
      {{ error }}
    </div>

    <div v-else-if="books.length" class="mt-4">
      <p><strong>Total books:</strong> {{ count }}</p>
      <pre class="bg-light p-3 rounded" style="white-space: pre-wrap;">
{{ prettyBooks }}
      </pre>
    </div>

    <div v-else-if="!loading" class="text-center mt-3">
      No books found.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

// Replace with your real run.app URL for getAllBooks
const API_URL = 'https://us-central1-week7-yuchenli.cloudfunctions.net/getAllBooks'

const books = ref([])
const count = ref(0)
const error = ref('')
const loading = ref(false)

const prettyBooks = computed(() => JSON.stringify(books.value, null, 2))

async function fetchBooks() {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get(API_URL)
    count.value = res.data.count || 0
    books.value = res.data.books || []
  } catch (e) {
    console.error('Error fetching books:', e)
    error.value = e?.response?.data?.error || 'Failed to load books'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
pre {
  max-height: 500px;
  overflow: auto;
}
</style>
