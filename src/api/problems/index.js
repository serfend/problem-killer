import request from '@/utils/request'
const api = '/data/problems/'
export function get_database () {
  return request.get(`${api}index.json`, {})
}
export function get_database_detail(name) {
  return request.get(`${api}database/${name}.json`, {})
}
// TODO 根据不同用户给出不同的库
const api_user = 'problems/database/'

/**
 * 用户题库答题信息
 *
 * @export
 * @param {*} name 题库名称
 * @param {*} val 新的值
 * @return {*}
 */
export function user_database_detail({ name, val }) {
  return new Promise((res, rej) => {
    const path = `${api_user}/db/${name}`
    if (val) {
      localStorage.setItem(path, JSON.stringify(val))
      return res()
    }
    const d = localStorage.getItem(path)
    res((d && JSON.parse(d)) || {})
  })
}

/**
 * 用户统计信息
 *
 * @export
 * @param {*} val 新的值
 * @return {*}
 */
export function user_database_summary({ val }) {
  return new Promise((res, rej) => {
    const path = `${api_user}/summary`
    if (val) {
      localStorage.setItem(path, JSON.stringify(val))
      return res()
    }
    const d = localStorage.getItem(path)
    res((d && JSON.parse(d)) || {})
  })
}
export default {
  get_database,
  get_database_detail,
  user_database_detail,
  user_database_summary
}
