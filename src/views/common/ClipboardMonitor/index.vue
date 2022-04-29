<template>
  <ShortUrlPopup :url-key="urlKey" />
</template>

<script>
import ShortUrlPopup from '@/views/common/ShortUrl/ShortUrlPopup'
export default {
  name: 'ClipboardMonitor',
  components: { ShortUrlPopup },
  data: () => ({
    clip_board_watching: null,
    urlKey: null,
    wait_to_show: false,
    do_not_show_tip_enable: false
  }),
  computed: {
    short_url_loading() {
      return this.$store.state.app.shorturl.loading
    },
    focus: {
      get() {
        return this.$store.state.app.focus
      },
      set(val) {
        this.$store.state.app.focus = val
      }
    }
  },
  watch: {
    '$store.state.app.shorturl.content': {
      handler(val) {
        this.urlKey = val
      },
      immediate: true
    }
  },
  mounted() {
    window.onfocus = e => {
      this.focus = true
      this.check_clipboard()
    }
    window.onblur = e => {
      this.focus = false
    }
  },
  methods: {
    check_clipboard() {
      if (!navigator || !navigator.clipboard || !navigator.clipboard.readText) {
        this.show_clipboard_notsupport_tip()
        return
      }
      navigator.clipboard.readText().then(c => {
        this.$store.dispatch('app/checkClipboard', c)
      })
    },
    show_clipboard_notsupport_tip() {
      if (this.do_not_show_tip_enable) return
      this.$notify({
        title: '不支持剪切板',
        message:
          '将无法使用分享功能,建议使用chrome66/firefox63以上版本的浏览器。',
        duration: 10000,
        type: 'error',
        onClose: this.do_not_show_tip
      })
    },
    do_not_show_tip() {
      this.do_not_show_tip_enable = true
    }
  }
}
</script>
