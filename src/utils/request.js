import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import qs from 'qs'
import {
  setTimeout
} from 'timers'

var warningInfoLog = {

}
// const CancelToken = axios.CancelToken
// // 数据存储
// export const cache = {
//   data: {},
//   set(key, data) {
//     this.data[key] = data
//   },
//   get(key) {
//     return this.data[key]
//   },
//   clear(key) {
//     delete this.data[key]
//   }
// }

// // 建立唯一的key值
// export const buildUniqueUrl = (url, method, params = {}, data = {}) => {
//   const paramStr = (obj) => {
//     if (toString.call(obj) === '[object Object]') {
//       return JSON.stringify(Object.keys(obj).sort().reduce((result, key) => {
//         result[key] = obj[key]
//         return result
//       }, {}))
//     } else {
//       return JSON.stringify(obj)
//     }
//   }
//   url += `?${paramStr(params)}&${paramStr(data)}&${method}`
//   return url
// }

// create an axios instance
const service = axios.create({
  baseURL: require('@/utils/website').getWebLocation(), // api 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 120e3 // request timeout
})
// const defaultOptions = {
//   time: 3e3 // 设置为0，不清除缓存
// }
// const getCache = (config) => {
//   const index = buildUniqueUrl(config.url, config.method, config.params, config.data)
//   const responsePromise = cache.get(index)
//   return {
//     index, responsePromise
//   }
// }
// TODO 增加缓存功能
// request interceptor
service.interceptors.request.use(
  config => {
    if (config.headers['Content-Type'] === 'application/urlencoded') {
      config.data = qs.stringify(config.data)
    }
    // if (!config.ignore_cache) {
    //   const source = CancelToken.source()
    //   config.cancelToken = source.token
    //   const cacher = getCache(config)
    //   const cache = cacher.responsePromise
    //   if (cache) {
    //     // console.log('检测到缓存', cache)
    //     source.cancel(cache)
    //   }
    //   config.cacheIndex = cacher.index
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    // const index = response.config.cacheIndex
    // cache.set(index, res)
    // if (defaultOptions.time !== 0) {
    //   setTimeout(() => {
    //     cache.clear(index)
    //   }, defaultOptions.time)
    // }
    const ignoreError = response.config.ignoreError
    return extract_result(res, ignoreError, response)
  },
  error => {
    // if (axios.isCancel(error)) {
    //   return extract_result(error.message, false)
    // }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export function handle_exception({ res, ignoreError, response, resolve, reject }) {
  const { status, message } = res
  // 通过缓存方式解决频繁报同一个错误的问题
  const callback = {}
  callback[-2] = () => {
    return MessageBox.confirm('已存在数据,是否覆盖?', {
      confirmButtonText: '覆盖'
    }).then(data => {
      const pre_data = JSON.parse(response.config.data).data
      response.config.data = {
        allowOverWrite: true,
        data: pre_data
      }
      service.request(response.config).then(data => resolve(data)).catch(e => reject(e))
    }).catch(e => reject(e))
  }
  callback.default = () => {
    if (!ignoreError && !warningInfoLog[message]) {
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
    }

    warningInfoLog[message] = new Date()
    setTimeout(() => {
      delete warningInfoLog[message]
    }, 5e3)

    if (res.data && res.data.list) {
      const list = res.data.list
      for (var i = 0; i < list.length; i++) {
        setTimeout((errItem) => {
          const isGuidEmpty = errItem.message.indexOf('System.Guid') > -1
          Message({
            message: `${errItem.key}:${isGuidEmpty ? '未填写' : errItem.message}`,
            type: 'error',
            duration: 5e3
          })
        }, (i + 1) * 2000, list[i])
      }
    }
    reject(res)
  }
  if (callback[status]) return callback[status]()
  return callback.default()
}
export function extract_result(res, ignoreError, response) {
  return new Promise((resolve, reject) => {
    // 如果不存在status，说明是直接文件，直接返回
    if (res.status === undefined) {
      console.warn('api data return without status description:[unexpected]', res)
      return resolve(res)
    }
    if (res.status === 0) {
      return resolve(res.data)
    } else {
      handle_exception({ res, ignoreError, response, resolve, reject })
    }
  })
}
export default service
