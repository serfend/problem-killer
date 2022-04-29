import JsEncrypt from 'jsencrypt'
import {
  currentRSAKey
} from '@/api/common/static'
const prefix = '-----BEGIN PUBLIC KEY-----'
const append = '-----END PUBLIC KEY-----'
let key
let rsaDate = new Date()

async function getKey() {
  if (key && new Date() - rsaDate < 600 * 1000) return key
  const data = await currentRSAKey()
  key = data.model
  rsaDate = new Date()
  return key
}

async function encrypt(raw) {
  await getKey()
  const jse = new JsEncrypt()
  jse.setPublicKey(`${prefix}${key}${append}`)
  const password = jse.encrypt(raw)
  return password
}

export default {
  encrypt
}
