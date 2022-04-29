<template>
  <div ref="lottieBox" />
</template>

<script>
import lottie from 'lottie-web'
export default {
  name: 'LottieIcon',
  props: {
    animationData: {
      type: Object,
      default: null
    },
    path: {
      type: String,
      default: null,
      require: true
    },
    loop: {
      type: Boolean,
      default: true
    },
    animateSpeed: {
      type: Number,
      default: 1
    }
  },
  data: () => ({
    lottie: null
  }),
  watch: {
    path: {
      handler(val) {
        console.log('path', val)
        this.destroyInstance()
        this.initLottie()
      }
    },
    animateSpeed: {
      handler() {
        this.onSpeedChange()
      },
      immediate: true
    }
  },
  mounted() {
    this.initLottie()
  },
  beforeDestroy() {
    this.destroyInstance()
  },
  methods: {
    destroyInstance() {
      if (!this.lottie) return
      this.lottie.destroy()
      this.lottie = null
    },

    stop() {
      this.lottie.stop()
    },

    play() {
      this.lottie.play()
    },

    pause() {
      this.lottie.pause()
    },

    onSpeedChange() {
      if (!this.lottie) {
        return setTimeout(() => {
          this.onSpeedChange()
        }, 200)
      }
      this.lottie.setSpeed(this.animateSpeed)
    },

    isLottieFinish() {
      // this.lottie.removeEventListener('data_ready', this.isLottieFinish)
      this.onSpeedChange()
      this.$emit('isLottieFinish', true)
    },

    initLottie() {
      console.log('init lottie', this.path)
      this.lottie = lottie.loadAnimation({
        container: this.$refs.lottieBox,
        renderer: 'svg',
        loop: this.loop || true,
        animationData: this.animationData,
        // 如果需要用到路径请求，请使用 path ，lottie 如果 animationData 为空 ，则自动选择 path
        path: this.path
      })

      this.lottie.addEventListener('data_ready', this.isLottieFinish, {
        once: true
      })
    }
  }
}
</script>
