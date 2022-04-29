import defaultSettings from '@/settings'
import i18n from '@/lang'

const title = defaultSettings.title || 'XJXT'
export default function getPageTitle(meta) {
  if (!meta) return ''
  const i18n_title = meta.ititle || meta.title
  const direct_title = meta.ctitle
  if (direct_title) return `${direct_title} - ${title}`
  const hasKey = i18n.te(`route.${i18n_title}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${i18n_title}`)
    return `${pageName} - ${title}`
  }
  return title
}
export function generateTitle(meta) {
  const i18n_title = meta.title
  const direct_title = meta.ctitle
  if (direct_title) return direct_title
  const hasKey = i18n.te(`route.${i18n_title}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${i18n_title}`)
    return pageName
  }
  return i18n_title
}
