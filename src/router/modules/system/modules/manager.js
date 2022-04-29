
const managerRouter =
{
  path: 'manager',
  component: () => import('@/views/PageManager'),
  name: 'PageManager',
  meta: {
    title: 'default.app.manager.title',
    icon: 'workset'
  }
}

export default managerRouter
