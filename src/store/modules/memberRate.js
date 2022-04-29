import { status_dict } from '@/api/memberRate/query'

const state = {
  levelAssignStatusDict: null,
  levelAssignStatusDictInit: false
}
const mutations = {
  CHANGE_SETTING: (state, {
    key,
    value
  }) => {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      state[key] = value
    }
  }
}

const actions = {
  initLevelAssignStatusDict({ commit, state }) {
    if (state.levelAssignStatusDictInit) {
      return new Promise((res) => {
        res()
      })
    }
    state.levelAssignStatusDictInit = true
    return status_dict().then(data => {
      state.levelAssignStatusDict = data.model
    }).catch(e => {
      state.levelAssignStatusDictInit = false
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
