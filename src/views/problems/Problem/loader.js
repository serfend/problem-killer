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
export function build_span(i, value, type = 'span') {
  const r = { type, i, value }
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
  const lines = content.split('\n')
  let answer_length = 0
  let index = 0
  lines.map(content => {
    r.push(build_span(index, '', 'div'))
    const items = content.split('{{ANS}}') || []
    answer_length += (items.length - 1)
    items.map((v, child_index) => {
      r.push(build_span(index, v))
      if (child_index < items.length - 1) r.push(build_input(index, v))
      index++
    })
  })
  return { items: r, count: answer_length }
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
