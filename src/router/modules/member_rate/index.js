import Layout from '@/layout'

const router = {
  path: '/memberRate',
  component: Layout,
  children: [{
    path: 'welcome',
    hidden: true,
    meta: {
      ctitle: '考核纪实',
      icon: 'namecard'
    },
    component: () => import('@/views/MemberRate/Welcome')
  }, {
    path: 'upload',
    hidden: true,
    meta: {
      ctitle: '评级上传',
      icon: 'namecard'
    },
    component: () => import('@/views/MemberRate/Upload')
  }, {
    path: 'summary',
    meta: {
      ctitle: '周考月评',
      icon: 'exam'
    },
    component: () => import('@/views/MemberRate')
  }, {
    path: 'summary-quarter',
    meta: {
      ctitle: '季度考评',
      icon: 'exam'
    },
    component: () => import('@/views/Loading')
  }, {
    path: 'summary-special',
    meta: {
      ctitle: '专项考评',
      icon: 'exam'
    },
    component: () => import('@/views/Loading')
  }, {
    path: 'summary-annual',
    meta: {
      ctitle: '年度考评',
      icon: 'exam'
    },
    component: () => import('@/views/Loading')
  }],
  name: 'MemberRate',
  meta: {
    ctitle: '考核纪实',
    icon: 'component'
  }
}

export default router
