import request from '@/utils/request'
const api = 'MemberDevelop/'
export function getList({ companyCode }) {
  return request.get(`${api}getList`, {
    params: { companyCode }
  })
}
export function addMember({ userName, gender, classify, post, borntime, ruwutime, nation, natipl, education }) {
  return request.post(`${api}addMember`, {
    params: { userName, gender, classify, post, borntime, ruwutime, nation, natipl, education }
  })
}

export function updateMember({ Id, userName, gender, classify, post, borntime, ruwutime, nation, natipl, education }) {
  return request.put(`${api}updateMember`, {
    params: { Id, userName, gender, classify, post, borntime, ruwutime, nation, natipl, education }
  })
}

export function deleteMember({ Id }) {
  return request.put(`${api}deleteMember`, {
    params: { Id }
  })
}

export default { getList, addMember, updateMember, deleteMember }
