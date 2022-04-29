import * as signalR from '@microsoft/signalr'
import { Message } from 'element-ui'
const state = {
  connections: {},
  signalR
}
const mutations = {
}
const actions = {
  registerCallback({ commit, state }, { connection, event, handler, error }) {
    if (!connection) return
    connection.on(event, function () {
      if (arguments.length !== 1) return handler && handler(...arguments)
      const result = arguments[0]
      if (!result || (result.status === undefined && result.message === undefined)) return handler && handler(...arguments)
      if (result.status === 0) return handler && handler(result.data)

      Message({
        message: `${event}出现异常的数据:${result.message}`,
        type: 'error',
        duration: 10000
      })
      return error && error(result)
    })
  },
  // 每次注册都将新建立一个ws连接
  registerWs({ commit, state }, { connection, path, reload }) {
    const cId = connection && connection.connectionId
    console.warn(`ws [${path}] init`, cId || '(first time)', reload ? 'with reload' : '')
    if (reload && state.connections[path] && state.connections[cId]) {
      state.connections[path][cId].close()
      delete state.connections[path][cId]
    }
    if (!state.connections[path] || !state.connections[cId]) {
      connection = new signalR.HubConnectionBuilder()
        .withUrl(path)
        .build()
      connection.start().catch(err => console.error(`ws [${path}] exception`, err))
      if (!state.connections[path]) state.connections[path] = {}
      state.connections[path][connection.connectionId] = connection
    }
    return state.connections[path][connection.connectionId]
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
