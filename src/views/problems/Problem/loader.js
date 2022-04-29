import api from '@/api/problems'
export function get_all_database_summary (name) {
  return new Promise((res, rej) => {
    api.get_database().then(data => {
      const db = data.database.map(i => new Promise((res, rej) => {
        const name = i.name
        api.get_database_detail(name).then(data => {
          const r = Object.assign(i, data)
          return res(r)
        }).catch(e => {
          return res(null)
        })
      }))
      return res(Promise.all(db))
    })
  })
}
