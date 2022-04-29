import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang

import {
  downloadByPath,
} from '@/api/common/file'
Vue.use(VueI18n)
const lang = ['zh', 'en']
const messages = {
  en: {
    ...elementEnLocale
  },
  zh: {
    ...elementZhLocale
  }
}
for (let i = 0; i < lang.length; i++) {
  const l = lang[i]
  const lastLang = localStorage.getItem(`lang.${l}`)
  if (lastLang) {
    Object.assign(messages[l], JSON.parse(lastLang))
  } else {
    const langInfo = require(`./${l}.json`)
    Object.assign(messages[l], langInfo)
  }
  downloadByPath({ path: 'dataview', filename: `${l}.json`, ignoreError: true }).then((d) => {
    const dict = d
    dict.tagsView = dict.settings
    dict.route = Object.assign({}, dict)
    Object.keys(dict.navbar).forEach((k) => {
      dict.route[k] = dict.navbar[k]
    })
    Object.assign(messages[l], dict)
    localStorage.setItem(`lang.${l}`, JSON.stringify(dict))
    i18n.setLocaleMessage(l, messages[l])
  }).catch(e => {
    console.warn('lang file load fail', e)
  })
}
// console.log('default lang loaded', JSON.stringify(messages))

export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (var locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'en'
}
const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: getLanguage(),
  // set locale messages
  messages
})
export default i18n
