const route = {
  path: 'versionHandle',
  component: () => import('@/views/UpdateRecord'),
  name: 'UpdateRecord',
  hidden: false,
  meta: {
    title: 'application.setting.updateRecord',
    icon: 'fanhuima'
  }
}
export default route
