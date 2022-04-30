export function statistics_problem(val, is_right) {
  if (!val) val = { total: 0, wrong: 0, need_practice: 0, last_wrong: null }
  val.total++
  val.need_practice--
  if (!is_right) {
    val.wrong++
    val.need_practice = 3
    val.last_wrong = new Date()
  }
  return val
}
