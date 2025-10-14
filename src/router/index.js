import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import FirebaseLogoutView from '../views/FirebaseLogoutView.vue'
import AddBookView from '@/views/AddBookView.vue'
import GetBookCountView from '@/views/GetBookCountView.vue'
import WeatherView from '@/views/WeatherView.vue'
import GetAllBookAPI from '@/views/GetAllBookAPI.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/signin', name: 'signin', component: FirebaseSigninView },
  { path: '/register', name: 'register', component: FirebaseRegisterView },
  { path: '/logout', name: 'logout', component: FirebaseLogoutView },
  { path: '/addbook', name: 'addbook', component: AddBookView },
  { path: '/getbookcount', name: 'getbookcount', component: GetBookCountView },
  { path: '/weather', name: 'weather', component: WeatherView },
  { path: '/getallbookapi', name: 'getallbookapi', component: GetAllBookAPI },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
