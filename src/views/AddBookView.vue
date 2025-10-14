<template>
  <div class="max-w-md mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Add Book</h1>

    <form @submit.prevent="addBook" class="space-y-4">
      <div>
        <label for="isbn" class="block text-sm font-medium mb-1">ISBN (number)</label>
        <input
          id="isbn"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          v-model="isbn"
          required
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label for="name" class="block text-sm font-medium mb-1">Name</label>
        <input
          id="name"
          type="text"
          v-model="name"
          required
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        :disabled="adding"
        class="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      >
        {{ adding ? 'Adding…' : 'Add Book' }}
      </button>
    </form>

    <!-- Optional: show book list below -->
    <BookList class="mt-8" />
  </div>
</template>

<script>
import { ref } from 'vue'
import db from '../firebase/init.js'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import BookList from '../components/BookList.vue'

export default {
  components: { BookList },

  setup() {
    const isbn = ref('')
    const name = ref('')
    const adding = ref(false)

    const addBook = async () => {
      if (adding.value) return
      adding.value = true

      try {
        const isbnNumber = Number(isbn.value)
        if (!Number.isInteger(isbnNumber)) {
          alert('ISBN must be an integer number')
          return
        }
        if (!name.value.trim()) {
          alert('Name is required')
          return
        }

        await addDoc(collection(db, 'books'), {
          isbn: isbnNumber,
          name: name.value.trim(),
          createdAt: serverTimestamp()
        })

        isbn.value = ''
        name.value = ''
        alert('Book added successfully!')
      } catch (error) {
        console.error('Error adding book:', error)
        alert('Failed to add book')
      } finally {
        adding.value = false
      }
    }

    return { isbn, name, addBook, adding }
  }
}
</script>
<style scoped>
:root {
  --bg: #ffffff;
  --text: #1f2937;
  --muted: #6b7280;
  --border: #e5e7eb;
  --primary: #2563eb;
  --primary-contrast: #ffffff;
  --shadow: 0 8px 25px rgba(0,0,0,0.05);
  --radius: 14px;
}

.page {
  max-width: 800px;
  margin: 60px auto;
  padding: 0 24px;
}

/* Card container */
.card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 32px 40px;
  margin-bottom: 36px;
}

/* Titles */
.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--text);
}

.subtitle {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text);
}

/* Form layout */
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 15px;
  color: var(--muted);
}

input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 15px;
  color: var(--text);
  background: #fff;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

/* Button */
.btn {
  align-self: flex-start;
  background: var(--primary);
  color: var(--primary-contrast);
  border: none;
  border-radius: 10px;
  padding: 10px 22px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* List section */
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}

.list-item:last-child {
  border-bottom: none;
}

.book-name {
  font-weight: 600;
  color: var(--text);
  margin-bottom: 2px;
}

.book-meta {
  font-size: 14px;
  color: var(--muted);
}

.book-date {
  font-size: 13px;
  color: var(--muted);
  white-space: nowrap;
}

/* Subtle spacing when stacked */
@media (max-width: 520px) {
  .list-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .btn {
    width: 100%;
    text-align: center;
  }
}
</style>


