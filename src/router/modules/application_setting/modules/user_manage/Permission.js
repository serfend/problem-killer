const route = {
  path: 'user-permission',
  component: () => import('@/views/PermissionManage'),
  name: 'UsersPermission',
  meta: {
    ctitle: '权限管理',
    icon: 'permission'
  },
}
export default route
