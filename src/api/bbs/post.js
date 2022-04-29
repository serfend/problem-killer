import request from '@/utils/request'
/**
 * 新增/评论帖子
 *
 * @export
 * @param {*} model 帖子
 * @returns
 */
export function newContent({ title, content, replySubject, replyTo }) {
  return request.post('/post/post', { title, content, replySubject, replyTo })
}
/**
 * 删除帖子
 *
 * @export
 * @param {*} id
 * @returns
 */
export function removeContent(id) {
  return request.delete('/post/post', {
    params: {
      id
    }
  })
}
import form from '@/utils/form'
/**
 * 筛选帖子
 *
 * @export
 * @param {*} model 帖子
 * @returns
 */
export function getContent({ page, create, createBy, replySubject, replyTo }) {
  return request.post('/post/post', {
    page,
    create: form.toQueryStartEnd(create),
    createBy: form.toQueryValue(createBy),
    replyTo: form.toQueryValue(replyTo),
    replySubject: form.toQueryValue(replySubject)
  })
}

/**
 * 点赞
 *
 * @export
 * @param {*} id 帖子id
 * @param {*} like 是否赞
 * @returns
 */
export function likeContent({ id, like }) {
  return request.post('/post/like', { id, like })
}
