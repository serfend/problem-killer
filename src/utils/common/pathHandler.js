const pathToDict = (path_list, key_getter) => {
  if (!key_getter) key_getter = k => k.split('.')
  const dict = {}
  path_list.map(p => {
    const path = key_getter(p)
    let current_node = dict
    for (const node of path) {
      if (!current_node[node]) {
        current_node[node] = {}
      }
      current_node = current_node[node]
    }
    current_node.value = p
  })
  return dict
}
const pathToArray = (path_list, key_getter) => {
  const dict = pathToDict(path_list, key_getter)
  const list = []
  putItem(list, dict, 'root')
  return list
}
const putItem = (list, dict, name) => {
  const item = Object.assign({
    name,
    children: []
  }, dict.value)
  Object.keys(dict).filter(i => i !== 'value').map(i => {
    const d = dict[i]
    if (Object.prototype.toString.call(Object.values(d)[0]) === '[object String]') {
      item.children.push(d)
      return
    }
    putItem(item.children, d, i)
  })
  list.push(item)
}
export default { pathToDict, pathToArray }
