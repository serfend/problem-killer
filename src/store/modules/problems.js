
const state = {
  current_database: null,
  current_problems: null,
  current_options: null,
  preferences: null
}

const mutations = {

}
import api from '@/api/problems'
import api_preferences from '@/api/problems/preferences'
const actions = {
  select_database({ commit, state }, { database }) {
    return new Promise((res, rej) => {
      api.user_database_detail({ name: database.name })
        .then(info => {
          state.current_database = database
          state.current_problems = info.problems || {}
          state.current_options = info.train_options
          console.log('select_database', state)
          return res()
        }).catch(e => rej(e))
    })
  },
  update_database({ commit, state, dispatch }) {
    if (!state.current_database) return
    return dispatch('select_database', { database: state.current_database })
  },
  update_preferences({ state }) {
    return api_preferences.user_preferences({}).then(data => {
      state.preferences = data
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
