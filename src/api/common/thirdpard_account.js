
import request from '@/utils/request'

/**
 * 发送第三方账号认证
 *
 * @export
 * @param {Object} params
 *  id string 用户三方id
 *  name string 三方平台名称
 */
export function sendThirdpardVerify(params) {
  return request({
    url: '/account/thirdpardRequire',
    method: 'post',
    params
  })
}
/**
 * 发送第三方账号认证确认
 *
 * @export
 * @param {Object} params
 *  id string 用户三方id
 *  name string 三方平台名称
 */
export function confirmThirdpardVerify(params) {
  return request({
    url: '/account/thirdpardConfirm',
    method: 'post',
    params
  })
}
