import request from '@/utils/request'

/**
 *查询所有状态
 * @returns
 */
export function getAllStatus() {
  return request.get('/apply/allStatus')
}

/**
 * 获取请假类型
 *
 * @export
 * @return {*}
 */
export function getRequestTypes() {
  return request.get('apply/applyRequestTypes')
}
