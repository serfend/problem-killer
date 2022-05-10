import Velocity from 'velocity-animate'

export function beforeEnter (el) {
  el.style.opacity = 0
  el.style['margin-left'] = '5rem'
}
export function enter (el, done) {
  const delay = (el.dataset.index || 0) * 150
  setTimeout(() => {
    Velocity(
      el,
      { 'margin-left': '', opacity: 1 },
      { complete: done }
    )
  }, delay)
}
export function beforeLeave (el, done) {
  return this.beforeEnter(el)
}
export default {
  beforeEnter,
  enter,
  beforeLeave
}
