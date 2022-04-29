/**
 * 按目标字段进行分组
 *
 * @param {*} list
 * @param {*} name
 * @returns
 */
export function groupByFiled(list, name) {
  return list.reduce((obj, item) => {
    const key = item[name]
    if (!obj[key]) {
      obj[key] = []
      obj[key].push(item)
    } else {
      obj[key].push(item)
    }
    return obj
  }, {})
}

/**
 * 按目标方法分组
 *
 * @export
 * @param {*} list
 * @param {*} cb
 */
export function groupByPredict(list, cb) {
  return list.reduce((obj, item) => {
    const key = cb(item)
    if (!obj[key]) {
      obj[key] = []
      obj[key].push(item)
    } else {
      obj[key].push(item)
    }
    return obj
  }, {})
}

/**
 * 按回调返回值进行分组
 *
 * @param {*} array
 * @param {*} f
 * @returns
 */
export function groupByLamada(array, f) {
  var groups = {}
  array.forEach(function (o) {
    var group = JSON.stringify(f(o))
    groups[group] = groups[group] || []
    groups[group].push(o)
  })
  return Object.keys(groups).map(function (group) {
    return groups[group]
  })
}

/**
 * edit setting (`prop` or `set`) and prevent setting from raise event of changed
 *
 * @export
 * @param {*} item setting item
 * @param {*} callback what wants to do
 * @param {*} freezingOffCallBack what wants to do while complete
 */
export function modify(item, callback, freezingOffCallBack) {
  if (!item) return
  if (!item.__setting) {
    item.__setting = {
      freezing: true
    }
  } else item.__setting.freezing = true
  setTimeout(() => {
    callback(item)
    setTimeout(() => {
      item.__setting.freezing = false
      if (freezingOffCallBack) freezingOffCallBack()
    }, 1000)
  }, 50)
}

/**
 * get property of object
 * you can use `getProp(obj,['a','b','c'])` to get obj.a.b.c,simply?
 *
 * @export
 * @param {Object} node
 * @param {String,Array} names
 * @param {String} directZoomIn if find result has this prop,directly zoom in
 * @returns if property not exist or is `null`,it would return null
 */
export function getProp(node, names, directZoomIn = 'value') {
  if (!node) return null
  const isStr = Object.prototype.toString.call(names) === '[object String]'
  if (names.length === 0) return node
  const q = names.splice(0, 1)
  if (directZoomIn && node[directZoomIn]) node = node[directZoomIn]
  const r = isStr ? node[names] : getProp(node[q[0]], names)
  if (directZoomIn && r && r[directZoomIn] !== undefined) return r[directZoomIn]
  return r
}
/**
 * compare i1 and i2,then put prop in i1 to i2's prop,and if there is prop `type` ,ignore it
 *
 * @param {Object} i1
 * @param {Object} i2
 */
export function pairSetting(i1, i2) {
  const k2 = Object.keys(i2).filter(i => i !== 'type')
  for (var i = 0; i < k2.length; i++) {
    const key = k2[i]
    const isObject = Object.prototype.toString.call(i2[key]) === '[object Object]'
    // 仅当两边皆对象，且原对象存在时才继续匹配
    if (isObject && i1[key]) {
      pairSetting(i1[key], i2[key])
    } else if (i2[key] !== null) {
      i1[key] = i2[key]
    }
  }
}

/**
 * 逐项变换数组
 *
 * @export
 * @param {Array} rawArr 原数组 不能 为空
 * @param {Array} targetArr 目标数组 不能 为空
 * @param {Function} cb 完成变换后的回调
 * @param {Number} interval 变换间隔
 * @param {String} idFunc 如何识别唯一性,默认为id
 */
export function transition_Array(rawArr, targetArr, cb, interval, idFunc, rawRemoveIndex = -1, targetAddIndex = -1) {
  if (!idFunc) idFunc = i => i.id
  interval = interval || 1e2
  targetArr = targetArr || []
  if (rawRemoveIndex === -1) rawRemoveIndex = rawArr.length
  if (targetAddIndex === -1) targetAddIndex = targetArr.length
  const dict_target = {}
  const dict_raw = {}
  targetArr.map(i => { dict_target[idFunc(i)] = i })
  rawArr.map(i => { dict_raw[idFunc(i)] = i })
  // console.log('transiaction dict', dict_raw, dict_target)
  let nowOffset = 0
  const should_remove_index = rawArr.map((i, index) => {
    if (!dict_target[idFunc(i)]) return index
    return -1
  }).filter(i => i >= 0).map(i => {
    const result = i - nowOffset
    nowOffset++
    return result
  }).map(i => ({ a: true, v: i }))
  const should_add = targetArr.filter(i => !dict_raw[idFunc(i)]).map(i => ({ a: false, v: i }))
  let nowTask = 0
  const callback = () => {
    nowTask--
    if (nowTask <= 0) return cb && cb()
  }
  if (should_remove_index.length) {
    nowTask++
    direct_transition_Array(rawArr, interval, should_remove_index, callback)
  }
  if (should_add.length) {
    nowTask++
    direct_transition_Array(rawArr, interval, should_add, callback)
  }
  if (nowTask === 0) return callback()
}

/**
 * 直接开始平滑搬运数组
 *
 * @param {*} rawArray
 * @param {*} interval
 * @param {*} actionQueue
 * @param {*} cb
 * @return {*}
 */
function direct_transition_Array(rawArray, interval, actionQueue, cb) {
  // console.log('start transition', actionQueue)
  if (!actionQueue.length) {
    return cb && cb()
  }
  const t = actionQueue.shift()
  if (t.a) {
    rawArray.splice(t.v, 1)
  } else {
    rawArray.push(t.v)
  }
  setTimeout(() => {
    direct_transition_Array(rawArray, interval, actionQueue, cb)
  }, interval)
}
