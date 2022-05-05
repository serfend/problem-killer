import ElementPlus from 'element-plus'
import { createI18n } from 'vue-i18n'
import localeZH from 'element-plus/lib/locale/lang/zh-cn'
import localeEN from 'element-plus/lib/locale/lang/en'
import messages from '@/lang'

const i18n = createI18n({
  locale: localeZH.name,
  fallbackLocale: localeEN.name,
  messages,
  globalInjection: true,
})

export default (app) => {
  app.use(ElementPlus, { locale: localeZH })
  app.use(i18n)
}
