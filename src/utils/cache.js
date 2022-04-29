const cache_dict = {}

export function buildUniqueUrl(url, method, params = {}, data = {}) {
  const paramStr = (obj) => {
    if (toString.call(obj) === '[object Object]') {
      return JSON.stringify(Object.keys(obj).sort().reduce((result, key) => {
        result[key] = obj[key]
        return result
      }, {}))
    } else {
      return JSON.stringify(obj)
    }
  }
  url += `?${paramStr(params)}&${paramStr(data)}&${method}`
  return url
}
/**
 * 使用缓存数据
 *
 * @export
 * @param {*} id 缓存的id，判断是否是同一个请求
 * @param {*} action 请求的Promise
 * @param {number} [timeout=10e3] 请求到数据后，数据的过期时间
 * @param {number} [exception_timeout=5e2] 请求失败后，此失败状态的过期时间
 * @return {*} promise
 */
export function cached_data(id, action, timeout = 10e3, exception_timeout = 5e2) {
  if (cache_dict[id]) {
    return cache_dict[id]
  }
  cache_dict[id] = new Promise((res, rej) => {
    action().then(data => {
      if (timeout) setTimeout(() => { delete cache_dict[id] }, timeout)
      res(data)
    }).catch(e => {
      if (exception_timeout) setTimeout(() => { delete cache_dict[id] }, exception_timeout)
      rej(e)
    })
  })
  return cache_dict[id]
}
