import request from '@/utils/request'
const api = '/memberRate'
import form from '@/utils/form'
export function get_rates({ company, user, ratingCycleCount, ratingType, page }) {
  return request({
    url: `${api}/info`,
    method: 'post',
    data: {
      company: form.toQueryValue(company),
      user: form.toQueryValue(user),
      ratingCycleCount: form.toQueryStartEnd(ratingCycleCount),
      ratingType: form.toQueryStartEnd(ratingType),
      page
    }
  })
}

export function status_dict() {
  return request({
    url: `${api}/statusDict`,
    method: 'get'
  })
}
