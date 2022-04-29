<template>
  <el-card style="width:100%" :loading="!src">
    <iframe v-if="src" :src="src" width="100%" height="1080px" frameborder="0" />
  </el-card>
</template>

<script>
export default {
  name: 'IFramePage',
  data() {
    return {
      src: null
    }
  },
  mounted() {
    if (this.$route && this.$route.query.src) {
      this.src = require('@/utils/website').getWebUrlPath(this.$route.query.src)
    } else {
      this.$message.error('未指定src')
      setTimeout(() => {
        location.href = '/'
      }, 5000)
    }
  }
}
</script>

<style>
</style>
