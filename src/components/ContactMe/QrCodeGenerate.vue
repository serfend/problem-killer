<template>
  <div
    v-loading="onLoading"
    :style="{width:size + 'px',height:size + 'px','line-height':size+'px','text-align':'center',display:'flex',margin:'0 auto'}"
  >
    <el-image
      v-if="qrCodeUrl"
      class="full"
      :src="qrCodeUrl"
      style="cursor:pointer"
      @click="go_url"
    />
    <div v-else class="full">加载中</div>
  </div>
</template>

<script>
import { qrCodeEncode } from '@/api/common/qrCode'
import { fileToBase64 } from '@/utils/file'
export default {
  name: 'QrCodeGenerate',
  props: {
    url: { type: String, default: null },
    size: { type: Number, default: 200 },
    pixel: { type: Number, default: 5 },
    icon: { type: String, default: null },
    iconSize: { type: Number, default: 15 },
    iconBorderSize: { type: Number, default: 6 },
    margin: { type: Boolean, default: false },
  },
  data() {
    return { qrCodeUrl: null, onLoading: false, lastUpdate: new Date() }
  },
  watch: {
    url: {
      handler(val) {
        if (val) {
          this.innerUrl = val
        }
      },
      immediate: true,
    },
  },
  mounted() {
    if (!this.$route) return
    var temp = this.$route.query.url
    if (temp && !this.innerUrl) {
      this.innerUrl = temp
      this.refresh()
    }
  },
  methods: {
    go_url() {
      const url = this.innerUrl
      window.open(url)
    },
    refreshDelay(delay) {
      var lastUpdate = new Date()
      if (!delay) delay = 1000
      this.lastUpdate = lastUpdate
      setTimeout(() => {
        this.refresh()
      }, delay)
    },
    refresh() {
      if (this.onLoading) return
      this.onLoading = true
      var self = this
      qrCodeEncode(
        this.innerUrl,
        {
          fileName: this.icon,
          iconSize: this.iconSize,
          borderSize: this.iconBorderSize,
        },
        this.margin,
        this.pixel
      )
        .then((data) => {
          var t = fileToBase64(data)
          t.then((url) => {
            self.qrCodeUrl = url
          })
        })
        .finally(() => {
          this.onLoading = false
        })
    },
  },
}
</script>

<style scoped>
.full {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
