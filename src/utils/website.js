
/**
 * 获取全局webapi地址
 *
 * @export
 * @return {*}
 */
export function getWebLocation() {
  const url = process.env.VUE_APP_BASE_API
  // const c = location.origin
  return url
  // console.log('raw url', url)
  // // 当当前url包含http表示为完整路径，可直接引用，否则为相对路径
  // if (['file'].find(i => c.startsWith(i))) return `${url}`
  // if (!url) return
  //  return url
  // return location.origin
}

/**
 * 获取全局webapi下的完整地址
 *
 * @export
 * @param {*} path 路径
 */
export function getWebUrlPath(path) {
  return `${getWebLocation()}/${path}`
}
