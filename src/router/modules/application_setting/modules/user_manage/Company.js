const router = {
  path: 'company',
  component: () => import('@/views/usersManager/Company'),
  name: 'Company',
  meta: {
    title: 'application.setting.users.company',
    icon: 'homepage_fill'
  }
}

export default router
