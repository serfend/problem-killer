const importAll = (context, keyMapper) => {
  const map = {}
  if (!keyMapper) keyMapper = (arr) => arr.join('.')
  for (const key of context.keys()) {
    const keyArr = key.split('/')
    keyArr.shift()
    let c = context(key)
    c = c && c.default
    if (!c) continue
    const component_key = keyMapper(keyArr, c)
    if (!component_key) continue
    map[component_key] = c
  }

  return map
}

export default importAll
