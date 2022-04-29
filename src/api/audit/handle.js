import request from '@/utils/request'
const api = '/applyAudit'
export function toController(type) {
  return `apply${type}handle`
}
/**
 * 操作申请
 * @param {String} action 操作类型 required
 * @param {String} id 申请的id required
 * @param {String} type 申请类型/App名称
 */
export function doAction(action, id, type) {
  return request.put(`${api}/${toController(type)}/${action}?id=${id}`)
}

/**
 *批量审批
 *
 * @export
 * @param {Arr[json]} data
 *      data:{
 *        List:{
 *          id:
 *          action:
 *          remark:
 *        },
 *        ...
 *      }
 * @param {Auth} Auth
 * @param {String} type 申请类型/App名称
 * @returns
 */
export function audit(data, auth, type) {
  return request.post(`${api}/${toController(type)}/audit/`, {
    data,
    auth
  })
}
/**
 * 获取指定用户的审批流
 *
 * @export
 * @param {*} id
 * @param {String} type 申请类型/App名称
 * @returns
 */
export function auditStream(id, type) {
  return request.get(`${api}/auditStream/${type}`, {
    params: {
      id
    }
  })
}
