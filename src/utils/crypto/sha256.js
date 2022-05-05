import CryptoJS from 'crypto-js'
export function sha256(data) {
  return CryptoJS.SHA256(data).toString()
}
