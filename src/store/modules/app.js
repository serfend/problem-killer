import Cookies from 'js-cookie'
import {
  getLanguage
} from '@/lang/index'

const state = {
  isReloading: false,
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  language: getLanguage(),
  size: Cookies.get('size') || 'medium',
  clipboard: null,
  shorturl: {
    loading: false,
    content: null
  },
  focus: true,
}

const mutations = {
  RELOAD: (state, opt) => {
    state.isReloading = !opt.complete
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    Cookies.set('language', language)
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  }
}
import { loadDwz } from '@/api/common/dwz'
const checkShortUrl = function (state, content) {
  let start = content.indexOf('￥')
  if (start > -1) {
    start += 1
    const end = content.indexOf('￥', start)
    const key = content.substring(start, end)
    if (key.length === 6) {
      state.shorturl.loading = true
      loadDwz(({
        key,
        pages: { pageIndex: 0, pageSize: 1 },
      })).then(data => {
        const list = data.list
        if (list.length === 0) return
        const shorturl = list[0]
        state.shorturl.content = shorturl.key
      }).finally(() => {
        state.shorturl.loading = false
      })
    }
  }
}
const actions = {
  checkClipboard({ commit, state }, content) {
    if (state.clipboard === content) return
    state.clipboard = content
    checkShortUrl(state, content)
  },
  reload({
    commit
  }, opt) {
    commit('RELOAD', opt)
  },
  toggleSideBar({
    commit
  }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({
    commit
  }, {
    withoutAnimation
  }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({
    commit
  }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLanguage({
    commit
  }, language) {
    commit('SET_LANGUAGE', language)
  },
  setSize({
    commit
  }, size) {
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
