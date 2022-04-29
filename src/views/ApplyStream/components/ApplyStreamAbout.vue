<template>
  <MarkdownViewer :filename="fileName" :file-name="fileName" />
</template>

<script>
import MarkdownViewer from '@/components/MarkdownEditor/InnerViewer'
export default {
  name: 'ApplyStreamAbout',
  components: { MarkdownViewer },
  data() {
    return {
      fileName: 'auditStream.about.md',
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
