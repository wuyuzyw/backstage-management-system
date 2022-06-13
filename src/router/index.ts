import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { getCookie } from '@/utils/cookie/index.js'
const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/login', component: () => import('../views/login.vue') },
  { path: '/login', component: () => import('../views/login.vue'), meta: { title: '登入' } },
  {
    path: '/home',
    component: () => import('../views/home/index.vue'),
    meta: { title: '首页', index: '1' },
    children: [
      {
        path: 'product',
        component: () => import('../views/home/main.vue'),
        children: [
          {
            path: 'trademark',
            component: () => import('@/views/home/product/trademark.vue'),
            meta: { title: '品牌管理', index: '3-1' }
          }, {
            path: 'plateform',
            component: () => import('@/views/home/product/plateform.vue'),
            meta: {
              title: '平台属性管理',
              index: '3-2'
            }
          }, {
            path: 'spu',
            component: () => import('@/views/home/product/spu/index.vue'),
            meta: { title: 'Spu管理', index: '3-3' }
          }
        ]
      }]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach(function (to, from, next) {
  if (to.path === '/login') {
    if (getCookie('token')) {
      next('/home')
    } else {
      next()
    }
  } else {
    if (getCookie('token')) {
      next()
    } else {
      next('/login')
    }
  }
})
router.afterEach(function (to) {
  document.title = to.meta.title as string
})
export default router
