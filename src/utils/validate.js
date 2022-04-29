import { formatTime } from '.'

/**
 * Created by jiachenpan on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function checkUserValid(val) {
  return val === null ? 0 : val === '00Invalid' ? -1 : 1 // 通过邀请人判断当前用户，当邀请人为invalid，表示审核不通过，需要重新注册
}
/**
 * 校验身份证
 *
 * @export
 * @param {*} code 身份证号
 * @param {*} birthDay 出生日期
 * @param {*} location 6位出生地点行政区划
 * @param {*} gender 奇数男，偶数女
 * @returns
 */
export function cidValid(code, birthDay, location, gender) {
  // 身份证号合法性验证
  // 支持15位和18位身份证号
  // 支持地址编码、出生日期、校验位验证
  const city = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外 ' }
  var row = true
  var msg = ''

  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(code)) {
    row = false
    msg = '基本格式校验错误'
  } else if (!city[code.substr(0, 2)]) {
    row = false
    msg = '地址编码错误'
  } else if (gender && gender % 2 !== code[16] % 2) {
    row = false
    msg = '性别不匹配,应为' + (code[16] % 2) === 0 ? '女' : '男'
  } else if (location && location !== code.substr(0, 6)) {
    row = false
    msg = '籍贯不匹配,应为' + code.substr(0, 6)
  } else if (birthDay && formatTime(birthDay, '{yyyy}{mm}{dd}') !== code.substr(6, 6)) {
    row = false
    msg = '生日不匹配，应为' + code.substr(6, 6)
  } else {
    // 18位身份证需要验证最后一位校验位
    if (code.length === 18) {
      code = code.split('')
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      // 校验位
      const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      var sum = 0
      var ai = 0
      var wi = 0
      for (var i = 0; i < 17; i++) {
        ai = code[i]
        wi = factor[i]
        sum += ai * wi
      }
      if ((parity[sum % 11] + '') !== code[17].toUpperCase()) {
        row = false
        msg = '校验位错误,应为' + parity[sum % 11] + ',实际为' + code[17].toUpperCase()
      }
    }
  }
  return {
    valid: row,
    msg
  }
}
/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return str && str.length >= 7
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

export function validPhone(phone) {
  if (!phone) return '未填写'
  if (phone.length !== 11) return `长度应有11位，实际${phone.length}位`
  const reg = /^1[3456789]\d{9}$/
  if (reg.test(phone)) return null
  return '格式有误'
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}
