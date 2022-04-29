import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
// const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta)
  const routersLoaded = store.state.permission.routersLoaded
  if (routersLoaded === true) {
    next()
  } else {
    // get user info
    // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
    // const { roles } = await store.dispatch('user/initBase')
    const roles = ['admin']

    // generate accessible routes map based on roles
    const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

    // dynamically add accessible routes
    accessRoutes.map(i => router.addRoute(i))

    // hack method to ensure that addRoutes is complete
    // set the replace: true, so the navigation will not leave a history record
    next({ ...to, replace: true })
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
