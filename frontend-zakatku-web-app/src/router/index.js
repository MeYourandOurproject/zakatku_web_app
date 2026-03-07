import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '@/views/DashboardPage.vue'
import WelcomePage from '@/views/WelcomePage.vue'
import LoginPage from '@/views/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcomepage',
      component: WelcomePage,
    },
    {
      path: '/login',
      name: 'loginpage',
      component: LoginPage,
    },
    {
      path: '/dashboard',
      name: 'dashboardpage',
      component: DashboardPage,
    },
  ],
})

export default router
