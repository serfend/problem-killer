import request from '@/utils/request'
import { cached_data } from '@/utils/cache'

const api = 'partyGroup/'
const urlGetGroup = `${api}/companyGroup`
export function getList({ company }) {
  return new Promise((res, rej) => {
    cached_data(`${urlGetGroup}/${company}`, () =>
      request.get(urlGetGroup, {
        params: {
          code: company
        }
      })
    ).then(data => {
      data.list.map(i => {
        i.name = i.alias
      })
      res(data)
    }).catch(e => rej(e))
  })
}
const urlGetGroupDetail = `${api}/groupDetail`
/**
 * 获取党团组织详情
 *
 * @export
 * @param {*} { group }
 * @return {*}
 */
export function groupDetail({ group }) {
  return cached_data(`${urlGetGroupDetail}/${group}`, () => request.get(urlGetGroupDetail, {
    params: {
      group
    }
  }))
}

/**
 * 党组织成员
 *
 * @export
 * @param {*} { company, groupid, page }
 * @return {*}
 */
export function members({ company, groupid, page }) {
  return request.get(`${api}/members`,
    {
      params: Object.assign({ company, groupid }, page)
    })
}

/**
 * 创建党组织
 *
 * @export
 * @param {*} { alias,company,groupType,level }
 * @return {*}
 */
export function postCompanyGroup({ id, alias, company, groupType, level, isRemoved }) {
  return request.post(`${api}/Info`,
    {
      data: { id, alias, company, groupType, level, isRemoved }
    })
}
/**
 * 单位党组织
 *
 * @export
 * @param {*} { companyCode }
 * @return {*}
 */
export function CompanyGroup({ level, companyCode }) {
  return request.get(`${api}/CompanyGroup`,
    {
      params: {
        level,
        company: companyCode
      }
    })
}

/**
 * 获取成员类别统计
 *
 * @export
 * @param {*} { company, groupid }
 * @return {*}
 */
export function memberStatistics({ company, groupid }) {
  return request.get(`${api}/memberStatistics`, {
    params: { company, groupid }
  })
}
export default {
  getList,
  members,
  CompanyGroup,
  memberStatistics,
  postCompanyGroup
}
