import request from '@/utils/request'
const api = '/data/problems/'
export function get_database () {
  return request.get(`${api}index.json`, {})
}
export const ProblemType = {
  unknown: 0,
  blanking: 1,
  single_select: 2,
  multi_select: 3,
  judging: 4,
  long_answer: 5
}
const tCheck = t => Object.prototype.toString.call(t)
const GetProblemType = (() => {
  const tArray = tCheck([])
  const tStr = tCheck('')
  const tBool = tCheck(true)
  const tNum = tCheck(0)
  const dict = {}
  dict[tArray] = (a) => {
    const first = a[0]
    if (!first) return ProblemType.unknown
    if (tCheck(first) === tStr) return ProblemType.blanking
    return ProblemType.multi_select
  }
  dict[tStr] = () => ProblemType.long_answer
  dict[tBool] = () => ProblemType.judging
  dict[tNum] = () => ProblemType.single_select
  return answer => {
    const t = tCheck(answer)
    const f = dict[t]
    if (!f) return ProblemType.unknown
    return f(answer)
  }
})()
function handle_problems (problems) {
  if (!problems) return null
  return problems.filter(i => i).map(i => {
    const { answer } = i
    i.type = GetProblemType(answer)
    return i
  })
}
export function get_database_detail (name) {
  return new Promise((res, rej) => {
    request.get(`${api}database/${name}.json`, {}).then(data => {
      data.problems = handle_problems(data.problems)
      return res(data)
    }).catch(e => rej(e))
  })
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
export function user_database_detail ({ name, val }) {
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
export function user_database_summary ({ val }) {
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
  ProblemType,
  get_database,
  get_database_detail,
  user_database_detail,
  user_database_summary
}
