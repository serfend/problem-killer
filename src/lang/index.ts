import { createI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-plus/es/locale/lang/en'
import elementZhLocale from 'element-plus/es/locale/lang/zh-cn'

import {
  downloadByPath,
} from '@/api/common/file'
const lang = ['zh', 'en']
const messages = {
  en: {
    ...elementEnLocale
  },
  zh: {
    ...elementZhLocale
  }
}
const langInfos = import.meta.globEager('./*.json')
for (let i = 0; i < lang.length; i++) {
  const l = lang[i]
  const lastLang = localStorage.getItem(`lang.${l}`)
  if (lastLang) {
    Object.assign(messages[l], JSON.parse(lastLang))
  } else {
    const file_name = `./${l}.json`
    const langInfo = langInfos[file_name]
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
const i18n = createI18n({
  // set locale
  // options: en | zh | es
  locale: getLanguage(),
  // set locale messages
  messages,
  globalInjection: true,
})
export default i18n
