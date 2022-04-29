import request from '@/utils/request'
import form from '@/utils/form'
import { cached_data } from '@/utils/cache'

const api = 'partyUser/'

/**
 * 获取党团列表
 *
 * @export
 * @param {*} { group, labor, typeInParty, company, page }
 * @return {*}
 */
export function getList({ group, labor, typeInParty, company, page }) {
  return new Promise((res, rej) => {
    request.post(`${api}list`, {
      group: form.toQueryValue(group),
      labor: form.toQueryValue(labor),
      typeInParty: form.toQueryValue(typeInParty),
      company: form.toQueryValue(company),
      page
    }).then(data => {
      if (data && data.list) {
        data.list.map(i => {
          i.typeInParty = typeInPartyDict_reverse[i.typeInParty]
          i.name = i.userName
        })
      }
      res(data)
    }).catch(e => rej(e))
  })
}

/** @type {TypeInPartyEnum} */
const typeInPartyDict = {
  '无': 0,
  '群众': 1,
  '少先队员': 2,
  '团员': 4,
  '入党积极分子': 8,
  '预备党员': 16,
  '正式党员': 32
}
const typeInPartyDict_reverse = (() => {
  const d = typeInPartyDict
  const r = {}
  Object.keys(d).map(i => {
    r[d[i]] = i
  })
  return r
})()

/**
 * 提交党团
 *
 * @export
 * @param {*} { userName, dutyName, dutyStart, companyAndDuty, time_Work, time_Party, typeInParty, partyGroup, create, company
 * }
 * @return {*}
 */
export function putItem({ userName, duty, dutyStart, companyAndDuty, time_Work, time_Party, typeInParty, partyGroup, create, company }) {
  return request.put(`${api}/info`, {
    data: {
      userName,
      duty,
      dutyStart,
      companyAndDuty,
      time_Work,
      time_Party,
      typeInParty: typeInPartyDict[typeInParty] || 0,
      partyGroup,
      create,
      company
    }
  })
}
/**
 * 编辑党团
 *
 * @export
 * @param {*} { id, userName, duty, dutyStart, companyAndDuty, time_Work, time_Party, typeInParty, partyGroup, create, company }
 * @return {*}
 */
export function patchItem({ id, userName, duty, dutyStart, companyAndDuty, time_Work, time_Party, typeInParty, partyGroup, create, company }) {
  return request.patch(`${api}/info`, {
    data: {
      id,
      userName,
      duty,
      dutyStart,
      companyAndDuty,
      time_Work,
      time_Party,
      typeInParty: typeInPartyDict[typeInParty] || 0,
      partyGroup,
      create,
      company
    }
  })
}

/**
 * 移除党团
 *
 * @export
 * @param {*} { userName }
 * @return {*}
 */
export function removeInfo({ userName }) {
  return request.delete(`${api}/info`, {
    params: {
      userid: userName
    }
  })
}

const urlGetTypeInParty = `${api}/typesInParty`
/**
 * 获取政治面貌列表
 *
 * @export
 */
export function typeInParty() {
  return new Promise((res, rej) => {
    cached_data(`${urlGetTypeInParty}`, () =>
      request.get(urlGetTypeInParty)
    ).then(data => {
      data.list.map(i => {
        i.data = i.alias
      })
      res(data.list)
    }).catch(e => rej(e))
  })
}

const urlGetPartyDuties = `${api}/partyDuties`
/**
 * 获取党内职务列表
 *
 * @export
 */
export function partyDuties() {
  return new Promise((res, rej) => {
    cached_data(`${urlGetPartyDuties}`, () =>
      request.get(urlGetPartyDuties)
    ).then(data => {
      data.list.map(i => {
        i.value = i.name
      })
      res(data.list)
    }).catch(e => rej(e))
  })
}
export default {
  getList,
  putItem,
  patchItem,
  removeInfo,
  typeInParty,
  partyDuties
}
