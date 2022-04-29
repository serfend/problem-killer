import moment from 'moment'
import zh from 'moment/locale/zh-cn'
moment.updateLocale('zh-cn', zh)
export default {
  'zh-cn': {
    dow: 0,
    dir: 'ltr',
    displayFormat: vm => {
      return vm.type === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
    },
    format: 'YYYY-MM-DD HH:mm:ss',
    lang: {
      label: '中文',
      submit: '确定',
      cancel: '取消',
      now: '现在',
      nextMonth: '下个月',
      prevMonth: '上个月'
    }
  }
}
