import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import { auth } from './firebase/init'  


const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)
app.mount('#app')

if (typeof window !== 'undefined') window.auth = auth

export { auth }