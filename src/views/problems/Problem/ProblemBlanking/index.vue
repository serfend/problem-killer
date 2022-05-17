<template>
  <span>
    <component :is="b.type" v-for="(b,bindex) in blanking" :ref="`${b.type}${b.i}`" :key="bindex" v-model="user_input[b.i]" v-bind="b.attrs" :style="b.style" @keyup.enter.native="onSubmit(b)">{{ b.value }}
    </component>
  </span>
</template>

<script>
import { build_content } from '../loader'
export default {
  label: '填空',
  name: 'ProblemBlanking',
  components: {

  },
  props: {
    data: { type: Object, default: null },
    focus: { type: Boolean, default: false },
    index: { type: Number, default: null }
  },
  data: () => ({
    blanking: null,
    user_input: [],
    focus_callback_set: null
  }),
  watch: {
    data: {
      handler (val) {
        this.refresh(val)
      },
      immediate: true,
      deep: true
    },
    // TODO 实现通过父级的slot.ref统一管理
    focus: {
      handler (val) {
        this.setKeyHandler(val)
      },
      immediate: true
    }
  },
  destroyed() {
    this.setKeyHandler(false)
  },
  methods: {
    setKeyHandler(is_set) {
      if (is_set && !this.focus_callback_set) {
        console.log('callback is set to', this.index)
        document.addEventListener('keyup', this.keyInput)
        this.focus_callback_set = true
        return
      } else if (this.focus_callback_set) {
        console.log('callback remove from', this.index)
        document.removeEventListener('keyup', this.keyInput)
        this.focus_callback_set = false
      }
    },
    keyInput(v) {
      const { ctrlKey, altKey, key } = v
      console.log('key input', ctrlKey, altKey, key, this.data.id)
      if (!ctrlKey || !altKey) return
      if (key === 'ArrowRight') {
        return this.directSubmit({ is_right: false, is_manual: true })
      } else if (key === 'ArrowLeft') {
        return this.directSubmit({ is_right: true, is_manual: true })
      } else if (key === 'Enter') this.onSubmit({ type: 'el-input', i: -1 })
    },
    onSubmit(v) {
      const iCount = v.i + 1
      if (iCount < this.user_input.length) {
        const d = this.$refs[`${v.type}${iCount}`]
        const c = d[0]
        c && c.focus()
        return
      }
      return this.judgeSubmit(this.user_input)
    },
    judgeSubmit(result) {
      const answer = this.data.answer
      const is_right = !answer.find((i, index) => {
        return i !== result[index]
      })
      return this.directSubmit({ is_right })
    },
    directSubmit({ is_right, is_manual }) {
      return this.$emit('onUserSubmit', { is_right, is_manual })
    },
    refresh (v) {
      const content = this.data && this.data.content
      if (!content) {
        this.blanking = null
        return
      }
      const r = build_content(content)
      this.user_input = new Array(r.count)
      this.blanking = r.items
    }
  }
}
</script>
<style lang="scss" scoped>
.content-container {
  display: flex;
}
</style>
