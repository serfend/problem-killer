import request from '@/utils/request'
const api = 'partyConference/'
const TagApi = 'ClientTag/'
/**
 * 获取会议的AppName下的子标签
 *
 * @export
 * @param {*} { id, appName }
 */
export function getChildrenTags({ id, appName }) {
  return request.get(`${TagApi}Children`, {
    params: {
      id, appName
    }
  })
}

/**
 * 更新标签内容(post/update/delete)
 *
 * @export
 * @param {*} { isRemoved, id, name, color, appName, description, createCompany, parentId }
 */
export function postTags({ isRemoved, id, name, color, appName, description, createCompany, parentId }) {
  return request.post(`${TagApi}Info`, {
    data: { isRemoved, id, name, color, appName, description, createCompany, parentId }
  })
}

/**
 * 获取标签内容(get)
 *
 * @export
 * @param {*} { name }
 */
export function getTagDetails({ name }) {
  return request.get(`${TagApi}Info`, {
    data: { name }
  })
}

/**
 * 更新会议的Tags
 *
 * @export
 * @param {*} { id, tags }
 */
export function postConferTags({ id, tags }) {
  return request.post(`${api}Tags`, {
    data: {
      id, tags
    }
  })
}

/**
 * 获取会议Tags
 *
 * @export
 * @param {*} { conferenceId }
 * @return {*}
 */
export function getConferTags({ conferenceId }) {
  return request.get(`${api}Tags`, {
    params: Object.assign({
      conferenceId
    })
  })
}

export default {
  postConferTags,
  getConferTags,
  getChildrenTags,
  postTags,
  getTagDetails
}
