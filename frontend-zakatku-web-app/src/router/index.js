import { createRouter, createWebHistory } from 'vue-router'
import welcomePage from '@/views/welcomePage.vue'
import dashboardPage from '@/views/dashboardPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcomepage',
      component: welcomePage,
    },
    {
      path:'/dashboard',
      name: 'dashboardpage',
      component: dashboardPage
    }
  ],
})

export default router
