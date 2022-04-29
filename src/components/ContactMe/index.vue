<template>
  <div>
    <div v-if="innerUrl && showQr">
      <el-row>
        <QrCodeGenerate
          ref="qrCode"
          :url="innerUrl"
          :pixel="pixel"
          :icon="icon"
          :icon-size="iconSize"
          :icon-border-size="iconBorderSize"
          :margin="margin"
        />
      </el-row>
      <el-row style="font-size:12px;text-align:center;margin-top:5px">{{ description }}</el-row>
    </div>
    <div v-else-if="!showQr">二维码已禁用</div>
    <div v-else style="width:200px;height:200px;text-align:center;line-height:200px">加载中</div>
  </div>
</template>

<script>
import { download } from '@/api/common/file'
import QrCodeGenerate from './QrCodeGenerate'
export default {
  name: 'ContactMe',
  components: { QrCodeGenerate },
  props: {
    url: { type: String, default: null },
    content: { type: String, default: null },
    description: { type: String, default: '使用微信扫一扫联系我们吧~' },
    size: { type: Number, default: 200 },
    pixel: { type: Number, default: 5 },
    icon: { type: String, default: null },
    iconSize: { type: Number, default: 15 },
    iconBorderSize: { type: Number, default: 6 },
    margin: { type: Boolean, default: false },
  },
  data() {
    return {
      qrCodeUrl: null,
      innerUrl: null,
    }
  },
  computed: {
    showQr() {
      return process.env.showQRCode
    }
  },
  watch: {
    content: {
      handler(val) {
        if (val) {
          this.innerUrl = val
          this.refresh()
        }
      },
      immediate: true,
    },
    url: {
      handler(val) {
        if (val) {
          this.load(val)
        }
      },
      immediate: true,
    },
  },
  mounted() {
    if (!this.$route) return
    var temp = this.$route.query.url
    if (temp && !this.innerUrl) {
      this.load(temp)
    }
  },
  methods: {
    refresh() {
      this.$nextTick(() => {
        const qr = this.$refs.qrCode
        if (qr)qr.refreshDelay(300)
      })
    },
    load(url) {
      var self = this
      download(url).then((data) => {
        self.innerUrl = data
      })
    },
  },
}
</script>

<style>
</style>
