import {
  conferRecordContentType,
  conferRecordType,
  conferType,
  partyGroupType
} from '@/api/zzxt/party-conference/dictionary'

const state = {
  conferRecordContentTypes: null,
  conferRecordContentTypesDict: null,
  conferRecordTypes: null,
  conferRecordTypesDict: null,
  conferContentHost: null,
  conferTypes: null,
  conferTypesDict: null,
  partyGroupType: null,
  partyGroupTypeDict: null
}
const mutations = {
}
const host_dict = (state) => {
  const dict = state.conferRecordTypesDict
  if (!dict) return null
  const result = Object.values(dict).find(i => i.alias === '主持')
  if (!result) console.error('未找到主持人字典，请联系管理员！')
  return result
}
const actions = {
  initDictionary({
    commit,
    state
  }) {
    return new Promise((res, rej) => {
      if (state.conferTypes) return res(state)
      state.conferTypes = {}
      Promise.all([conferRecordContentType(), conferRecordType(), conferType(), partyGroupType()]).then(datas => {
        const toHandleList = ['conferRecordContentTypes', 'conferRecordTypes', 'conferTypes', 'partyGroupType']
        toHandleList.map((name, index) => {
          state[name] = datas[index] && datas[index].list
          const key = `${name}Dict`
          const dict = {}
          if (!state[name]) return
          state[name].map(i => {
            dict[i.value] = i
          })
          state[key] = dict
        })
        state.conferContentHost = host_dict(state)
        res(state)
      }).catch(e => rej(e))
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
