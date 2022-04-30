import api from '@/api/problems'
export function get_all_database_summary (pageIndex = 0, pageSize = 5) {
  return new Promise((res, rej) => {
    api.get_database().then(data => {
      let databases = data.database
      if (!databases) return res([])
      databases = databases.splice(pageIndex * pageSize, pageSize)
      const db = databases.map(i => new Promise((res, rej) => {
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
