<template>
  <MarkdownViewer :initial-value="value" :file-name="fileName" />
</template>

<script>
import MarkdownViewer from '@/components/MarkdownEditor/InnerViewer'
export default {
  name: 'About',
  components: { MarkdownViewer },
  data() {
    return {
      fileName: 'grade.phy.about.md',
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
