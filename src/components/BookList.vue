<template>
  <div>
    <h2 style="margin:0 0 12px;font-weight:700;">Query (run on click)</h2>

    <!-- Query controls -->
    <form @submit.prevent="fetchBooks"
          style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:6px 0 16px;">
      <label>Min ISBN:</label>
      <input v-model.number="minIsbn" type="number" placeholder="1000"
             style="width:120px;padding:6px 8px;border:1px solid #e5e7eb;border-radius:8px;" />

      <label>Order:</label>
      <select v-model="sortDir" style="padding:6px 8px;border:1px solid #e5e7eb;border-radius:8px;">
        <option value="asc">asc</option>
        <option value="desc">desc</option>
      </select>

      <label>Limit:</label>
      <input v-model.number="pageSize" type="number" min="1" max="200"
             style="width:90px;padding:6px 8px;border:1px solid #e5e7eb;border-radius:8px;" />

      <button type="submit" :disabled="loading"
              style="padding:8px 14px;border:none;border-radius:8px;background:#2563eb;color:#fff;font-weight:600;cursor:pointer;">
        {{ loading ? 'Loading…' : 'Search' }}
      </button>
    </form>

    <!-- States -->
    <p v-if="error" style="color:#b91c1c;margin:8px 0;">{{ error }}</p>
    <p v-if="!loading && !books.length" style="color:#6b7280;">No results.</p>

    <!-- Results -->
    <ul v-if="!loading && books.length" style="list-style:none;padding:0;margin:0;">
      <li v-for="b in books" :key="b.id"
          style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;padding:14px 0;border-bottom:1px solid #e5e7eb;">
        <div>
          <div style="font-weight:600;">{{ b.name }}</div>
          <div style="font-size:13px;color:#6b7280;">ISBN: {{ b.isbn }}</div>
        </div>

        <div style="display:flex;gap:8px;">
          <button @click="onEdit(b)" :disabled="busyId === b.id"
                  style="padding:6px 10px;border:none;border-radius:8px;background:#3b82f6;color:#fff;cursor:pointer;">
            {{ busyId === b.id && busyAction === 'edit' ? 'Saving…' : 'Edit' }}
          </button>
          <button @click="onDelete(b.id)" :disabled="busyId === b.id"
                  style="padding:6px 10px;border:none;border-radius:8px;background:#ef4444;color:#fff;cursor:pointer;">
            {{ busyId === b.id && busyAction === 'delete' ? 'Deleting…' : 'Delete' }}
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue'
import db from '../firebase/init.js'
import {
  collection, query, where, orderBy, limit, getDocs,
  doc, updateDoc, deleteDoc
} from 'firebase/firestore'

export default {
  setup () {
    // Query controls
    const minIsbn = ref(1000)
    const sortDir = ref('asc')     // 'asc' | 'desc'
    const pageSize = ref(50)

    // Data & state
    const books = ref([])
    const loading = ref(false)
    const error = ref('')
    const busyId = ref(null)       // row currently updating/deleting
    const busyAction = ref('')     // 'edit' | 'delete'

    // Run query only when user clicks "Search"
    const fetchBooks = async () => {
      loading.value = true
      error.value = ''
      books.value = []

      try {
        // With inequality filter, orderBy on the same field is recommended
        const q = query(
          collection(db, 'books'),
          where('isbn', '>', Number(minIsbn.value)),
          orderBy('isbn', sortDir.value),
          limit(Number(pageSize.value))
        )
        const snap = await getDocs(q)
        books.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      } catch (e) {
        error.value = e?.message ?? String(e)
      } finally {
        loading.value = false
      }
    }

    // Update the book name via prompt, then refresh
    const onEdit = async (book) => {
      const newName = window.prompt('Enter new name:', book.name)
      if (!newName || newName.trim() === book.name) return
      try {
        busyId.value = book.id
        busyAction.value = 'edit'
        await updateDoc(doc(db, 'books', book.id), { name: newName.trim() })
        await fetchBooks()
      } catch (e) {
        alert('Update failed: ' + (e?.message ?? e))
      } finally {
        busyId.value = null
        busyAction.value = ''
      }
    }

    // Delete the document, then refresh
    const onDelete = async (id) => {
      if (!window.confirm('Delete this book?')) return
      try {
        busyId.value = id
        busyAction.value = 'delete'
        await deleteDoc(doc(db, 'books', id))
        await fetchBooks()
      } catch (e) {
        alert('Delete failed: ' + (e?.message ?? e))
      } finally {
        busyId.value = null
        busyAction.value = ''
      }
    }

    return {
      minIsbn, sortDir, pageSize,
      books, loading, error, busyId, busyAction,
      fetchBooks, onEdit, onDelete
    }
  }
}
</script>

