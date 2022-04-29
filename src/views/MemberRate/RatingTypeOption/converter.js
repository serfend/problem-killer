import { ratingTypeDict } from '../setting'
export const descList = {
  'season': [
    { l: '一季度', v: '{y}-1-1' },
    { l: '二季度', v: '{y}-4-1' },
    { l: '三季度', v: '{y}-8-1' },
    { l: '四季度', v: '{y}-12-1' },
  ],
  'half-year': [
    { l: '上半年', v: '{y}-1-1' },
    { l: '下半年', v: '{y}-6-1' },
  ]
}
export function ratingTypeItem(ratingType) {
  return ratingTypeDict[ratingType]
}
export function ratingTypeCycleToString(ratingType, cycleCount) {
  const d = new Date('2000-1-1')
  switch (ratingType) {
    // 日
    case 1: {
      break
    }
    // 周
    case 2: {
      break
    }
    // 月
    case 4: {
      d.setMonth(d.getMonth() + cycleCount)
      return `${d.getFullYear()}年${d.getMonth() + 1}月`
    }
    // 季度
    case 8: {
      cycleCount -= 1
      d.setMonth(cycleCount * 3)
      return `${d.getFullYear()}年${descList['season'][cycleCount % 4].l}`
    }
    // 半年
    case 12: {
      cycleCount -= 1
      d.setMonth(cycleCount * 6)
      return `${d.getFullYear()}年${descList['half-year'][cycleCount % 2].l}`
    }
    // 年
    case 16: {
      d.setFullYear(d.getFullYear() + cycleCount)
      return `${d.getFullYear()}年度`
    }
    default: return null
  }
}
export function dateValueToCycleCount(ratingType, dateValue, descValue) {
  const v = dateValue
  if (!v) return 0
  switch (ratingType) {
    // 日
    case 1: {
      break
    }
    // 周
    case 2: {
      break
    }
    // 月
    case 4: {
      return (v.getFullYear() - 2000) * 12 + v.getMonth()
    }
    // 季度
    case 8: {
      const y = (v.getFullYear() - 2000) * 3
      const s = descList['season'].findIndex(i => i.v === descValue)
      return y + (s === -1 ? 0 : s) + 1
    }
    // 半年
    case 12: {
      const y = (v.getFullYear() - 2000) * 2
      const s = descList['half-year'].findIndex(i => i.v === descValue)
      return y + (s === -1 ? 0 : s) + 1
    }
    // 年
    case 16: {
      return v.getFullYear() - 2000
    }
    // 全部
    case 32: {
      return null
    }
  }
}
export function dateValueToCycleDesc(ratingType, dateValue, descValue) {
  const count = dateValueToCycleCount(ratingType, dateValue, descValue)
  const r = ratingTypeCycleToString(ratingType, count)
  return r
}
