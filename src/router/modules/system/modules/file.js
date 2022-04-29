
const fileRouter =
{
  path: 'fileEngine',
  component: () => import('@/views/common/FileEngine/index'),
  name: 'FileEngine',
  hidden: false,
  meta: {
    title: 'default.app.file.title',
    icon: 'doc'
  }
}

export default fileRouter
