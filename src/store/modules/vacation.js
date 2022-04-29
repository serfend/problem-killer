import {
  getAllStatus, getRequestTypes
} from '@/api/apply'
const state = {
  vacationDetail: {}, // 当前选中的休假详情
  statusDic: [], // 休假申请状态的描述
  actionDic: {}, // 状态操作对应
  vacationTypes: null, // 假期类型
  executeStatus: null, // 假期落实状态
  requestTypes: null, // 请假类型
}

const mutations = {
  SET_StatusDic: (state, statusDic) => {
    state.statusDic = statusDic
  },
  SET_ActionDic: (state, val) => {
    state.actionDic = val
  },
  SET_VacationType: (state, val) => {
    state.vacationTypes = val
  },
  SET_ExecuteStatus: (state, val) => {
    state.executeStatus = val
  },
  SET_RequestType: (statae, val) => {
    state.requestTypes = val
  }
}

const actions = {
  initDic({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      const actions = []
      actions.push(getAllStatus().then(data => {
        commit('SET_StatusDic', data.list)
        commit('SET_ActionDic', data.actions)
        commit('SET_VacationType', data.vacationTypes)
        commit('SET_ExecuteStatus', data.executeStatus)
      }))
      actions.push(getRequestTypes().then(data => {
        commit('SET_RequestType', data.model)
      }))
      Promise.all(actions).then(() => {
        return resolve()
      })
        .catch(() => {
          return reject()
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
