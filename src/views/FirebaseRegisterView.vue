<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Firebase Registration</h1>
        <p class="text-center">Register with validations and Firebase Authentication.</p>

        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="username" class="form-label">Username</label>
              <input
                id="username"
                type="text"
                class="form-control"
                v-model="formData.username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                required
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>

            <div class="col-md-6">
              <label for="gender" class="form-label">Gender</label>
              <select id="gender" class="form-select" v-model="formData.gender">
                <option disabled value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="email" class="form-label">Email</label>
              <input id="email" type="email" class="form-control" v-model.trim="formData.email" required />
            </div>

            <div class="col-md-6">
              <label for="suburb" class="form-label">Suburb</label>
              <input id="suburb" type="text" class="form-control" v-model="formData.suburb" />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="password" class="form-label">Password</label>
              <input
                id="password"
                type="password"
                class="form-control"
                v-model="formData.password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                required
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>

            <div class="col-md-6">
              <label for="confirm-password" class="form-label">Confirm password</label>
              <input
                id="confirm-password"
                type="password"
                class="form-control"
                v-model="formData.confirmPassword"
                @blur="() => validateConfirmPassword(true)"
                required
              />
              <div v-if="errors.confirmPassword" class="text-danger">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <!-- Role selection -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="role" class="form-label">Role</label>
              <select id="role" class="form-select" v-model="formData.role" required>
                <option disabled value="">Select role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div class="col-md-6 d-flex align-items-center">
              <div class="form-check mt-3">
                <input id="isAustralian" type="checkbox" class="form-check-input" v-model="formData.isAustralian" />
                <label class="form-check-label" for="isAustralian">Australian Resident?</label>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea
              id="reason"
              class="form-control"
              rows="3"
              v-model.trim="formData.reason"
              @input="validateReason()"
            ></textarea>
            <div v-if="reasonHasFriend" class="text-success mt-1">Great to have a friend</div>
            <div v-if="errors.reason" class="text-danger mt-1">{{ errors.reason }}</div>
          </div>

          <div class="text-center">
            <button :disabled="loading" type="submit" class="btn btn-primary me-2">
              {{ loading ? 'Registering...' : 'Register' }}
            </button>
            <button :disabled="loading" type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>

        <p v-if="ok" class="text-success mt-3">Registration Successful: {{ ok }}</p>
        <p v-if="errMsg" class="text-danger mt-3">Registration Failed: {{ errMsg }}</p>
      </div>
    </div>

    <div class="row mt-5">
      <h4>This is a PrimeVue Datatable.</h4>
      <DataTable :value="submittedCards" tableStyle="min-width: 50rem">
        <Column field="username" header="Username" />
        <Column field="email" header="Email" />
        <Column field="role" header="Role" />
        <Column field="isAustralian" header="Australian Resident" />
        <Column field="gender" header="Gender" />
        <Column field="suburb" header="Suburb" />
        <Column field="reason" header="Reason" />
      </DataTable>
    </div>

    <div class="row mt-5" v-if="submittedCards.length">
      <div class="d-flex flex-wrap justify-content-start">
        <div
          v-for="(card, index) in submittedCards"
          :key="index"
          class="card m-2"
          style="width: 18rem"
        >
          <div class="card-header">User Information</div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Username: {{ card.username }}</li>
            <li class="list-group-item">Email: {{ card.email }}</li>
            <li class="list-group-item">Role: {{ card.role }}</li>
            <li class="list-group-item">Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}</li>
            <li class="list-group-item">Gender: {{ card.gender }}</li>
            <li class="list-group-item">Suburb: {{ card.suburb }}</li>
            <li class="list-group-item">Reason: {{ card.reason }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { auth } from '../firebase/init'
import db from '../firebase/init'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  isAustralian: false,
  reason: '',
  gender: '',
  suburb: ''
})

const submittedCards = ref([])
const loading = ref(false)
const ok = ref('')
const errMsg = ref('')

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  reason: null
})

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const p = formData.value.password
  const up = /[A-Z]/.test(p)
  const low = /[a-z]/.test(p)
  const num = /\d/.test(p)
  const spc = /[!@#$%^&*(),.?":{}|<>]/.test(p)
  if (!(p.length >= 8 && up && low && num && spc)) {
    if (blur) errors.value.password = 'Password must include upper, lower, number, and special character'
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match'
  } else {
    errors.value.confirmPassword = null
  }
}

const reasonHasFriend = computed(() => /friend/i.test(formData.value.reason))
const validateReason = () => {
  errors.value.reason =
    formData.value.reason && formData.value.reason.length < 3
      ? 'Please write a bit more'
      : null
}

function clearForm() {
  formData.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    isAustralian: false,
    reason: '',
    gender: '',
    suburb: ''
  }
  errors.value = {
    username: null,
    password: null,
    confirmPassword: null,
    reason: null
  }
  ok.value = ''
  errMsg.value = ''
}

async function submitForm() {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateReason()
  if (errors.value.username || errors.value.password || errors.value.confirmPassword || errors.value.reason) return
  if (!formData.value.email) { errMsg.value = 'Email is required.'; return }
  if (!formData.value.role)  { errMsg.value = 'Role is required.'; return }

  try {
    loading.value = true
    ok.value = ''
    errMsg.value = ''

    const { user } = await createUserWithEmailAndPassword(auth, formData.value.email, formData.value.password)
    if (formData.value.username) {
      await updateProfile(user, { displayName: formData.value.username })
    }

    // Write profile (including role) to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: formData.value.email,
      username: formData.value.username,
      gender: formData.value.gender,
      suburb: formData.value.suburb,
      reason: formData.value.reason,
      isAustralian: formData.value.isAustralian,
      role: formData.value.role,
      createdAt: serverTimestamp()
    })

    ok.value = user.email
    submittedCards.value.push({ ...formData.value, password: undefined, confirmPassword: undefined })
    formData.value.password = ''
    formData.value.confirmPassword = ''
    console.log('Registered:', user)
  } catch (e) {
    errMsg.value = e.code
    console.error(e.code, e.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}
.form {
  text-align: center;
  margin-top: 50px;
}
#username:focus,
#password:focus,
#isAustralian:focus,
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}
.list-group-item {
  padding: 10px;
}
</style>
