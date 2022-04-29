import Export from './modules/Export'
const route = {
  path: 'application',
  component: () => import('@/views/blank'),
  name: 'Application',
  meta: {
    ctitle: '数据管理',
    icon: 'task_done'
  },
  children: [Export,
    {
      path: 'dashboard',
      component: () => import('@/views/dashboard/redirect'),
      name: 'ApplyDashboard',
      meta: {
        title: 'dashboard',
        icon: 'chart',
        hide_footer: true
      }
    }]
}
export default route
