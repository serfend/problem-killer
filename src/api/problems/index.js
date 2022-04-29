import request from '@/utils/request'
const api = '/data/problems/'
export function get_database () {
  return request.get(`${api}index.json`, {})
}
export function get_database_detail(name) {
  return request.get(`${api}database/${name}.json`, {})
}
export default {
  get_database,
  get_database_detail
}
