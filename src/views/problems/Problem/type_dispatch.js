import { ProblemType } from '@/api/problems'
const ProblemTypeValue2Key = (() => {
  const r = {}
  Object.keys(ProblemType).map(i => {
    r[ProblemType[i]] = i
  })
  return r
})()

export function getTypeName (type) {
  if (!type) return null
  const t = ProblemTypeValue2Key[type]
  if (!t) return null
  const handle_single = t => {
    const suffix = t.substring(1)
    const prefix = t[0].toUpperCase()
    return `${prefix}${suffix}`
  }
  const r = t.split('_').map(i => handle_single(i))
  return `Problem${r.join('')}`
}
