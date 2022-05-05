<template>
  <div>
    <span>这里日后放个图表记录一下最近访问情况，通过api筛选</span>
  </div>
</template>

<script>
import { statistics } from '@/api/common/dwz'
export default {
  name: 'ShortUrlStatistics',
  props: {
    urlKey: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      target: '',
      create: { start: '', end: '' },
      viewBy: '',
      ip: '',
      device: '',
      pages: {
        pageIndex: 0,
        pageSize: 0
      }
    }
  },
  methods: {
    loadStatistics() {
      statistics(this.urlKey).then(data => {
        console.log(data)
      })
    }
  }
}
</script>

<style>
</style>
