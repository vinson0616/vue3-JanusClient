import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/login/Login'
import Meeting from '@/views/meeting/Meeting'

const routes = [
  {
    path: '/',
    name: 'Meeting',
    component: Meeting
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
