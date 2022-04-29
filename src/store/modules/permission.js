import { asyncRoutes, constantRoutes } from '@/router'
import { allPermissions, getPermission, getPermissionBy } from '@/api/permission'

const state = {
  routes: [],
  addRoutes: [],
  routersLoaded: false,
  allPermissions: null,
  allPermissionsDict: null,
  user_permission: null,
  user_permission_by: null,
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    state.routersLoaded = true
  }
}

const actions = {
  initUserPermissionBy({ commit, state }) {
    return new Promise((res, rej) => {
      if (state.user_permission_by) return res(state.user_permission_by)
      getPermissionBy({}).then(data => {
        state.user_permission_by = data.list
        return res(data)
      }).catch(e => {
        state.user_permission_by = null
        return rej(e)
      })
    })
  },
  initUserPermission({ commit, state }) {
    return new Promise((res, rej) => {
      if (state.user_permission) return res(state.user_permission)
      getPermission({}).then(data => {
        state.user_permission = data
        return res(data)
      }).catch(e => {
        state.user_permission = null
        return rej(e)
      })
    })
  },
  initPermissionDict({ commit, state }) {
    return new Promise((res, rej) => {
      if (state.allPermissions) return res(state.allPermissions)
      state.allPermissions = []
      allPermissions().then(data => {
        state.allPermissions = data.list
        state.allPermissionsDict = {}
        state.allPermissions.map(i => {
          state.allPermissionsDict[i.key] = i.description
        })
        return res(state.allPermissions)
      }).catch(e => {
        state.allPermissions = null
        rej(e)
      })
    })
  },
  checkPermission({ commit, state, actions }, { user, permission, action }) {
    return new Promise((res, rej) => {
      const cb = data => {
        console.log(data)
        res()
      }
      actions.initPermissionDict({ commit, state }).then(cb).catch(e => rej(e))
    })
  },
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
