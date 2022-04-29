import request from '@/utils/request'
const api = 'zx/gradeManager/'
/**
 * 添加科目
 *
 * @export
 * @param {Subject} model
 * @param {Auth} auth
 */
export function setSubject(model, auth) {
  return request.post(`${api}subject`, {
    subject: model,
    auth
  })
}

/**
 * 获取指定科目
 *
 * @export
 * @param {String} name
 * @returns
 */
export function getSubjectByName(name) {
  return request.get(`${api}subject`, {
    params: {
      name
    }
  })
}

/**
 * 查询符合条件的科目
 *
 * @export
 * @param {String} names 科目名，以|分割
 * @param {String} group 科目分组名称
 * @param {UserBase,String} user 当为String时则会从系统中查询实际用户，否则使用本身{realName,gender,time_birthday}
 * @param {Page} pages
 */
export function getSubjects(names = null, group = null, user, pages) {
  const g = buildGradeSubject(names, null, group)
  const q = buildGradeQuery([g], user, pages)
  return new Promise((res, rej) => {
    request.post(`${api}subjects`, q).then(
      data => {
        res(data.list[0])
      }
    ).catch(e => rej(e))
  })
}

/**
 * 单次查询成绩
 *
 * @export
 * @param {QueryGrade} model
 */
export function getResult(model) {
  return request.post(`${api}singleResult`, model)
}
/**
 * 批量计算成绩
 *
 * @export
 * @param {Array:QueryGrade} list
 */
export function getResults(list) {
  return request.post(`${api}mutilResult`, {
    queries: list
  })
}

/**
 * 构造一个成绩查询<QueryGrade/>
 *
 * @export
 * @param {GradeRaw} grades
 * @param {UserBase,String} user 当为String时则会从系统中查询实际用户，否则使用本身{realName,gender,time_birthday}
 * @param {Boolean} needCaculateGrade 是否需要计算成绩
 * @param {Page} pages 是否需要计算成绩
 * @returns
 */
export function buildGradeQuery(grades, user, needCaculateGrade = false, pages = null) {
  const type = Object.prototype.toString.call(user)
  const item = {}
  if (type === '[object String]') {
    item.username = user
  } else if (!user) {
    item.user = null
  } else item.user = user
  return {
    subjects: grades,
    needCaculateGrade,
    user: item,
    pages
  }
}

/**
 * 构造一个 科目成绩 GradeRaw
 *
 * @export
 * @param {String} subject 科目名
 * @param {String} rawValue 根据ValueFormat进行构造
 * @param {String} group 可选 筛选出指定分组的科目
 * @returns
 */
export function buildGradeSubject(subject, rawValue, group = null) {
  return {
    subject,
    rawValue,
    group
  }
}

/*
enum ValueFormat{
  Default,
  TimeBase,
  SecondBase
}

*/
