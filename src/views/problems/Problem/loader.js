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
export function append_endchar(content, end_char = '。') {
  const end = content[content.length - 1]
  if (end !== end_char)content += end_char
  return content
}
export function build_content(content) {
  if (!content) return { items: [], count: 0 }
  const r = []
  content = append_endchar(content)
  const items = content.split('{{ANS}}') || []
  items.map((v, index) => {
    r.push(build_span(index, v))
    if (index < items.length - 1) r.push(build_input(index, v))
  })
  return { items: r, count: items.length - 1 }
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
