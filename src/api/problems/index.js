import request from '@/utils/request'
import { common_data } from '@/api/common'
import { tNum, tBool, tStr, tArray, tCheck } from '@/utils/type'
const api = 'data/problems/'
export function get_database ({ data, pageIndex, pageSize }) {
  const db_name = data && data.name
  return new Promise((res, rej) => {
    request.get(`${api}index.json`, {}).then(data => {
      let databases = data.database
      if (db_name) databases = databases.filter(i => i.name.indexOf(db_name) > -1)
      const total = databases && databases.length
      return res({
        databases: (databases && databases.splice(pageIndex * pageSize, pageSize)) || [],
        total
      })
    }).catch(e => rej(e))
  })
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

const GetProblemType = (() => {
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
  return problems.filter(i => i).map((i, index) => {
    const { answer } = i
    i.type = GetProblemType(answer)
    i.index = index
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
export function user_problem_result ({ database, problem_id, val }) {
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
