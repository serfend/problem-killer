import { getMembers } from '@/api/company'
import { templateToStandard } from '../TemplateBuilder/standard'
export function load_template({ code, ratingCycleCount, ratingType, ratingTypeItem, ratingTypeDesc, asManage }) {
  return new Promise((res, rej) => {
    getMembers({ code, page: 0, pageSize: 1e3, asManage }).then(data => {
      data.list = userSummaryToStandard({ list: data.list, code, ratingCycleCount, ratingType })
      res(templateToStandard(data, ratingTypeDesc, ratingTypeItem))
    }).catch(e => {
      rej(e)
    })
  })
}
export function userSummaryToStandard({ list, code, ratingCycleCount, ratingType }) {
  let index = 1
  return list.map(i => ({
    user: i,
    cid: i.cid,
    level: 1e3,
    levelName: '优秀',
    rank: index++,
    remark: '在XXX工作突出',
    companyCode: code,
    companyName: '',
    ratingCycleCount,
    ratingType
  }))
}
