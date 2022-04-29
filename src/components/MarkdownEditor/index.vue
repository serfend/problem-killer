<template>
  <el-card v-if="component" style="margin:2%">
    <component :is="component" :file-name="fileName" v-bind="$attrs" :path="path" />
  </el-card>
</template>

<script>
export default {
  name: 'MarkdownPanel',
  components: {
    Editor: () => import('./InnerEditor'),
    Viewer: () => import('./InnerViewer')
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data: () => ({
    fileName: '',
    path: '',
    component: null
  }),
  mounted () {
    const q = this.$route && this.$route.query
    const fn = q && q.filename
    if (fn) {
      this.fileName = fn
      this.component = 'Viewer'
    } else {
      this.component = 'Editor'
      if (q.filename === undefined) { this.$router.push({ query: Object.assign({ filename: '' }, q) }) }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
