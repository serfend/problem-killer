import request from '@/utils/request'
const api = 'partyConference/'

/**
 * 获取指定
 *
 * @export
 * @param {*} { id, page }
 * @return {*}
 */
export function getConferRecord({ id, page }) {
  return request.get(`${api}conferRecord`, {
    params: Object.assign({
      id
    }, page)
  })
}

/**
 * 更新
 *
 * @export
 * @param {*} {
 * data:{
 *    int:type,
 *    string:userId,
 *    guid:conferenceId,
 *    datetime:create
 * }
 * , allowOverWrite, auth }
 * @return {*}
 */
export function postConferRecord({ allowOverWrite, isRemoved, id, type, userId, conferenceId }) {
  return request.post(`${api}conferRecord`, {
    data: {
      id, isRemoved, type, userId, conferenceId
    },
    allowOverWrite
  })
}

/**
 * 获取会议内容
 *
 * @export
 * @param {*} { recordid, conferid, page }
 * @return {*}
 */
export function getConferRecordContent({ recordid, conferid, page }) {
  return request.get(`${api}conferRecordContent`, {
    params: Object.assign({ recordid, conferid }, page)
  })
}

/**
 * 更新会议内容
 *
 * @export
 * @param {*} {
 * data:{
 *    boolen:isRemoved,
 *    int:contentType,
 *    string:content,
 *    datetime:create,
 *    guid:id,
 *    guid:recordId
 * }
 * , allowOverWrite, auth }
 * @return {*}
 */
export function postConferRecordContent({ id, isRemoved, recordid, conferenceId, contentType, content }) {
  const allowOverWrite = true
  return request.post(`${api}conferRecordContent`, {
    data: {
      id, isRemoved, recordid, conferenceId, contentType, content
    },
    allowOverWrite
  })
}

export default {
  postConferRecord,
  postConferRecordContent,
  getConferRecord,
  getConferRecordContent
}
