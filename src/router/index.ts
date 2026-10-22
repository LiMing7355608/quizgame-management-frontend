import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      children: [
        { path: '', redirect: '/user' },
        {
          path: 'user',
          name: 'user',
          component: () => import('@/views/UserView.vue'),
          meta: { title: '用户管理' },
        },
        {
          path: 'question',
          name: 'question',
          component: () => import('@/views/QuestionView.vue'),
          meta: { title: '题目管理' },
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/user' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  const section = typeof to.meta.title === 'string' ? to.meta.title : ''
  document.title = section ? `${section} · Quiz 后台管理` : 'Quiz 后台管理'
})

export default router
