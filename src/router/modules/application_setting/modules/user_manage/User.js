const route = {
  path: 'user-manager',
  component: () => import('@/views/register/approve'),
  name: 'UsersManage',
  meta: {
    title: 'application.setting.users.title',
    icon: 'patriarch'
  },
}
export default route
