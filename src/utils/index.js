export function getTimeDesc(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const left_desc = `${h}h${m}m${s}s`
  return left_desc
}

export const getDateDelta = (s, e) => {
  const yearDelta = e.getFullYear() - s.getFullYear()
  const monthDelta = e.getMonth() - s.getMonth()
  const dayDelta = e.getDate() - s.getDate()
  return [yearDelta, monthDelta, dayDelta]
}
export const getTimeDelta = (s, e, interval) => {
  const dateSpan = e - s
  return Math.floor(dateSpan / interval)
}
const DateIntervalOption = {
  year: (s, e) => {
    const delta = getDateDelta(s, e)
    if (delta[0] <= 0) return delta[0]
    if (delta[1] < 0 || (delta[1] === 0 && delta[2] < 0)) return delta[0] - 1
    return delta[0]
  },
  month: (s, e) => {
    const delta = getDateDelta(s, e)
    const r = delta[0] * 12 + delta[1]
    if (delta[2] < 0) return r - 1
    return r
  },
  day: (s, e) => {
    const s_date = new Date(s.getYear(), s.getMonth(), s.getDate())
    const e_date = new Date(e.getYear(), e.getMonth(), e.getDate())
    return getTimeDelta(s_date, e_date, 24 * 3600000)
  },
  hour: (s, e) => getTimeDelta(s, e, 3600000),
  minute: (s, e) => getTimeDelta(s, e, 60000),
  second: (s, e) => getTimeDelta(s, e, 1000)
}
/**
 *比较两个日期之间相差的天数
 *
 * @export
 * @param {Date} end
 * @param {Date} start
 * @param {Enum:DateIntervalOption} interval
 * @returns
 */
export function datedifference(end, start, interval = 'day') {
  // start和end是2006-12-18格式
  if (!start) start = new Date()
  if (!end) end = new Date()
  start = new Date(start)
  end = new Date(end)
  const fn = DateIntervalOption[interval]
  if (!fn) return -1
  return fn(start, end)
}

export function relativeDate(d, compareTo) {
  d = new Date(d)
  let now = compareTo || new Date()
  now = new Date(now)
  const nowY = now.getFullYear()
  const dY = d.getFullYear()
  const nowM = now.getMonth() + 1
  const dM = d.getMonth() + 1
  const nowD = now.getDate()
  const dD = d.getDate()
  const sameYear = nowY === dY ? '' : `${dY}年`
  const same = !sameYear && nowM === dM
  const sameMonth = same ? '' : `${dM}月`
  const sameDay = (!sameMonth && nowD === dD) ? '' : `${dD}日`
  const result = `${sameYear}${sameMonth}${sameDay}`
  return result || compareTo || '今天'
}
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  if (time === null) return null
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  var date = toDate(time)

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * 将任意时间转换为时间
 *
 * @export
 * @param {*} time
 * @returns
 */
export function toDate(time) {
  if (typeof time === 'object') {
    return time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    return new Date(time)
  }
}
/**
 * @param {number} time
 * @param {string} option
 * @param {Boolean} show_time 是否显示时分
 * @returns {string}
 */
export function formatTime(time, option, show_time) {
  time = toDate(time)
  const d = new Date(time)
  const now = Date.now()

  let diff = (now - d) / 1000
  const isFuture = diff < 0
  const append = isFuture ? '后' : '前'
  diff = Math.abs(diff)
  let result
  if (!isFuture && diff < 60) {
    return `${Math.floor(diff)}秒${append}`
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}分钟${append}`
  } else if (diff < 3600 * 24) {
    return `${Math.floor(diff / 3600)}小时${append}`
  } else if (diff < 3600 * 24 * 7) {
    const day_diff = Math.abs(datedifference(now, d))
    if (day_diff === 1) {
      result = isFuture ? '明天' : '昨天'
    } else if (day_diff === 2) {
      result = isFuture ? '后天' : '前天'
    } else {
      result = `${day_diff}天${append}`
    }
    if (result && show_time) {
      const m = time.getMinutes() || '整'
      result = `${result}${time.getHours()}点${m}`
    }
    return result
  }
  return parseTime(time, option)
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}
/**
 * 统一将颜色值使用16进制形式表示
 * @name rgbToHex
 * @grammar rgbToHex(value) => value
 * @example
 * rgb(255,255,255)  => "#ffffff"
 */
export function rgbToHex(value) {
  if (/rgba?/.test(value)) {
    const array = value.split(',')
    value = '#'
    for (let i = 0; array.length > i; i++) {
      const color = parseInt(array[i].replace(/[^\d]/gi, ''), 10).toString(16)
      value += color.length === 1 ? '0' + color : color
    }
    value = value.toUpperCase()
  }
  return value
}
/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result
  // var id = Math.round(Math.random() * 10000)
  // console.log('debounce build', id)
  const later = (res, rej) => {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp
    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        // console.log('debounce exec', id)
        result = func.apply(context, args)
        if (res) res(result)
        if (!timeout) context = args = null
      }
    }
  }

  return (...args) => {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    return new Promise((res, rej) => {
      // console.log('debounce request', id)
      // 如果延时不存在，重新设定延时
      if (!timeout) {
        timeout = setTimeout(() => {
          later(res, rej)
        }, wait)
      }
      if (callNow) {
        result = func.apply(context, args)
        context = args = null
        res(result)
      }
    })
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = new Date().getTime()
  const randomNum = parseInt((1 + Math.random()) * 65536)
  return (+`${randomNum}${timestamp}`).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * 数组去重，同id将保留最后一个
 *
 * @export
 * @param {*} array 原数组
 * @param {*} idFunc 如何区分是否重复
 * @return {*}
 */
export function distinct(array, idFunc) {
  if (!idFunc) idFunc = v => v
  const dict = {}
  if (!Array.isArray(array)) return array
  array.forEach(v => { dict[idFunc(v)] = v })
  return Object.values(dict)
}

/**
 * 将数值数组转换为位运算值
 *
 * @export
 * @param {*} array
 * @return {*}
 */
export function arrayToBinaryFlag(array) {
  array = distinct(array || [])
  const v = array.reduce((prev, cur) => prev | cur, 0)
  return v
}

/**
 * 将位运算值解构为数值数组
 *
 * @export
 * @param {*} v
 */
export function binaryFlagToArray(v) {
  let current = 1
  const result = []
  v = Number(v)
  while (current <= v) {
    if (v & current) result.push(current)
    current <<= 1
  }
  return result
}

/**
 *构建树
 *
 * @export
 * @param {*} array
 * @param {*} idFunc
 * @param {*} parentIdFunc
 */
export function arrayToTree(array, idFunc, parentIdFunc) {
  idFunc = idFunc || ((a) => a.id)
  parentIdFunc = parentIdFunc || ((a) => a.parentId)
  const root = []
  const dict = {} // 构建字典
  array.map(i => {
    dict[idFunc(i)] = i
    i.children = []
  })
  array.map(i => {
    const item = dict[parentIdFunc(i)]
    const list = item ? item.children : root
    list.push(i)
  })
  return root
}
