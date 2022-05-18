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
        icon: 'phy-grade',
        noCache: true
      }
    },
    {
      path: 'needing-enhance',
      component: () => import('@/views/problems/NeedingEnhance'),
      name: 'NeedingEnhance',
      meta: {
        title: 'default.app.problems.NeedingEnhance',
        icon: 'HTTPcuowushuai',
        noCache: true
      }
    },
    {
      path: 'preferences',
      component: () => import('@/views/problems/Preferences'),
      name: 'Preferences',
      meta: {
        title: 'default.app.problems.Preferences',
        icon: 'like_filled',
        noCache: true
      }
    },
    {
      path: 'favorite',
      component: () => import('@/views/problems/Favorite'),
      name: 'Favorite',
      meta: {
        title: 'default.app.problems.favorite',
        icon: 'likegood_fill',
        noCache: true
      }
    }
  ]
}

export default router
