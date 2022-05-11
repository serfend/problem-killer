import api from '@/api/problems'
export function get_all_database_summary ({ pageIndex = 0, pageSize = 2 }) {
  return new Promise((res, rej) => {
    api.get_database({ pageIndex, pageSize }).then(data => {
      const { databases, total } = data
      const db = databases.map(i => new Promise((res, rej) => {
        const name = i.name
        api.get_database_detail(name).then(data => {
          const r = Object.assign(i, data)
          return res(r)
        }).catch(e => {
          return res(null)
        })
      }))
      Promise.all(db).then((items) => {
        return res({ total, items })
      }).catch(e => rej(e))
    })
  })
}
export function build_span(i, value) {
  const r = { type: 'span', i, value }
  r.style = { 'font-size': '1.2rem' }
  return r
}
const default_attrs = {
  size: 'mini',
}
export function build_input(i, value) {
  const r = { type: 'el-input', i }
  r.attrs = default_attrs
  r.style = {
    width: '15rem'
  }
  return r
}
