import { createRouter, createWebHistory } from 'vue-router'
import * as menu from '../menu'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/test1'
    },
  ]
})

menu.testMenuList().forEach(item => {
  router.addRoute({
    path: '/' + item.url,
    name: item.name,
    component: () => import(`../views/test/${item.name}.vue`)
  })
})

export default router
