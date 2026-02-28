import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '@/views/dashboardPage.vue'
import WelcomePage from '@/views/welcomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcomepage',
      component: WelcomePage,
    },
    {
      path:'/dashboard',
      name: 'dashboardpage',
      component: DashboardPage
    }
  ],
})

export default router
