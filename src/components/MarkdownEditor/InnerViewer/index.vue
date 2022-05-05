<template>
  <Viewer ref="Viewer" :initial-value="fileName?value:content" />
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css'
import { Viewer } from '@toast-ui/vue-editor'
import { loadDocument } from '@/utils/file'
export default {
  name: 'MarkdownViewer',
  components: { Viewer },
  props: {
    fileName: {
      type: String,
      default: null
    },
    path: {
      type: String,
      default: null
    },
    content: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      value: '> 加载中...'
    }
  },
  computed: {
    filePath() {
      return this.path || 'client-sfvue'
    }
  },
  watch: {
    fileName: {
      handler(val) {
        this.refreshDoc()
      }
    },
    path: {
      handler(val) {
        this.refreshDoc()
      }
    },
    content: {
      handler(val) {
        this.$refs.Viewer.editor.setMarkdown(val)
      }
    }
  },
  mounted() {
    const q = this.$route && this.$route.query
    const targetFile = q && q.filename
    const targetPath = q && q.path
    this.refreshDoc({ targetFile, targetPath })
  },
  methods: {
    refreshDoc({ targetPath, targetFile }) {
      targetFile = targetFile || this.fileName
      targetPath = targetPath || this.filePath
      if (!targetFile) return
      loadDocument(targetPath, targetFile)
        .then(i => {
          this.$refs.Viewer.editor.setMarkdown(i)
        })
        .catch(e => {
          this.$message.error(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
