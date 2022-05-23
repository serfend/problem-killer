import api from '@/api/problems'

export function getTypeName (type) {
  if (!type) return null
  const t = api.ProblemTypeReverse[type]
  if (!t) return null
  const handle_single = t => {
    const suffix = t.substring(1)
    const prefix = t[0].toUpperCase()
    return `${prefix}${suffix}`
  }
  const r = t.split('_').map(i => handle_single(i))
  return `Problem${r.join('')}`
}

export const problemColorSet = {
  focus: '#0ff7f0',
  mouse_focus: '#000ce6',
  answer_right: '#1bdb0d',
  answer_wrong: '#e60800'
}
