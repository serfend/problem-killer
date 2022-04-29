import {
  download,
  requestFile
} from '@/api/common/file'

/**
 * 获取指定文档
 *
 * @export
 * @param {String} path
 * @param {String} fileName
 * @returns
 */
export function loadDocument(path, fileName) {
  return new Promise((res, rej) => {
    requestFile({ filePath: path, fileName })
      .then(data => {
        const f = data.file || data.model
        if (f.isRemoved) {
          return rej(`文件:${path}/${fileName} 已于${f.removeDate}被移除`)
        }
        download(f.id).then(data => {
          var reader = new FileReader()
          reader.onload = function (event) {
            var content = reader.result
            res(content)
          }
          // it seem sometimes occur that data is just simply `string`
          if (typeof data === 'string') {
            res(data)
          } else {
            reader.readAsText(data)
          }
        })
      })
      .catch(e => {
        rej(`读取${path}/${fileName}异常:${e.message}`)
      })
  })
}
export function fileToBase64(data, fileType) {
  return new Promise((res, rej) => {
    var reader = new FileReader()
    reader.onload = function (evt) {
      res(evt.target.result)
    }
    reader.onerror = function (evt) {
      rej(evt)
    }
    if (!fileType) fileType = 'image/jpg'
    var blob = new Blob([data], {
      type: fileType
    })
    reader.readAsDataURL(blob)
  })
}
export function base64ToBlob(content) {
  const raw = window.atob(content)
  const rawLength = raw.length
  const uInt8Array = new Uint8Array(rawLength)
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type: 'arraybuffer' })
}

export function downloadBlob(data, filename) {
  filename = filename || `data${Math.round(Math.random() * 1e6)}.dat`
  const url = window.URL.createObjectURL(new Blob([data], { type: 'arraybuffer' }))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 导出xlsx的blob
 *
 * @export
 * @param {*} data blob数据
 * @param {*} model 模型
 * @param {*} option generate option
 */
export function exportXlsByTemplate(data, model, option) {
  const XlsxTemplate = require('xlsx-template')
  const template = new XlsxTemplate(data)
  template.sheets.forEach((i, index) => {
    template.substitute(index + 1, model)
  })
  option = option || { type: 'uint8array' }
  return template.generate(option)
}
