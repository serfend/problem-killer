import request from '../utils/request'
import {
  parseTime
} from '@/utils'
/**
 * 删除指定单位累积（1月1日以来）的情况
 *
 * @export
 * @param {*} companyCode
 * @param {DateTime} from
 * @param {DateTime} to
 * @returns
 */
export function removeAppliesDailyProcess(companyCode, from, to) {
  return appliesStatistics(companyCode, from, to, 'delete', 'appliesDailyProcessRecord')
}
/**
 * 删除指定单位新增休假的情况
 *
 * @export
 * @param {*} companyCode
 * @param {DateTime} from
 * @param {DateTime} to
 * @returns
 */
export function removeAppliesNew(companyCode, from, to) {
  return appliesStatistics(companyCode, from, to, 'delete', 'appliesTargetNew')
}

/**
 * 删除指定单位完成休假的情况
 *
 * @export
 * @param {*} companyCode
 * @param {DateTime} from
 * @param {DateTime} to
 * @returns
 */
export function removeAppliesComplete(companyCode, from, to) {
  return appliesStatistics(companyCode, from, to, 'delete', 'appliesTargetComplete')
}

/**
 * 删除指定单位休假情况
 *
 * @export
 * @param {*} companyCode
 * @param {*} from
 * @param {*} to
 * @returns
 */
export function removeAppliesProcess(companyCode, from, to) {
  return appliesStatistics(companyCode, from, to, 'delete', 'appliesProcessRecord')
}

/**
 * 获取指定单位新增休假的情况
 *
 * @export
 * @param {Array:String} companies
 * @param {DateTime} from
 * @param {DateTime} to
 * @returns
 */
export function getAppliesNew(companies, from, to) {
  return appliesStatistics(companies, from, to, 'get', 'appliesTargetNew')
}

/**
 * 获取指定单位完成休假的情况
 *
 * @export
 * @param {Array:String} companies
 * @param {DateTime} from
 * @param {DateTime} to
 * @returns
 */
export function getAppliesComplete(companies, from, to) {
  return appliesStatistics(companies, from, to, 'get', 'appliesTargetComplete')
}

/**
 * 获取指定单位休假情况
 *
 * @export
 * @param {Array:String} companies
 * @param {*} from
 * @param {*} to
 * @returns
 */
export function getAppliesProcess(companies, from, to) {
  return appliesStatistics(companies, from, to, 'get', 'appliesProcessRecord')
}

/**
 * 获取指定单位累积（1月1日以来）休假情况
 *
 * @export
 * @param {Array:String} companies
 * @param {*} from
 * @param {*} to
 * @returns
 */
export function getAppliesDailyProcess(companies, from, to) {
  return appliesStatistics(companies, from, to, 'get', 'appliesDailyProcessRecord')
}

/**
 *
 *
 * @export
 * @param {Array:String} companies
 * @param {*} from
 * @param {*} to
 * @param {*} action
 * @param {*} path
 * @returns
 */
export function appliesStatistics(companies, from, to, action, path) {
  const companyCode = Object.prototype.toString.call(companies) === '[object Array]' ? companies.join('##') : companies
  return request[action](`vacationStatistics/${path}`, {
    params: {
      companyCode,
      from: parseTime(from),
      to: parseTime(to)
    }
  })
}
