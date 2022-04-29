import request from '@/utils/request'

/**
 * 获取用户的家庭情况变化记录
 *
 * @export
 * @param {*} id
 * @returns
 */
export function getUserSocialRecord(id) {
  return request.get('/users/social/userModifyRecord', {
    params: {
      id
    }
  })
}

/**
 * 获取单条记录
 *
 * @export
 * @param {*} code
 * @returns
 */
export function getSingle(code) {
  return request.get('/users/social/modifyRecord', {
    params: {
      code
    }
  })
}
/**
 * 修改单条记录
 *
 * @export
 * @param {SocialModifyRecord} record
 * @param {GoogleAuth} auth
 * @returns
 */
export function modifySingle(record, auth) {
  return request.post('/users/social/modifyRecord', {
    record,
    auth
  })
}

/**
 * 修改用户家庭情况
 *
 * @export
 * @param {*} id
 * @param {*} settle
 * @param {*} auth
 */
export function modifySettle(id, settle, auth) {
  return request.post('/users/social/settle', {
    auth,
    data: {
      id,
      settle
    }
  })
}
