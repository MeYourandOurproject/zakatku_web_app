import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '@/views/DashboardPage.vue'
import DashboardSuperadminPage from '@/views/DashboardSuperadminPage.vue'
import WelcomePage from '@/views/WelcomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import SettingPage from '@/views/SettingPage.vue'

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
      path: '/register',
      name: 'registerpage',
      component: RegisterPage,
    },
    {
      path: '/dashboard',
      name: 'dashboardpage',
      component: DashboardPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard-superadmin',
      name: 'dashboardsuperadminpage',
      component: DashboardSuperadminPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/setting',
      name: 'settingpage',
      component: SettingPage,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    const user = JSON.parse(localStorage.getItem('user'))
    const dashboardPath = user?.role === 'superadmin' ? '/dashboard-superadmin' : '/dashboard'
    next(dashboardPath)
  } else {
    next()
  }
})

export default router
