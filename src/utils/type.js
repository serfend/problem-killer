export const tCheck = t => Object.prototype.toString.call(t)
export const tArray = tCheck([])
export const tStr = tCheck('')
export const tBool = tCheck(true)
export const tNum = tCheck(0)

export default {
  tCheck,
  tArray,
  tStr,
  tBool,
  tNum
}
