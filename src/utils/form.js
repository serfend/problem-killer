import { Notification } from 'element-ui'
export function FormRecorder(key, defaultItem) {
  this.key = `formRecorder.${key}`
  this.setRecord = (query) => {
    if (Object.prototype.toString.call(query) !== '[object String]"') query = JSON.stringify(query)
    localStorage.setItem(this.key, query)
  }
  this.getRecord = () => {
    const s = JSON.parse(localStorage.getItem(this.key) || '{}')
    if (defaultItem._version) {
      if (!s._version || s._version < defaultItem._version) {
        Notification({
          title: '存储器更新',
          message: `${key}因版本更新已清空其存储的数据。版本由[${s._version || '无版本'}]更新为[${defaultItem._version}]。`,
          duration: 10e3
        })
        this.setRecord(defaultItem)
        return defaultItem
      }
    }
    return Object.assign(defaultItem, s)
  }
}

export function toQueryStartEndByArray(datetime) {
  if (datetime && datetime.length >= 2) {
    return {
      start: datetime[0],
      end: datetime[1]
    }
  } else {
    return null
  }
}

export function toQueryValue(value, build_object_event_is_null) {
  if (build_object_event_is_null || value !== null && value !== undefined && value !== '') {
    return {
      value
    }
  }
  return null
}

export function toQueryStartEnd(start, end) {
  return toQueryStartEndByArray([start, end])
}

export function toQueryArrays(arr) {
  if (!arr) return null
  return {
    arrays: Array.isArray(arr) ? arr : [arr]
  }
}
const today = (startTime) => {
  const nowday = getTimeInDay(new Date())
  const t = nowday >= startTime
  const to_last_day = (t ? 0 : 86400e3)
  const now = new Date(new Date().toLocaleDateString()).getTime()
  return new Date(now - to_last_day + startTime)
}
const first_day_of_month = (t) => {
  const s = new Date(today(t))
  s.setDate(1)
  return s
}
const first_day_of_last_month = (t) => {
  const s = new Date(today(t))
  s.setDate(1)
  s.setMonth(s.getMonth() - 1)
  return s
}
const first_day_of_next_month = (t) => {
  const s = new Date(today(t))
  s.setDate(1)
  s.setMonth(s.getMonth() + 1)
  return s
}
const getChinaDay = (date) => {
  const s = new Date().getDay()
  if (s === 0) return 7
  return s
}
export function datetime_shortcuts(s) {
  s = s || 0
  const s_datetime = [
    {
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', [new Date(today(s)), new Date(today(s).getTime() + 86400e3)])
      }
    },
    {
      text: '昨天',
      onClick(picker) {
        picker.$emit('pick', [
          new Date(today(s) - 86400e3),
          new Date(today(s))
        ])
      }
    },
    {
      text: '本周',
      onClick(picker) {
        const start = today(s) - (getChinaDay(new Date()) - 1) * 86400e3
        picker.$emit('pick', [
          new Date(start),
          new Date(start + 7 * 86400e3)
        ])
      }
    },
    {
      text: '上周',
      onClick(picker) {
        const t = today(s)
        picker.$emit('pick', [
          new Date(t - (getChinaDay(new Date()) + 6) * 86400e3),
          new Date(t - (getChinaDay(new Date()) - 1) * 86400e3)
        ])
      }
    },
    {
      text: '本月',
      onClick(picker) {
        picker.$emit('pick', [
          new Date(first_day_of_month(s) - 86400e3),
          new Date(first_day_of_next_month(s) - 86400e3)
        ])
      }
    },
    {
      text: '上月',
      onClick(picker) {
        picker.$emit('pick', [
          new Date(first_day_of_last_month(s) - 86400e3),
          new Date(first_day_of_month(s) - 86400e3)
        ])
      }
    },
    {
      text: '今年',
      onClick(picker) {
        const y = new Date().getFullYear()
        picker.$emit('pick', [
          new Date(new Date(y, 0, 0).getTime() + s),
          new Date(new Date(y + 1, 0, 0).getTime() + s)
        ])
      }
    }
  ]
  return s_datetime
}
export function getTimeInDay(date) {
  date = new Date(date)
  return date.getHours() * 3600e3 + date.getMinutes() * 60e3 + date.getSeconds() * 1e3
}
export default {
  toQueryArrays,
  toQueryStartEnd,
  toQueryValue,
  toQueryStartEndByArray
}
