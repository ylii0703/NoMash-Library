<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">

        <!-- Title -->
        <h1 class="text-center">Firebase Registration</h1>
        <p class="text-center">Register with validations and Firebase Authentication.</p>

        <!-- FORM -->
        <form @submit.prevent="submitForm">
          <!-- Username + Gender -->
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
              />
              <div v-if="errors.username" class="text-danger small mt-1">
                {{ errors.username }}
              </div>
            </div>

            <div class="col-md-6">
              <label for="gender" class="form-label">Gender</label>
              <select
                id="gender"
                class="form-select"
                v-model="formData.gender"
                @change="validateGender"
              >
                <option disabled value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div v-if="errors.gender" class="text-danger small mt-1">
                {{ errors.gender }}
              </div>
            </div>
          </div>

          <!-- Email + Suburb -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                type="email"
                class="form-control"
                v-model.trim="formData.email"
                @blur="() => validateEmail(true)"
                @input="() => validateEmail(false)"
              />
              <div v-if="errors.email" class="text-danger small mt-1">
                {{ errors.email }}
              </div>
            </div>

            <div class="col-md-6">
              <label for="suburb" class="form-label">Suburb</label>
              <input
                id="suburb"
                type="text"
                class="form-control"
                v-model="formData.suburb"
                @blur="() => validateSuburb(true)"
                @input="() => validateSuburb(false)"
              />
              <div v-if="errors.suburb" class="text-danger small mt-1">
                {{ errors.suburb }}
              </div>
            </div>
          </div>

          <!-- Password + Confirm Password -->
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
              />
              <div v-if="errors.password" class="text-danger small mt-1">
                {{ errors.password }}
              </div>
            </div>

            <div class="col-md-6">
              <label for="confirm-password" class="form-label">Confirm password</label>
              <input
                id="confirm-password"
                type="password"
                class="form-control"
                v-model="formData.confirmPassword"
                @blur="() => validateConfirmPassword(true)"
                @input="() => validateConfirmPassword(false)"
              />
              <div v-if="errors.confirmPassword" class="text-danger small mt-1">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <!-- Role + Resident -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="role" class="form-label">Role</label>
              <select
                id="role"
                class="form-select"
                v-model="formData.role"
                @change="validateRole"
              >
                <option disabled value="">Select role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div v-if="errors.role" class="text-danger small mt-1">
                {{ errors.role }}
              </div>
            </div>

            <div class="col-md-6 d-flex align-items-center">
              <div class="form-check mt-3">
                <input
                  id="isAustralian"
                  type="checkbox"
                  class="form-check-input"
                  v-model="formData.isAustralian"
                  @change="validateResident"
                />
                <label class="form-check-label" for="isAustralian">
                  Australian Resident?
                </label>
                <div v-if="errors.resident" class="text-danger small mt-1">
                  {{ errors.resident }}
                </div>
              </div>
            </div>
          </div>

          <!-- Reason -->
          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea
              id="reason"
              class="form-control"
              rows="3"
              v-model.trim="formData.reason"
              @input="validateReason"
            ></textarea>

            <!-- little friendly green message -->
            <div v-if="reasonHasFriend" class="text-success small mt-1">
              Great to have a friend
            </div>

            <div v-if="errors.reason" class="text-danger small mt-1">
              {{ errors.reason }}
            </div>
          </div>

          <!-- Submit / Clear -->
          <div class="text-center">
            <button :disabled="loading" type="submit" class="btn btn-primary me-2">
              {{ loading ? 'Registering...' : 'Register' }}
            </button>
            <button
              :disabled="loading"
              type="button"
              class="btn btn-secondary"
              @click="clearForm"
            >
              Clear
            </button>
          </div>
        </form>

        <!-- overall form status -->
        <p v-if="ok" class="text-success mt-3">
          Registration Successful: {{ ok }}
        </p>
        <p v-if="errMsg" class="text-danger mt-3">
          Registration Failed: {{ errMsg }}
        </p>
      </div>
    </div>

    <!-- PrimeVue DataTable -->
    <div class="row mt-5">
      <h4>This is a PrimeVue Datatable.</h4>
      <DataTable :value="submittedCards" stripedRows tableStyle="min-width: 50rem">
        <Column field="username" header="Username" />
        <Column field="email" header="Email" />
        <Column field="role" header="Role" />
        <Column field="isAustralian" header="Australian Resident" />
        <Column field="gender" header="Gender" />
        <Column field="suburb" header="Suburb" />
        <Column field="reason" header="Reason" />
      </DataTable>
    </div>

    <!-- Bootstrap Card fallback display -->
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
            <li class="list-group-item">
              Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}
            </li>
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

/* --- reactive form state --- */
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

/* --- submitted list for DataTable --- */
const submittedCards = ref([])

/* --- UI state --- */
const loading = ref(false)
const ok = ref('')
const errMsg = ref('')

/* --- validation error messages --- */
const errors = ref({
  username: null,
  email: null,
  password: null,
  confirmPassword: null,
  role: null,
  resident: null,
  reason: null,
  gender: null,
  suburb: null
})

/* --- individual validation functions --- */
const validateName = (blur) => {
  if (formData.value.username.trim().length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validateEmail = (blur) => {
  // simple email regex check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email)) {
    if (blur) errors.value.email = 'Please enter a valid email address'
  } else {
    errors.value.email = null
  }
}

const validatePassword = (blur) => {
  const p = formData.value.password
  const hasUpper = /[A-Z]/.test(p)
  const hasLower = /[a-z]/.test(p)
  const hasNum = /\d/.test(p)
  const hasSpec = /[!@#$%^&*(),.?":{}|<>]/.test(p)
  const longEnough = p.length >= 8

  if (!(longEnough && hasUpper && hasLower && hasNum && hasSpec)) {
    if (blur) {
      errors.value.password =
        'Password must include upper, lower, number, and special character'
    }
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur)
      errors.value.confirmPassword = 'Passwords do not match'
  } else {
    errors.value.confirmPassword = null
  }
}

const validateRole = () => {
  errors.value.role = formData.value.role
    ? null
    : 'Please select a role'
}

const validateGender = () => {
  errors.value.gender = formData.value.gender
    ? null
    : 'Please select a gender'
}

const validateResident = () => {
  errors.value.resident = formData.value.isAustralian
    ? null
    : 'Please confirm residency'
}

const validateSuburb = (blur) => {
  if (formData.value.suburb.trim().length < 3) {
    if (blur) errors.value.suburb = 'Suburb must be at least 3 characters'
  } else {
    errors.value.suburb = null
  }
}

const validateReason = () => {
  if (!formData.value.reason || formData.value.reason.length < 3) {
    errors.value.reason = 'Please write a bit more'
  } else {
    errors.value.reason = null
  }
}

/* fun green message if user types "friend" */
const reasonHasFriend = computed(() => /friend/i.test(formData.value.reason))

/* --- clear form & reset errors --- */
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
  Object.keys(errors.value).forEach((k) => {
    errors.value[k] = null
  })
  ok.value = ''
  errMsg.value = ''
}

/* --- submit handler --- */
async function submitForm() {
  // run all validations (final pass)
  validateName(true)
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateRole()
  validateResident()
  validateReason()
  validateGender()
  validateSuburb(true)

  // block submit if ANY error still present
  const hasError = Object.values(errors.value).some((msg) => msg)
  if (hasError) {
    errMsg.value = 'Please fix the errors above before submitting.'
    return
  }

  try {
    loading.value = true
    ok.value = ''
    errMsg.value = ''

    // create auth user in Firebase
    const { user } = await createUserWithEmailAndPassword(
      auth,
      formData.value.email,
      formData.value.password
    )

    // set displayName in Firebase Auth
    if (formData.value.username) {
      await updateProfile(user, { displayName: formData.value.username })
    }

    // persist profile in Firestore
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

    // add row to PrimeVue table (omit passwords for safety)
    submittedCards.value.push({
      username: formData.value.username,
      email: formData.value.email,
      role: formData.value.role,
      isAustralian: formData.value.isAustralian,
      gender: formData.value.gender,
      suburb: formData.value.suburb,
      reason: formData.value.reason
    })

    // reset password fields after submit
    formData.value.password = ''
    formData.value.confirmPassword = ''
  } catch (e) {
    errMsg.value = e.code || 'Registration failed.'
    console.error(e.code, e.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}

/* nice little card style for the fallback cards */
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

.small {
  font-size: 0.85rem;
}
</style>
