import request from '@/utils/request'
const api = '/data/problems/'
export function get_database () {
  return request.get(`${api}index.json`, {})
}
const r = {
  get_database,
  get_database_detail,
  user_database_detail,
  user_database_summary,
  user_problem_result
}
export const ProblemTypeDict = {
  0: ['unknown', '未知'],
  1: ['blanking', '填空题'],
  2: ['single_select', '单项选择题'],
  3: ['multi_select', '多项选择题'],
  4: ['judging', '判断题'],
  5: ['long_answer', '简答题'],
}
const Problem = {
  'Type': 0,
  'Alias': 1
}
const initProblem = () => {
  Object.keys(Problem).map(name => {
    const index = Problem[name]
    Problem[name] = {}
    const i = Problem[name]
    Object.keys(ProblemTypeDict).map(k => {
      const key = ProblemTypeDict[k][index]
      i[key] = Number(k)
    })
    const field = `Problem${name}`
    r[field] = i
    const reverse = {}
    Object.keys(i).map(k => {
      reverse[i[k]] = k
    })
    r[`${field}Reverse`] = reverse
  })
}
initProblem()
const tCheck = t => Object.prototype.toString.call(t)
const GetProblemType = (() => {
  const tArray = tCheck([])
  const tStr = tCheck('')
  const tBool = tCheck(true)
  const tNum = tCheck(0)
  const dict = {}
  dict[tArray] = (a) => {
    const first = a[0]
    if (!first) return r.ProblemType.unknown
    if (tCheck(first) === tStr) return r.ProblemType.blanking
    return r.ProblemType.multi_select
  }
  dict[tStr] = () => r.ProblemType.long_answer
  dict[tBool] = () => r.ProblemType.judging
  dict[tNum] = () => r.ProblemType.single_select
  return answer => {
    const t = tCheck(answer)
    const f = dict[t]
    if (!f) return r.ProblemType.unknown
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
export function user_database_detail ({ name, key, val }) {
  const path = `${api_user}db/${name}`
  return common_data({ path, key, val })
}

/**
 * 获取做题统计
 *
 * @export
 * @param {*} { database, problem_id, val }
 */
export function user_problem_result({ database, problem_id, val }) {
  return new Promise((res, rej) => {
    user_database_detail({ name: database }).then(data => {
      const problems = data.problems || {}
      res(problems)
      if (problem_id === undefined) return
      problems[problem_id] = val
      user_database_detail({ name: database, key: 'problems', val: problems })
    })
  })
}
export function common_data({ path, key, val }) {
  return new Promise((res, rej) => {
    const d = localStorage.getItem(path)
    const data = (d && JSON.parse(d)) || {}
    if (key) {
      data[key] = val
      localStorage.setItem(path, JSON.stringify(data))
    }
    res(data)
  })
}
/**
 * 用户统计信息
 *
 * @export
 * @return {*}
 */
export function user_database_summary ({ key, val }) {
  const path = `${api_user}/summary`
  return common_data({ path, key, val })
}
export default r
