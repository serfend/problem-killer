import request from '@/utils/request'

/**
 *  删除申请
 * @param {json} params
 *      {string} params.id
 *      {Auth}   params.Auth
 * @param {String} type 申请类型/App名称
 */
export function deleteApply(params, type) {
  return request({
    url: `/apply/submit/${type}`,
    method: 'delete',
    data: params
  })
}
