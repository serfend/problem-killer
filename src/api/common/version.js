import request from '@/utils/request'

/**
 * 获取更新记录
 *
 * @export
 * @param {*} pageIndex
 * @param {*} pageSize
 * @returns
 */
export function getUpdateRecord({ pageIndex, pageSize, appName }) {
  return request.get('common/updateVersion', {
    params: {
      pageIndex,
      pageSize,
      appName
    }
  })
}

/**
 * 创建编辑删除
 *
 * @export
 * @param {*} model 当IsRemove=true表示删除，以Version为主键，可以为Object也可以为Array
 * @returns
 */
export function modifyUpdateRecord(model, auth) {
  var list = []
  if (model.length) {
    list = model
  } else {
    list = [model]
  }
  return request.post('common/updateVersion', {
    data: {
      list
    },
    auth
  })
}
