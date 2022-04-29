import Clipboard from 'clipboard'
import i18n from '@/lang'
import {
  Message
} from 'element-ui'
export default function handleClipboard(text, event, showMessage) {
  return new Promise((res, rej) => {
    const clipboard = new Clipboard(event.target, {
      text: () => text
    })
    clipboard.on('success', (e) => {
      if (showMessage) {
        Message({
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
      Message({
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
