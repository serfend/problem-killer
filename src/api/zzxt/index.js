import request from '@/utils/request'
const api = 'zzxt/api'

// 党团用户信息
import userinfo from './party-userinfo'
export const getUsersInfo = (item) => userinfo.getList(item)
export const postUsersInfo = (item) => userinfo.putItem(item)
export const updateUsersInfo = (item) => userinfo.patchItem(item)
export const deleteUsersInfo = (userName) => userinfo.removeInfo({ userName })
export const SelectZzmm = (id) => userinfo.typeInParty({ id })
export const getLaborArray = () => userinfo.partyDuties()

// 党团组织信息
import groupinfo from './party-group'
export const getCompanyGroup = ({ companyCode, level }) => groupinfo.CompanyGroup({ companyCode, level })
export const getGroupNum = (number) => groupinfo.getList({ company: number })
export const getUsersList = ({ company, groupid, page }) => groupinfo.members({
  company, page, groupid
})
export const getMemberStatistics = ({ company, groupid }) => groupinfo.memberStatistics({ company, groupid })
export const postCompanyGroup = (queryObject) => groupinfo.postCompanyGroup(queryObject)
// 会议相关接口
import conferinfo from './party-conference/confer'
export const getConferInfo = ({ company, partyGroup, conferType, page }) => conferinfo.companyConferList({ company, partyGroup, conferType, page })
// 实现各类型会议接口
export function confer_api(type) {
  const conferType = type
  return {
    get: (queryObject) => getConferInfo(Object.assign({ conferType }, queryObject)),
    post: (FormData) => conferinfo.patchConference(Object.assign({ type }, FormData)),
    update: (FormData) => conferinfo.patchConference(Object.assign({ allowOverWrite: true }, FormData)),
    delete: (id) => conferinfo.patchConference({ id, isRemoved: true })
  }
}
export function getConferDetail({ id }) {
  return conferinfo.getConferDetail({ id })
}

// 提交和获取参会记录
import conferRecord from './party-conference/record'
export const getConferRecord = ({ id, page }) => conferRecord.getConferRecord({ id, page })
export function conferRecord_api(conferType) {
  const type = conferType
  return {
    get: (queryObject) => getConferRecord(queryObject),
    post: (FormData) => conferRecord.postConferRecord(Object.assign({ type }, FormData)),
    update: (FormData) => conferRecord.postConferRecord(Object.assign({ allowOverWrite: true }, FormData)),
    delete: (id) => conferRecord.postConferRecord({ id, isRemoved: true })
  }
}
// 补充提交会议会议内容
export const getConferRecordContent = ({ recordid, conferid, page }) => conferRecord.getConferRecordContent({ recordid, conferid, page })
export function conferRecordContent_api(conferType) {
  return {
    get: (queryObject) => getConferRecord(queryObject),
    post: (FormData) => conferRecord.postConferRecordContent(Object.assign({ conferType }, FormData)),
    update: (FormData) => conferRecord.postConferRecordContent(Object.assign({ allowOverWrite: true }, FormData)),
    delete: (id) => conferRecord.postConferRecordContent({ id, isRemoved: true })
  }
}

// 生成和编辑Tags
import conferTags from './party-conference/confer-tags'
export function tagsOptionApi() {
  return {
    get: (queryObject) => conferTags.getTagDetails(queryObject),
    post: (FormData) => conferTags.postTags(FormData),
    update: (FormData) => conferTags.postTags(Object.assign({ allowOverWrite: true }, FormData)),
    delete: (id) => conferTags.postTags({ id, isRemoved: true })
  }
}

// 查询和提交会议的标签
export const getConferTags = ({ conferenceId }) => conferTags.postConferTags({ conferenceId })
export function conferTags_api() {
  return {
    get: (queryObject) => getConferTags(queryObject),
    post: (FormData) => conferTags.postConferTags(FormData),
    update: (FormData) => conferTags.postConferTags(FormData),
    delete: (FormData) => conferTags.postConferTags(FormData)
  }
}
// 获取单位思想政治教育情况和个人情况
export function getPerEducationSitu(queryObject) {
  return request.post(`${api}/getPerEducationSitu`, {
    params: { queryObject }
  })
}

export function getPerEductionCount(queryObject) {
  return request.post(`${api}/getPerEductionCount`, {
    params: { queryObject }
  })
}

export function getCompanyEductionCount(queryObject) {
  return request.post(`${api}/getCompanyEductionCount`, {
    params: { queryObject }
  })
}

export function getDyfzMembers(queryObject) {
  return request.post(`${api}/getDyfzMembers`, {
    params: { queryObject }
  })
}
