import {
  getUserBase,
  getUserSummary,
  getUserAvatar,
} from '@/api/user/userinfo'
import {
  login,
  logout
} from '@/api/account'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import router, {
  resetRouter
} from '@/router'
import defaultAvatar from '@/assets/plain/defaultAvatar.js'
import { Message } from 'element-ui'

const state = {
  isUserLogout: false,
  data: {},
  token: getToken(),
  name: '',
  companyid: '',
  dutiesType: '',
  userid: '',
  avatar: defaultAvatar,
  introduction: '',
  roles: [],
  isToRegister: true,
  loading: false
}
export function clear_login_status(commit) {
  commit('SET_TOKEN', '')
  commit('SET_NAME', '')
  commit('SET_USERID', '')
  commit('SET_CMPID', '')
  commit('SET_AVATAR', defaultAvatar)
  commit('SET_DATA', null)
  commit('SET_INTRODUCTION', '')
  commit('SET_ISUSERLOGOUT', true)
  removeToken()
  resetRouter()
}
const mutations = {
  SET_ISUSERLOGOUT: (state, val) => {
    state.isUserLogout = val
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_USERID: (state, userid) => {
    state.userid = userid
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_CMPID: (state, name) => {
    state.companyid = name
  },
  SET_DUTYTYPE: (state, type) => {
    state.dutiesType = type
  },
  SET_DATA: (state, data) => {
    state.data = data
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  initUserInfo({ commit, state }) {
    if (state.loading) return
    state.loading = true

    setTimeout(() => {
      state.loading = false
    }, 1e3)
    const b = this.dispatch('user/initBase').then(() => {
      const b1 = this.dispatch('user/initAvatar')
      return Promise.all([b1])
    })
    return Promise.all([b])
  },
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password,
      verify,
      RememberMe
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password,
        RememberMe: RememberMe,
        verify: {
          code: verify
        }
      }).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  check_login({ commit, state }) {
    if (!state.userid) return
    // TODO 检查当前是否登录，若未登录，则重置个人信息为空
    getUserBase().then(data => { }).catch(e => {
      Message({
        message: '已超时退出登录',
        duration: 0,
        type: 'error'
      })
      clear_login_status(commit)
    })
  },
  initBase({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      console.log('start get summary')
      getUserSummary().then(data => {
        commit('SET_NAME', data.realName)
        commit('SET_USERID', data.id)
        commit('SET_CMPID', data.companyCode)
        commit('SET_DUTYTYPE', data.dutiesRawType)
        commit('SET_INTRODUCTION', data.about)
        commit('SET_DATA', data)
        console.log('complete get summary')
        return resolve()
      }).catch(() => {
        return reject()
      })
    })
  },
  initAvatar({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getUserAvatar(null, null, true).then(data => {
        commit('SET_AVATAR', data.url)
        return resolve()
      }).catch(() => {
        commit('SET_AVATAR', defaultAvatar)
        return reject()
      })
    })
  },
  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        clear_login_status(commit)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // Dynamically modify permissions
  changeRoles({
    commit,
    dispatch
  }, role) {
    return new Promise(resolve => {
      const token = role + '-token'
      commit('SET_TOKEN', token)
      setToken(token)
      const {
        roles
      } = dispatch('getInfo')
      resetRouter()
      // generate accessible routes map based on roles
      const accessRoutes = dispatch('permission/generateRoutes', roles, {
        root: true
      })

      // dynamically add accessible routes
      accessRoutes.map(i => router.addRoute(i))

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
