/** When your routing table is too long, you can split it into small modules **/

import application from '../application_setting/modules/application'
/* Router Modules */
const applicationRouter = {
  path: 'vacation',
  component: () => import('@/views/blank'),
  redirect: 'noRedirect',
  name: 'vacation',
  meta: {
    title: 'application.title',
    icon: 'clipboard'
  },
  children: [
    {
      path: 'newApply',
      component: () => import('@/views/Apply/NewApply/VacationNewApply'),
      name: 'vacationNewApplication',
      meta: {
        title: 'application.new',
        icon: 'newapply'
      }
    },
    {
      path: 'myApply',
      component: () => import('@/views/Apply/MyApply/VacationMyApply'),
      name: 'vacationMyApply',
      meta: {
        title: 'application.my',
        icon: 'principal'
      }
    },
    {
      path: 'queryAndAuditApplies',
      component: () => import('@/views/Apply/QueryAndAuditApplies/VacationQueryAndAuditApplies'),
      name: 'vacationApplicationList',
      meta: {
        title: 'application.audit',
        icon: 'auditapply'
      }
    },
    {
      path: 'applyDetail',
      component: () => import('@/views/Apply/ApplyDetail/VacationApplyDetail'),
      name: 'vacationApplyDetail',
      meta: {
        title: 'application.detail',
        icon: 'menu-outoforder'
      },
      hidden: true
    },
    application
  ]
}

export default applicationRouter
