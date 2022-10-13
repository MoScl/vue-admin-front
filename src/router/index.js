import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
      path: '/',
      name: 'Home',
      component: () => import('@/views/home/index.vue')
    }, {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue')
    }, {
      path: '/lottery',
      name: 'lottery',
      component: () => import('@/views/lottery/index.vue')
    }]
})

export default router
