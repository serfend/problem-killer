export function common_data({ path, key, val }) {
  return new Promise((res, rej) => {
    const d = localStorage.getItem(path)
    const data = (d && JSON.parse(d)) || {}
    if (key) {
      data[key] = val
      localStorage.setItem(path, JSON.stringify(data))
    }
    res(data)
  })
}
export function common_data_without_key({ path, val }) {
  const key_data = 'default'
  const key = val ? key_data : null
  return new Promise((res, rej) => {
    common_data({ path, key, val }).then(data => {
      res(data)
    }).catch(e => rej(e))
  })
}
