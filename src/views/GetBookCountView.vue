<template>
  <div class="container">
    <h1>Book Counter</h1>
    <button :disabled="loading" @click="fetchCount">
      {{ loading ? 'Loading…' : 'Get Book Count' }}
    </button>
    <p v-if="typeof count === 'number'">Total number of books: {{ count }}</p>
    <p v-else class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios'
const COUNT_API_URL = 'https://countbooks-yo2a5domnq-uc.a.run.app'  // ←替换成 countBooks 的 URL

export default {
  name: 'GetBookCountView',
  data(){ return { count: null, loading: false, error: '' } },
  methods:{
    async fetchCount(){
      this.loading = true; this.error = ''; this.count = null
      try {
        const { data } = await axios.get(COUNT_API_URL, { timeout: 10000 })
        this.count = data?.count
        if (typeof this.count !== 'number') { this.count = null; this.error = 'Invalid response' }
      } catch (e) {
        this.error = 'Failed to fetch count'
      } finally { this.loading = false }
    }
  }
}
</script>

<style scoped>
.container{padding:16px} .error{color:#c00}
</style>

