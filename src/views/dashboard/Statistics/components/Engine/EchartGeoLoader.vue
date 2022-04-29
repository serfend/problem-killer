<template>
  <div v-loading="loading" class="display-item">geo data loader</div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  name: 'StatisticsDataDriver',
  props: {
    fileLoad: {
      type: Function,
      default: null
    }
  },
  data: () => ({
    loading: false
  }),
  methods: {
    async refresh() {
      this.$emit('update:complete', false)
      this.fileLoad('china-200524.json')
        .then(data => {
          echarts.registerMap('china', data)
          this.$emit('update:complete', true)
        })
        .catch(e => {
          this.$message.error(`加载地图配置失败:${e.message}`)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.display-item {
  color: #aaa;
  font-size: 0.05rem;
}
</style>
