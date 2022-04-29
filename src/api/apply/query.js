import request from '@/utils/request'
import form from '@/utils/form'
import { cached_data } from '@/utils/cache'
const apiRank = 'statisticsVacRank'
/**
 * 获取申请的排行榜
 *
 * @export
 * @param {*} { user, page, entityType, rankType, date, company }
 * @return {*}
 */
export function getRank(g) {
  return getRankFunc(`${apiRank}/list`, g)
}
export function getRankWithSelf(g) {
  if (!(g && g.rankType)) return
  return getRankFunc(`${apiRank}/listWithSelf`, g)
}
const getRankFunc = (api, g) => {
  const { user, pages, entityType, rankType, date, company } = g
  return request.post(api, {
    user: form.toQueryValue(user),
    entityType: form.toQueryValue(entityType),
    rankType: form.toQueryStartEndByArray([rankType, 0]),
    date: date && form.toQueryStartEndByArray([date, new Date()]),
    company: form.toQueryValue(company),
    page: pages
  })
}
/**
 * 获取排序类型
 *
 * @export
 * @return {*}
 */
export function getRankType() {
  const url = `${apiRank}/rankTypes`
  return cached_data(url, (e) => request.get(url), null)
}

/**
 *导出excel接口
 *
 * @export
 * @param {*} params
 *        string params.Templete 使用的模板名称
 *        json params.Model 数据模型
 *            string Model.user 用户id
 *            string Model.company 单位代码
 *            string Model.apply 申请的id
 * @returns
 */
export function excelReport(params) {
  return request({
    url: '/static/xlsExport',
    method: 'get',
    params: params
  })
}

/**
 *按筛选查询申请列表
 *
 * @export
 * @param {QueryApplyModel} data
 * @param {Boolean} ignoreErr
 * @returns
 */
export function queryList(data, ignoreErr) {
  return request.post(`/apply/list/${data.entityType}`, data, {
    ignoreError: ignoreErr
  })
}
/**
 *按筛选查询申请列表的id
 *
 * @export
 * @param {*} data
 * @param {*} ignoreErr
 */
export function queryListId(data, ignoreErr) {
  return request.post(`/apply/listShadow/${data.entityType}`, data, {
    ignoreError: ignoreErr
  })
}
/**
 * 构造一个查询模型
 *
 * @export
 * @param {ApplyModel} model
    createTime: Array:Date*2,
    stampLeaveTime: Array:Date*2,
    stampReturnTime: Array:Date*2,
    status: [], // 状态
    executeStatus: null // 执行状态
    actionStatus: 'Received', // 我的状态
    auditBy: String,
    nowAuditBy: String,
    createFor: String,
    isMarried: bool, // 已婚
    isApart: bool, // 分居
    createCompany: Array:Company, // 申请单位
    isRemote: bool, // 偏远单位
    dutiesType: Array:String,
    companyType: Array:String
 * @param {Pages} pages
 */
export function createQueryApplyModel({ data, pages, entityType }) {
  const f = {
    pages: Object.assign({}, pages),
    entityType
  }
  const userStatus =
    (data.isMarried ? 1 : 0) |
    (data.isApart ? 2 : 0)
  if (userStatus) f.userStatus = form.toQueryArrays([userStatus])
  const companyStatus =
    (data.isRemote ? 1 : 0)
  if (companyStatus) f.companyStatus = form.toQueryArrays([companyStatus])
  f.create = form.toQueryStartEndByArray(data.createTime)
  f.stampLeave = form.toQueryStartEndByArray(data.stampLeaveTime)
  f.stampReturn = form.toQueryStartEndByArray(data.stampReturnTime)
  f.status = form.toQueryArrays(data.status)
  f.mainStatus = (undefined === data.mainStatus || data.mainStatus < 0) ? null : { start: data.mainStatus }
  f.executeStatus = form.toQueryValue(data.executeStatus)
  f.auditBy = form.toQueryValue(data.auditBy)
  f.nowAuditBy = form.toQueryValue(data.nowAuditBy)
  f.createCompany = form.toQueryArrays(data.createCompany)
  f.dutiesType = form.toQueryValue(data.dutiesType)
  f.companyType = form.toQueryValue(data.companyType)
  f.createFor = form.toQueryValue(data.createFor)
  f.vacationAdminDivision = form.toQueryStartEndByArray([data.vacationAdminDivision && data.vacationAdminDivision.code, 0])
  f.requestCounts = form.toQueryStartEndByArray(data.requestCounts)
  f.auth = data.auth
  return f
}

/**
 * 查询需本人审批的申请
 *
 * @export
 * @param {Object} pages 分页
 * @param {Array} status 状态
 * @param {String} actionStatus 我的状态：accept,deny,unreceive,received,null
 * @param {int} executeStatus 落实状态
 */
export function queryMyAudit({ pages, status, actionStatus, executeStatus, entityType }) {
  pages = pages || {
    pageIndex: 0,
    pageSize: 20
  }

  return request.get(`/apply/listOfMyAudit/${entityType}`, {
    params: {
      pageIndex: pages.pageIndex,
      pageSize: pages.pageSize,
      status: status.join('##'),
      actionStatus,
      executeStatus
    }
  })
}

/**
 * 查询本人申请
 *
 * @export
 * @param {*} pages 分页
 * @param {String} id 查询用户的id，默认为当前登录用户
 * @param {String} start 起始日期，默认为今年1月1日
 * @param {String} end 终止日期，默认为今天
 * @param {String} entityType 申请类型/应用名称
 */
export function querySelf({ pages, id, start, end, entityType }) {
  pages = (!pages) ? {
    pageIndex: 0,
    pageSize: 20
  } : pages
  return request.get(`/apply/listOfSelf/${entityType}`, {
    params: {
      id,
      pageIndex: pages.pageIndex,
      pageSize: pages.pageSize,
      start,
      end
    }
  })
}

/**
 *查询申请详情
 *
 * @export
 * @param {*} id
 * @returns
 */
export function detail({ id, ignoreError, entityType }) {
  return request(`/apply/detail/${entityType}`, {
    params: {
      id
    },
    ignoreError
  })
}
