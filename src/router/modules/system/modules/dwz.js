
const dwzRouter =
{
  path: 'dwz',
  component: () => import('@/views/common/ShortUrl'),
  name: 'ShortUrlView',
  hidden: false,
  meta: {
    title: 'default.app.dwz.title',
    icon: 'link'
  }
}

export default dwzRouter
