import request from '@/utils/request'

/**
 * 获取评论
 *
 * @export
 * @param {String} id 休假申请的id
 * @param {String} order as_date/as_popularity
 * @param {Number} pageIndex
 * @param {Number} pageSize
 * @returns
 */
export function getComments(params) {
  return request({
    url: '/apply/comment',
    method: 'get',
    params
  })
}

/**
 * 获取评论的回复
 *
 * @export
 * @param {*} { id 评论id, pageIndex, pageSize }
 * @return {*}
 */
export function getReplies({ id, pageIndex, pageSize }) {
  return request({
    url: 'apply/replies',
    method: 'get',
    params: { id, pageIndex, pageSize }
  })
}
/**
 * 修改/删除/新建评论
 *
 * @export
 * @param {String} id 评论的id，仅删除和修改时需要
 * @param {String} apply 休假申请的id
 * @param {String} content 评论内容
 * @param {String} reply 回复的对象
 * @param {Boolean} isRemove 是否删除
 * @param {String} content 内容
 * @returns
 */
export function postComments({ id, apply, content, reply, isRemove, anonymousNick, auth }) {
  if (!anonymousNick) anonymousNick = null
  return request({
    url: '/apply/comment',
    method: 'post',
    data: {
      data: {
        id, apply, content, reply, anonymousNick, isRemove
      },
      auth
    }
  })
}

/**
 * 修改/删除/新建评论
 *
 * @export
 * @param {String} id 评论的id
 * @param {Boolean} like 是否赞
 * @returns
 */
export function likeComments(data) {
  return request({
    url: '/apply/commentLike',
    method: 'post',
    data
  })
}
