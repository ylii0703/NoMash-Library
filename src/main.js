import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCKtN4li68wZz9wEbMZzGKNFENRZ_PnTmc',
  authDomain: 'week7-yuchenli.firebaseapp.com',
  projectId: 'week7-yuchenli',
  storageBucket: 'week7-yuchenli.firebasestorage.app',
  messagingSenderId: '469282694835',
  appId: '1:469282694835:web:c62b650fa57d58af46b2c6'
}

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)
app.mount('#app')

export { auth }