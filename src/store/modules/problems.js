
const state = {
  current_database: null,
  current_problems: null,
  current_options: null
}

const mutations = {

}

const actions = {
  select_database({ commit, state }, { database, info }) {
    return new Promise((res, rej) => {
      state.current_database = database
      state.current_problems = info.problems
      state.current_options = info.train_options
      return res()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
