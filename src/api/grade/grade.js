import request from '@/utils/request'
const api = 'zx/gradeManager/grade'
import {
  toQueryValue,
  toQueryStartEndByArray
} from '@/utils/form'

/**
 * 获取考核记录
 *
 * @export
 * @param {*} name
 * @param {*} holdBy
 * @param {*} createBy
 * @param {*} handleBy
 * @param {*} executeTime
 * @param {*} create
 * @param {Page} pages
 * @returns
 */
export function getExam({
  name,
  holdBy,
  createBy,
  handleBy,
  executeTime,
  create,
  pages
}) {
  return request.post(`${api}/exams`, {
    name: toQueryValue(name),
    holdBy: toQueryValue(holdBy),
    createBy: toQueryValue(createBy),
    handleBy: toQueryValue(handleBy),
    create: toQueryStartEndByArray(create),
    executeTime: toQueryStartEndByArray(executeTime),
    pages
  })
}

/**
 * 编辑考核记录 通过`name`匹配
 *
 * @export
 * @param {Exam} model 调用`createNewExam`初始化
 * @param {Auth} auth
 */
export function postExam(model, auth) {
  return request.post(`${api}/exam`, {
    ...model,
    auth
  })
}

/**
 * 初始化一个考核Model
 *
 * @export
 */
export function createNewExam() {
  return {
    name: null,
    description: null,
    holdBy: null,
    createBy: null,
    handleBy: null,
    executeTime: null,
    create: null,
    isRemoved: false
  }
}

/**
 * 获取成绩记录
 *
 * @export
 * @param {Array:Date*2} create 创建时间 required
 * @param {String} createBy 创建人
 * @param {String} createFor 作用人
 * @param {Pages} pages 分页
 * @returns
 */
export function getRecord(create, createBy, createFor, pages) {
  return request.post(`${api}/records`, {
    create: toQueryStartEndByArray(create),
    createBy: toQueryValue(createBy),
    createFor: toQueryValue(createFor),
    pages
  })
}

/**
 * 编辑一个成绩 通过 id 匹配
 *
 * @export
 * @param {Record} model 调用`createRecord`初始化
 * @param {Auth} auth
 */
export function postRecord(model, auth) {
  return request.post(`${api}/record`, {
    data: model,
    auth
  })
}

/**
 * 初始化一个成绩model
 *
 * @export
 * @returns
 */
export function createRecord() {
  return {
    id: 0,
    isRemoved: false,
    user: null,
    createBy: null,
    create: null,
    subject: null,
    exam: null,
    score: 0,
    rawValue: null,
    remark: null
  }
}
