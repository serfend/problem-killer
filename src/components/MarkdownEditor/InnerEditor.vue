<template>
  <Editor
    ref="Editor"
    :options="Object.assign(defaultOptions,options)"
    :initial-value="value"
    initial-edit-type="wysiwyg"
    :height="height"
    @load="init"
  />
</template>

<script>
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/vue-editor'
export default {
  name: 'MarkdownEditor',
  components: {
    // ToastEditor: () => import('@toast-ui/vue-editor')
    Editor
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '50rem'
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    defaultOptions: {
      minHeight: '500px',
      language: 'zh-CN',
      useCommandShortcut: true,
      useDefaultHTMLSanitizer: true,
      usageStatistics: true,

      hideModeSwitch: true,
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'image', 'link'],
        ['code', 'codeblock'],
        ['scrollSync'],
      ]
    }
  }),
  mounted() {
  },
  methods: {
    init() {
      const editor = this.$refs.Editor
      console.log('editor init', editor)
    },
    get_content() {
      return this.$refs.Editor.editor.getMarkdown()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
