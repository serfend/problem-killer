export const importAll = (context, keyMapper) => {
  const map = {}
  if (!keyMapper) keyMapper = (arr) => arr.join('.')
  context.keys().map(key => {
    const keyArr = key.split('/')
    keyArr.shift()
    let c = context(key)
    c = c && c.default
    if (!c) return
    const component_key = keyMapper(keyArr, c)
    if (!component_key) return
    map[component_key] = c
  })

  return map
}
export const importAllByDefault = (context) => {
  const d = (keys, item) => {
    if (keys.length > 2 || (!item || !item.label)) return null
    return keys
      .join('.')
      .replace('.index', '')
      .replace('.vue', '')
  }
  return importAll(context, d)
}
export default importAll
