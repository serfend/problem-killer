import { datedifference } from '@/utils'
export function get_item_stamp(i, item_time_getter) {
  let result = i.tag && i.tag.stamp
  if (!result) {
    if (!i.tag) i.tag = {}
    i.tag.stamp = item_time_getter(i)
    result = i.tag.stamp
  }
  i.tag.year = i.tag.stamp.getFullYear()
  return result
}
export function check_label(i, prei, item_time_getter) {
  const iStamp = get_item_stamp(i, item_time_getter)
  const pStamp = get_item_stamp(prei, item_time_getter)
  const from_last = datedifference(iStamp, pStamp)
  if (from_last === 0) return
  put_label(i)
}
export function put_label(item, from_now) {
  // item.tag.title = from_now < 0 ? '未来' : from_now === 0 ? '今天' : from_now === 1 ? '昨天' : null
  // if (item.tag.title) return
  const m = item.tag.stamp.getMonth() + 1
  item.tag.title = `${m}月`
  item.tag.desc = item.tag.stamp.getDate()
}

/**
 * 获取一个列表的按日期排序
 * 着重各月份之间的间隔（朋友圈样式）
 * @export
 * @param {*} list 列表
 * @param {*} index 目标项
 * @param {*} item_time_getter 如何获取每项的时间
 */
export function tag_single_item(list, index, item_time_getter) {
  if (!item_time_getter) item_time_getter = i => new Date((i.request && i.request.stampLeave) || i.create)
  const item = list[index]
  if (item.tag && item.tag.labeled) return
  get_item_stamp(item, item_time_getter)
  if (index === 0) put_label(item)
  else check_label(item, list[index - 1], item_time_getter)
  return
}

/**
 * 对一个列表实施按日期排序，见
 * tag_single_item
 *
 * @export
 * @param {*} list
 * @param {*} item_time_getter
 * @return {*}
 */
export function tag_all_item(list, item_time_getter) {
  if (!item_time_getter) item_time_getter = i => new Date((i.request && i.request.stampLeave) || i.create)
  list.forEach((v, i) => tag_single_item(list, i, item_time_getter))
  return list
}
