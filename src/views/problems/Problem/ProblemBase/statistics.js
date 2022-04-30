export function statistics_problem(val, is_right, time_spend) {
  if (!val) val = { total: 0, wrong: 0, need_practice: 0, last_wrong: null, total_time: 0 }
  val.total++
  console.log('time_spend', time_spend)
  val.total_time += time_spend
  val.need_practice--
  if (!is_right) {
    val.wrong++
    val.need_practice = 3
    val.last_wrong = new Date()
  }
  return val
}
