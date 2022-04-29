import { downloadByPath } from '@/api/common/file'
import { Message } from 'element-ui'
import { downloadBlob, exportXlsByTemplate } from '@/utils/file'
const state = {
  templates: {},
}
const mutations = {
}

const actions = {
  download_xlsx({ commit, state, dispatch }, { templateName, templatePath, data, filename }) {
    return new Promise((res, rej) => {
      const t = dispatch('initTemplate', { templateName, templatePath })
      t.then(template_data => {
        const xlsx_data = exportXlsByTemplate(template_data, data)
        downloadBlob(xlsx_data, filename)
        Message.success('已下载')
        res()
      }).catch(e => rej(e))
    })
  },
  initTemplate({ commit, state }, { templateName, templatePath }) {
    templatePath = templatePath || 'xlsTemplate'
    return new Promise((res, rej) => {
      if (state.templates[templateName]) { return res(state.templates[templateName]) }

      state.templates[templateName] = {}
      downloadByPath({ path: templatePath, filename: templateName, ignoreError: false, responseType: 'arraybuffer' }).then(data => {
        if (data.byteLength < 1e2) {
          const d = '加载模板失败'
          Message.error(d)
          return rej(d)
        }
        state.templates[templateName] = data
        res(data)
      }).catch(e => {
        state.templates[templateName] = null
        rej(e)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
