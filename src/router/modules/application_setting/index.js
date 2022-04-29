
// import user_manager from './modules/user_manage'
import Social from './modules/user_manage/Social'
import Company from './modules/user_manage/Company'
import User from './modules/user_manage/User'
import Permission from './modules/user_manage/Permission'
import UserRestore from './modules/user_manage/UserRestore'
import system from '../system'

const router = {
  path: '/settings',
  component: () => import('@/layout'),
  name: 'ApplicationSetting',
  meta: {
    title: 'application.setting.title',
    icon: 'workset'
  },
  children: [{
    path: 'application-manage',
    component: () => import('@/views/blank'),
    meta: {
      ctitle: '系统数据',
      icon: 'workset'
    },
    children: [Social, Company, User, Permission, UserRestore]
  }, system]
}

export default router
