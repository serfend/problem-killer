<template>
  <div>
    <span class="right-panel">
      <span class="display-title">{{ right.name }}</span>
      <span class="time">{{ right.now }}</span>
    </span>
    <span class="left-panel">
      <span class="time">{{ left.now }}</span>
      <span class="display-title">{{ left.name }}</span>
    </span>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
export default {
  name: 'TimeCenter',
  props: {
    timeSyncMethod: {
      type: Function,
      default: () => {
        return new Promise((res, rej) => {
          const now = new Date()
          const r = {
            left: {
              name: '天文时间',
              value: new Date(now - 0)
            },
            right: {
              name: '中心时间',
              value: new Date(now - 80000000)
            }
          }
          res(r)
        })
      }
    }
  },
  data: () => ({
    left: {},
    right: {},
    lastUpdate: new Date(),
    refresher: null
  }),
  mounted() {
    this.refresh()
  },
  methods: {
    refresh(interval) {
      if (!interval) interval = 1000
      if (this.refresher) {
        clearInterval(this.refresher)
        this.refresher = null
      }
      this.timeSyncMethod().then(data => {
        this.left = { name: null, value: null, now: null, ...data.left }
        this.right = { name: null, value: null, now: null, ...data.right }
        this.lastUpdate = new Date() - 0
        this.refreshOnce()
        this.refresher = setInterval(this.refreshOnce, interval)
      })
    },
    refreshOnce() {
      this.left.now = this.getDate(this.left.value, new Date())
      this.right.now = this.getDate(this.right.value, new Date())
    },
    getDate(beginDate, target) {
      if (!target) target = new Date()
      const beginStamp = new Date(beginDate) - 0
      const targetStamp = target - 0
      const beginLocalStamp = this.lastUpdate
      const time = new Date(beginStamp + targetStamp - beginLocalStamp)
      return parseTime(time, '{yyyy}-{mm}-{dd} {hh}:{ii}:{ss}')
    }
  }
}
</script>

<style>
</style>
