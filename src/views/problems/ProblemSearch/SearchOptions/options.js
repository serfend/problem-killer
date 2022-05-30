export function build_result(result, key, value) {
  if (!key)key = 'name'
  if (!result[key])result[key] = []
  result[key].push(value)
}
export function generateOptionByResult(data) {
  if (!data) return {}
  const { content } = data
  if (!content) return {}
  const items = content.split(' ')
  const result = { }
  items.map(i => {
    if (!i) return
    const ext_detect = i.indexOf(':')
    if (ext_detect === -1) return build_result(result, 'name', i)
    const key = i.substring(0, ext_detect)
    const value = i.substring(ext_detect + 1)
    return build_result(result, key, value)
  })
  Object.keys(data).filter(i => i !== 'content').map(i => {
    data[i] = null
  })
  Object.keys(result).map(i => {
    data[i] = result[i].join(';')
  })
  return result
}
export function build_options(data) {
  return Object.keys(data)
    .filter(i => i !== 'content' && data[i])
    .map(i => ({ k: i, v: data[i].split(';') }))
}
export function generateResultByOption(data) {
  if (!data) return {}
  const result =
  build_options(data)
    .map(i => {
      if (i.k === 'name') return i.v.join(';')
      return `${i.k}:${i.v.join(';')}`
    }).join(' ')
  data.content = result
  return result
}
