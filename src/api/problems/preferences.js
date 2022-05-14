import { common_data_without_key } from '@/api/common'
export function user_preferences ({ val }) {
  const path = `user_preferences`
  return common_data_without_key({ path, val })
}
export default {
  user_preferences
}
