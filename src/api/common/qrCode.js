import request from '@/utils/request'

/**
 * 生成二维码
 *
 * @export
 * @param {String} text 生成
 * @param {IconConfiguration} icon
 * @param {Boolean} margin 生成
 * @param {Number} pixel 像素比
 */
export function qrCodeEncode(text, icon, margin, pixel) {
  return new Promise((res, rej) => {
    request.post('/static/qrCodeGenerate', {
      data: text,
      icon,
      margin,
      size: pixel
    }).then(data => {
      request.get(data.img, {
        responseType: 'arraybuffer'
      }).then(imgData => {
        res(imgData)
      }).catch(imgE => rej(imgE))
    }).catch(e => {
      rej(e)
    })
  })
}

/**
 * qr
 *
 * @export
 * @param {String} img base64string
 * @returns
 */
export function qrCodeScan(img) {
  return request.post('/static/qrCodeScan', {
    img
  })
}
