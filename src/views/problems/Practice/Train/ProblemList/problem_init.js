
import { shuffle } from '@/utils/data-handle'
export function filter_with_record ({ items, predict, reason, filter_record }) {
  const previous_count = items.length
  items = predict(items)
  const current_count = items.length
  const result = previous_count - current_count
  if (result === 0) return items
  filter_record[reason] = result
  return items
}
import store from '@/store'
/**
 * 筛选题目，返回筛选后的题目以及被删的原因
 *
 * @export
 * @param {Array} problems
 * @param {Object} options
 * @return {Object} items,filter_record
 */
export function do_filter_problems (problems, options) {
  let { problem_range_start, problem_range_end, shuffle_problem, shuffle_problem_options, new_problem, combo_problem, problem_max_num } = options
  problem_range_start = problem_range_start || 1
  problem_range_end = problem_range_end || problems.length
  shuffle_problem = shuffle_problem || false
  shuffle_problem_options = shuffle_problem_options || false
  new_problem = new_problem || false
  combo_problem = combo_problem || 0
  problem_max_num = problem_max_num || 0

  const dic = store.state.problems.current_problems
  const filter_record = {}
  let items = problems
  items = filter_with_record({ items, predict: v => v.filter(i => i), reason: '重复的题目', filter_record })
  items = filter_with_record({ items, predict: v => v.slice(problem_range_start - 1, problem_range_end || v.length), reason: '筛选题目范围', filter_record })
  if (shuffle_problem) items = shuffle(items)
  do_shuffle_options(items, shuffle_problem_options)
  do_attach_analysis(items)
  if (combo_problem) items = filter_with_record({ items, predict: v => v.filter(i => ((dic[i.id] && dic[i.id].combo_kill) || 0) < combo_problem), reason: '筛选连对', filter_record })
  if (new_problem) items = filter_with_record({ items, predict: v => v.filter(v.filter(i => !(dic[i.id] && dic[i.id].total))), reason: '筛选新题', filter_record })
  if (problem_max_num > 0) items = filter_with_record({ items, predict: v => v.slice(0, problem_max_num), reason: '筛选最大刷题数', filter_record })
  return { items, filter_record }
}
export function do_attach_analysis (r) {
  r.map(i => {
    if (!i.options) return
    let { analysis } = i
    if (!analysis) {
      i.analysis = '暂无题解'
      return
    }
    if (i.option_map) {
      i.option_map.map((i, index) => {
        analysis = analysis.replace(`{{OPT:${i + 1}}}`, `[${index + 1}]`)
      })
      i.analysis = analysis
    }
  })
}
export function do_shuffle_options (r, is_to_shuffle) {
  const convert = (map_to, options, answers) => {
    const new_options = options.map((i, index) => {
      const new_index = map_to[index]
      return options[new_index]
    })
    const map_to_dict = {}
    map_to.map((i, index) => {
      map_to_dict[i] = index
    })
    const single_map = i => map_to_dict[i - 1] + 1
    const new_answers = answers.length ? answers.map(single_map).sort((a, b) => a - b) : single_map(answers)
    return [new_options, new_answers]
  }
  r.map(i => {
    if (!i.options) return
    const { options } = i
    let { answer, analysis } = i
    const check_answer = a => a && (a > 0 && a <= options.length)
    if (answer && answer.length) {
      // 多选题判断选项合法性
      answer = answer.filter(check_answer)
      if (!answer.length) {
        answer = [1] // 否则设置答案为A
        analysis = `(该题答案存在问题)${analysis}`
      }
    } else if (!check_answer(answer)) {
      // 单选题判断选项合法性
      answer = 1 // 否则将答案设置为A
      analysis = `(该题答案存在问题)${analysis}`
    }
    let option_map = new Array(options.length).fill(0).map((i, index) => index)
    // 如果需要打乱选项
    if (is_to_shuffle) {
      console.log('start shuffle options')
      option_map = shuffle(option_map)
      const r = convert(option_map, options, answer, analysis)
      i.options = r[0]
      i.answer = r[1]
    }
    i.option_map = option_map
  })
}

/**
 * 初始化题目
 *
 * @export
 * @param {*} data 未初始化的题目
 * options:偏好设置选项
 * @return {*} problems:初始化完成的题目
 * duplicated:重复项目
 * total_data_count:被筛选前的总数
 * filter_record:被筛选掉的题目及原因
 */
export function init_problems (data, options = {}) {
  let problems = data
  return new Promise((res, rej) => {
    const id_dict = {}
    problems = problems.map((i) => {
      const r = Object.assign({}, i) // 创建新的题目对象
      // 若题目没有定义id，则通过题目内容创建id
      // TODO 此处应该再按题目内容加入去重筛选
      if (!r.id) r.id = `${i.content}${JSON.stringify(i.answer)}`
      if (id_dict[r.id]) {
        id_dict[r.id]++
        return null // 如果id重复，则标记题目为待删除
      }
      id_dict[r.id] = 1 // 将题目加入重复判断字典中
      r.completed = null
      return r
    })
    const { items, filter_record } = do_filter_problems(problems, options)
    problems = items.map((i, page_index) => Object.assign({ page_index }, i)) // 初始化题目的页面位置
    const total_count = problems.length
    return res({ problems, duplicated: id_dict, total_count, filter_record })
  })
}
