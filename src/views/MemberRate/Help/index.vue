<template>
  <MarkdownViewer file-name="zkyp.md" />
</template>

<script>
export default {
  name: 'MemberRateHelp',
  components: {
    MarkdownViewer: () => import('@/components/MarkdownEditor/InnerViewer')
  }
}
</script>
