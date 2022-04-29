import request from '@/utils/request'
/**
 *获取归队时间
 *
 * @export
 * @param {*} params
 *      date  params.start
 *      int  params.length
 *      boolean params.caculateLawVacation
 * @returns
 */
export function getStampReturn({ start, length, benefits, lawVacationSet, caculateLawvacation }) {
  return request({
    url: '/static/vacationDate',
    method: 'post',
    data: { start, length, benefits, lawVacationSet: getLawVacationSetDict(lawVacationSet), caculateLawvacation }
  })
}

/**
 * 提交基本信息
 * @param {*} data 基本信息参数
 */
export function postBaseInfo(data) {
  return request.post('/apply/BaseInfo', data)
}

/**
 * 提交请求信息
 * @param {*} data 请求参数
 * @param {*} entityType 假期实体/应用名称
 */
export function postRequestInfo(data, entityType) {
  let s = Object.assign({}, data)
  s = Object.assign(s, { lawVacationSet: getLawVacationSetDict(data.lawVacationSet) })
  return request.post(`/apply/${entityType}RequestInfo`, s)
}
function getLawVacationSetDict(lawVacationSet) {
  const dict = {}
  lawVacationSet = lawVacationSet || []
  lawVacationSet.forEach(i => {
    dict[i.id] = i.useLength
  })
  return dict
}
/**
 * 提交申请
 * @param {
   {
    "BaseId": String,
    "RequestId": String,
    "Verify":{
      "Code": String
    }
  } data 申请的参数，包含基本信息和请求返回的两个id
 */
export function submitApply(data) {
  return request.post('/apply/Submit', data)
}
