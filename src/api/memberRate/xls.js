import request from '@/utils/request'
import { downloadUrl } from '../common/static'
const api = '/memberRate'
export function download_template() {
  return downloadUrl(`${api}/XlsTemplate`)
}
export function upload_data_by_xls({ xls, create, ratingCycleCount, ratingType, company, confirm }) {
  const d = { xls, create, ratingCycleCount, ratingType, company, confirm }
  const fd = new FormData()
  Object.keys(d).forEach(i => {
    fd.append(i, d[i])
  })
  return request({
    method: 'post',
    url: `${api}/xlsUpload`,
    data: fd,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 *当上传xls后提示需要确认时使用
 *
 * @export
 * @return {*}
 */
export function upload_data_by_last() {
  return request({
    url: `${api}/confirmLastXlsUpload`,
    method: 'patch'
  })
}

