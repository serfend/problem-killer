import request from '@/utils/request'
import { sha256 } from '@/utils/crypto/sha256'
const CryptoJS = require('crypto-js')
export function upload({ data, file }) {
  const { filePath, fileName, isHidden, anonymous } = data
  var fd = new FormData()
  fd.append('file', file)
  return new Promise((res, rej) => {
    caculate_sha256(file).then(sha256_content => {
      fd.append('fileSha256', sha256_content)
      fd.append('isHidden', isHidden)
      fd.append('filepath', filePath)
      fd.append('filename', fileName)
      fd.append('anonymous', anonymous)
      request.post('file/upload', fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(data => {
        res(data)
      }).catch(e => rej(e))
    }).catch(e => rej(e))
  })
}
function caculate_sha256(contractFile) {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    const blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice
    reader.readAsArrayBuffer(blobSlice.call(contractFile))
    reader.onload = (evt) => {
      const fileBuffer = evt.target.result
      const content = arrayBufferToWordArray(fileBuffer)
      const shaResult = sha256(content)
      res(shaResult)
    }
    reader.onerror = (e) => { rej(e) }
  })
}
function arrayBufferToWordArray(ab) {
  var i8a = new Uint8Array(ab)
  var a = []
  for (var i = 0; i < i8a.length; i += 4) {
    a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3])
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length)
}

/**
 * 通过文件id下载
 *
 * @export
 * @param {*} fileid
 * @returns
 */
export function download(fileid, responseType) {
  const opt = {
    responseType,
    params: {
      fileid
    }
  }
  if (!opt.responseType) delete opt.responseType
  return request.get('file/download', opt)
}

/**
 * 获取文件夹下的文件列表
 *
 * @export
 * @param {*} filepath
 * @param {*} pages
 * @returns
 */
export function folderFiles({ userid, path, pages }) {
  return request.get('file/folderFiles', {
    params: {
      userid,
      path,
      pageIndex: pages.pageIndex,
      pageSize: pages.pageSize
    }
  })
}

/**
 * 获取子文件夹
 *
 * @export
 * @param {*} path
 * @param {*} pages
 * @returns
 */
export function requestFolder({ userid, path, pages }) {
  return request.get('file/folders', {
    params: {
      userid,
      path,
      pageIndex: pages.pageIndex,
      pageSize: pages.pageSize
    }
  })
}

/**
 *获取指定文件信息
 *
 * @export
 * @param {*} filepath
 * @param {*} filename
 * @returns
 */
export function requestFile({ userid, filePath, fileName }) {
  return request.get('file/load', {
    params: {
      userid,
      filePath,
      fileName
    }
  })
}

/**
 * 通过路径下载文件
 *
 * @export
 * @param {*} path
 * @param {*} filename
 * @returns
 */
export function downloadByPath({ userid, path, filename, ignoreError, responseType }) {
  const opt = {
    responseType,
    params: {
      userid,
      path,
      filename
    },
    ignoreError
  }
  if (!opt.responseType) delete opt.responseType
  return request.get('file/frompath', opt)
}

/**
 * 删除指定文件
 *
 * @export
 * @param {*} filepath
 * @param {*} filename
 * @param {*} clientKey
 * @returns
 */
export function deleteFile({ userid, filepath, filename, clientKey }) {
  return request.delete('file/remove', {
    params: {
      userid,
      path: filepath,
      filename,
      clientKey
    }
  })
}

/**
 * 获取当前的文件下载/上传状态
 * 有效期30分钟
 * @export
 * @returns
 */
export function status() {
  return request.get('file/status')
}

/**
 * 获取上传码
 *
 * @export
 * @param {*} id 文件id
 * @param {*} auth 授权码
 */
export function getClientKey(id, auth) {
  return request.post('file/clientKey', {
    id,
    auth
  })
}
