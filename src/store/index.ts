import { createStore } from 'vuex'
import getters from './getters'

const modulesFiles = import.meta.globEager('./modules/*.js')

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = Object.keys(modulesFiles).reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles[modulePath]
  const file_pos = moduleName.lastIndexOf('/') || -1
  modules[moduleName.substring(file_pos + 1)] = value.default
  return modules
}, {})
const store = createStore({
  modules,
  getters
})

export default store
