import Layout from '@/layout'

const router = {
  path: '/user',
  component: Layout,
  hidden: true,
  children: [{
    path: 'profile',
    component: () => import('@/views/profile/index'),
    name: 'Profile',
    meta: {
      title: 'profile',
      icon: 'user',
      noCache: true
    }
  }]
}

export default router
