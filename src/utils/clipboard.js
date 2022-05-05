import Clipboard from 'clipboard'
import i18n from '@/lang'
import {
  ElMessage
} from 'element-plus'
export default function handleClipboard(text, event, showMessage) {
  return new Promise((res, rej) => {
    const clipboard = new Clipboard(event.target, {
      text: () => text
    })
    clipboard.on('success', (e) => {
      if (showMessage) {
        ElMessage({
          type: 'success',
          message: i18n.t('default.system.clipboard.success')
        })
      }
      res(e)
      clipboard.off('error')
      clipboard.off('success')
      clipboard.destroy()
    })
    clipboard.on('error', (e) => {
      ElMessage({
        type: 'error',
        message: i18n.t('default.system.clipboard.fail')
      })
      rej(e)
      clipboard.off('error')
      clipboard.off('success')
      clipboard.destroy()
    })
    clipboard.onClick(event)
  })
}
