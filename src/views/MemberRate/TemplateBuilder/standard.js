import { formatTime } from '@/utils'
export function templateToStandard(data, ratingTypeCycleDesc, ratingTypeItem) {
  const m = new Date().getMonth() + 1
  data.createDate = `${m}月`
  data.exportDate = `${m}月${new Date().getDate()}日`
  let index = 0
  data.list = data.list.map(i => {
    index++
    i.index = index
    const u = i.user
    if (u) {
      const f = formatTime(u.userTitleDate, '{y}.{m}')
      u.titleAndDate = `${u.userTitle}\n${f}`
      u.companyAndDuty = `${u.companyName}${u.dutiesName}`
    }
    return i
  })
  const ratingType = ratingTypeItem[0]
  const valid = ratingTypeCycleDesc && ratingType
  const prefix = valid
    ? `${ratingTypeCycleDesc}${ratingType} - `
    : '常规 - '
  return { prefix, data }
}
