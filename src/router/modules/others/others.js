export default [
  {
    path: '/redirect',
    component: () => import('@/layout'),
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () => import('@/views/redirect/index')
    }]
  }, {
    path: '/markdown',
    component: () => import('@/components/MarkdownEditor'),
    hidden: true
  }, {
    path: '/contactme',
    component: () => import('@/components/ContactMe'),
    hidden: true
  }, {
    path: '/qrCodeGenerate',
    component: () => import('@/components/ContactMe/QrCodeGenerate'),
    hidden: true
  }, {
    path: '/register',
    component: () => import('@/layout'),
    children: [{
      path: '/forget',
      component: () => import('@/views/ForgetPassword'),
      hidden: true
    }, {
      path: 'approve',
      component: () => import('@/views/register/approve')
    }],
    hidden: true
  }, {
    path: '/register/user',
    component: () => import('@/views/register/register'),
    hidden: true
  }, {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  }, {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  }, {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }, {
    path: '',
    hidden: true,
    component: () => import('@/views/welcome/problem_pratice')
  }
]
