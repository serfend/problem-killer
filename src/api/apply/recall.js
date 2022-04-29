import request from '@/utils/request'

/**
 *
 *
 * @export
 * @param {*} data
 * @returns
 */
export function postRecallOrder({ entityType, data, auth }) {
  return request.post('/apply/recallorder', { entityType, data, auth })
}
/**
 * 获取召回信息
 *
 * @export
 * @param {*} id
 * @returns
 */
export function getRecallOrder({ id, entityType, ignoreError }) {
  return request.get('/apply/recallorder', {
    params: {
      id
    },
    ignoreError
  })
}

/**
 *
 *
 * @export
 * @param {*} data
 * @returns
 */
export function postExecuteStatus({ entityType, data, auth }) {
  return request.post(`/apply/executeStatus/${entityType}`, { entityType, data, auth })
}
/**
 * 获取确认休假信息
 *
 * @export
 * @param {*} id
 * @returns
 */
export function getExecuteStatus({ id, entityType }) {
  return request.get(`/apply/executeStatus/${entityType}`, {
    params: {
      id
    }
  })
}
