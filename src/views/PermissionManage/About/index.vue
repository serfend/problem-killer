<template>
  <MarkdownViewer :filename="fileName" :file-name="fileName" />
</template>

<script>
export default {
  name: 'About',
  label: '关于',
  components: {
    MarkdownViewer: () => import('@/components/MarkdownEditor/InnerViewer')
  },
  data: () => ({ fileName: 'permission.about.md' })
}
</script>

<style lang="scss" scoped>
</style>
