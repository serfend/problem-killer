
import website from '@/utils/website'
export function shortUrlContent(key) {
  return website.getWebUrlPath(`/s/${key}`)
}
