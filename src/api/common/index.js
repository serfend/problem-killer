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
