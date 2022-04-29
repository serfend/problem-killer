import request from '@/utils/request'
const api = 'partyConference/'
/**
 * 更新会议
 *
 * @export
 * @param {*} { title, content, CreateByCode, allowOverWrite, type, isRemoved }
 */
export function patchConference({ id, title, content, createByCode, createByGroup, place, allowOverWrite, type, isRemoved, create, startTime, length }) {
  return request.post(`${api}confer`, {
    data: {
      id, title, content, type, createByCode, createByGroup, place, isRemoved, create, length, startTime
    },
    allowOverWrite
  })
}

/**
 * 单位会议列表
 *
 * @export
 * @param {*} { company, page }
 * @return {*}
 */
export function companyConferList({ company, partyGroup, conferType, page }) {
  return request.get(`${api}companyConferList`, {
    params: Object.assign({
      company, partyGroup, conferType
    }, page)
  })
}

/**
 * 根据id获取会议详情
 *
 * @export
 * @param {*} { id }
 * @return {*}
 */
export function getConferDetail({ id }) {
  return request.get(`${api}ConferDetail`, {
    params: { id }
  })
}

export default {
  patchConference,
  companyConferList,
  getConferDetail
}
