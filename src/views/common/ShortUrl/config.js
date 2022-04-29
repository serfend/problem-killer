
export function shortUrlContent(key) {
  return require('@/utils/website').getWebUrlPath(`/s/${key}`)
}
