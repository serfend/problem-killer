export function statistics_problem (val, is_right, time_spend) {
  const tmp = {
    total: 0, // 总做题数
    wrong: 0, // 总错误数
    combo_kill: 0, // 连对次数
    last_wrong: null, // 上次错误
    total_time: 0, // 总耗时
    first_view: null // 首次见到此题
  }
  Object.keys(tmp).map(i => {
    if (!val[i])val[i] = tmp[i]
  })
  val.total++
  const n = new Date()
  if (!val.first_view)val.first_view = n
  val.total_time += time_spend
  val.combo_kill++
  if (!is_right) {
    val.wrong++
    val.combo_kill = 0
    val.last_wrong = n
  }
  return val
}
