import vacation from './vacation'
import inday from './inday'
import AuditStream from './AuditStream'
const applicationRouter = {
  path: '/apply',
  component: () => import('@/layout'),
  redirect: 'noRedirect',
  name: 'Apply',
  meta: {
    ctitle: '请休假',
    icon: 'clipboard'
  },
  children: [vacation, inday,
    {
      path: 'rank',
      component: () => import('@/views/Apply/Rank'),
      name: 'AppliesRank',
      meta: {
        ctitle: '排行榜',
        icon: 'rank'
      }
    }, AuditStream]
}
export default applicationRouter
