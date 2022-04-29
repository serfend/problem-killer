const state = {
  setting: null
}
import {
  pairSetting
} from '@/utils/data-handle'
import {
  createSetting
} from './dashboard/index'
import {
  loadSettingString
} from './dashboard/index'

const actions = {
  saveSetting({
    commit,
    state
  }, {
    name,
    setting
  }) {
    localStorage.setItem(`dashboard.setting[${name}]`, JSON.stringify(setting))
  },
  loadSetting({
    commit,
    state
  }, {
    name
  }) {
    return new Promise((res, rej) => {
      const rawSetting = loadSettingString(name)
      if (rawSetting) {
        const s = JSON.parse(rawSetting)
        const newSetting = createSetting()
        pairSetting(newSetting, s)
        state.setting = Object.assign({}, newSetting)
        console.log('setting is load:', name, state.setting, newSetting)
        res(state.setting)
      } else {
        console.log('setting not exist:', name)
        rej()
      }
    })
  },
  init({
    commit,
    state
  }) {
    console.log('create setting')
    state.setting = createSetting()
  }
}
export default {
  namespaced: true,
  state,
  actions
}
