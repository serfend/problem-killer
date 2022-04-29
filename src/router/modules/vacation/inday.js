/** When your routing table is too long, you can split it into small modules **/

/* Router Modules */
const applicationRouter = {
  path: 'inday',
  component: () => import('@/views/blank'),
  redirect: 'noRedirect',
  name: 'inday-apply',
  meta: {
    ctitle: '请假管理',
    icon: 'clipboard'
  },
  children: [
    {
      path: 'newApply',
      component: () => import('@/views/Apply/NewApply/IndayNewApply'),
      name: 'indayNewApplication',
      meta: {
        ctitle: '我要请假',
        icon: 'newapply'
      }
    },
    {
      path: 'myApply',
      component: () => import('@/views/Apply/MyApply/IndayMyApply'),
      name: 'indayMyApply',
      meta: {
        ctitle: '我的外出',
        icon: 'principal'
      }
    },
    {
      path: 'queryAndAuditApplies',
      component: () => import('@/views/Apply/QueryAndAuditApplies/IndayQueryAndAuditApplies'),
      name: 'indayApplicationList',
      meta: {
        ctitle: '审批外出',
        icon: 'auditapply'
      }
    },
    {
      path: 'applyDetail',
      component: () => import('@/views/Apply/ApplyDetail/IndayApplyDetail'),
      name: 'indayApplyDetail',
      meta: {
        ctitle: '外出详情',
        icon: 'menu-outoforder'
      },
      hidden: true
    }
  ]
}

export default applicationRouter
