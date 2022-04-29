import request from '@/utils/request'
import { parseTime } from '@/utils'
/**
 * 创建短网址
 *
 * @export
 * @param {*} target 目标网址
 * @param {*} key 短网址，可不传
 * @param {int} expire 过期时间，默认为7天
 * @returns
 */
export function createDwz(target, key, expire) {
  if (!key || key === '') key = null
  var validLength = 1
  if (!expire || expire === '') expire = parseTime(new Date((+new Date() + validLength * 24 * 3600 * 1000)))

  return request.post('/static/shorturl/create', {
    target, expire, key
  })
}

/**
 * 查询短网址详情
 *
 * @export
 * @param {*} key
 * @param {*} target
 * @param {*} createBy
 * @param {*} ip
 * @param {*} device
 * @param {*} pages
 * @returns
 */
export function loadDwz({ key, target, createBy, ip, device, pages }) {
  var pl = {}
  if (key) pl.key = { value: key }
  if (target) pl.target = { value: target }
  if (createBy) pl.createBy = { value: createBy }
  if (ip) pl.ip = { value: ip }
  if (device) pl.device = { value: device }
  if (pages) pl.pages = pages
  return request.post('/static/shorturl/query', pl)
}

/**
 * 删除短链，需要权限
 *
 * @export
 * @param {*} key
 * @returns
 */
export function remove(key) {
  return request.delete(`/s/${key}`)
}

/**
 * 查询统计
 *
 * @export
 * @param {*} { key, create, viewBy, ip, device, pages }
 * @returns
 */
export function statistics(key, create, viewBy, ip, device, pages) {
  var pl = {}
  if (create) pl.create = create
  if (viewBy) pl.viewBy = { value: viewBy }
  if (ip) pl.ip = { value: ip }
  if (device) pl.device = { value: device }
  if (pages) pl.pages = pages
  return request.post(`/s/${key}/statistics`, pl)
}
