import Layout from '@/layout'

const router = {
  path: '/problems',
  meta: {
    title: 'default.app.problems.title',
    icon: 'user',
    noCache: true
  },
  component: Layout,
  children: [
    {
      path: 'Practice',
      component: () => import('@/views/problems/Practice'),
      name: 'Practice',
      meta: {
        title: 'default.app.problems.Practice',
        icon: 'user',
        noCache: true
      }
    },
    {
      path: 'needing-enhance',
      component: () => import('@/views/problems/NeedingEnhance'),
      name: 'NeedingEnhance',
      meta: {
        title: 'default.app.problems.NeedingEnhance',
        icon: 'user',
        noCache: true
      }
    }
  ]
}

export default router
