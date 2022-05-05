import { createApp } from 'vue'
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets


import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import create_error_log from './utils/error-log' // error log

import Editor from '@toast-ui/editor'
// Step 1 : Import language file
import '@toast-ui/editor/dist/i18n/zh-cn'
// Step 2 : Override values of language
Editor.setLanguage('zh-CN', {
  // 'Add row': '[Add Row]' // Default value is 'Add row'
})

/**
 * If you don't want to use mock-server
 * you want to use mockjs for request interception
 * you can execute:
 *
 * import { mockXHR } from '../mock'
 * mockXHR()
 */

const app = createApp(App)
app.config.productionTip = false
create_error_log(app)
import installElementPlus from './plugins/element'
installElementPlus(app)
app.use(store)
  .use(router)
  .use(i18n)
  .mount('#app')
