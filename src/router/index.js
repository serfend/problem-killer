import Vue from 'vue'
import Router from 'vue-router'
import others from './modules/others/others'
import problems from './modules/problems'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/test',
    component: () => import('@/views/AndTest'),
    name: 'test',
    hidden: true,
    meta: {
      ctitle: '测试',
      icon: 'chart',
      hide_footer: true
    }
  },
  {
    path: '/test-chat',
    component: () => import('@/views/AndTest/Chat'),
    name: 'test2',
    hidden: true,
    meta: {
      ctitle: '测试',
      icon: 'chart',
      hide_footer: true
    }
  }, problems
].concat(others)

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
  path: '/error',
  component: Layout,
  redirect: 'noRedirect',
  hidden: true,
  name: 'ErrorPages',
  meta: {
    title: 'errorPages',
    icon: '404'
  },
  children: [{
    path: '401',
    component: () => import('@/views/error-page/401'),
    hidden: true,
    name: 'Page401',
    meta: {
      title: 'page401',
      noCache: true
    }
  }, {
    path: '404',
    component: () => import('@/views/error-page/404'),
    name: 'Page404',
    hidden: true,
    meta: {
      title: 'page404',
      noCache: true
    }
  }]
}, {
  path: '/error-log',
  component: Layout,
  children: [{
    path: 'log',
    hidden: true,
    component: () => import('@/views/error-log/index'),
    name: 'ErrorLog',
    meta: {
      title: 'errorLog.title',
      icon: 'bug'
    }
  }]
}, {
  path: '*',
  redirect: '/404',
  hidden: true
}]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://serfend.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: false                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
