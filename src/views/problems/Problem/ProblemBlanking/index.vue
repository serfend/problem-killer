<template>
  <span>
    <component :is="b.type" v-for="(b,bindex) in blanking" :ref="`${b.type}${b.i}`" :key="bindex" v-model="user_input[b.i]" v-bind="b.attrs" :style="b.style" @keyup.enter.native="onSubmit(b)" @click="current_index=b.i">{{ b.value }}
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
    focus_callback_set: null,
    current_index: 0
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
    onFocus(v) {
      const d = this.$refs[`${v.type}${this.current_index}`]
      const c = d && d[0]
      c && c.focus()
    },
    keyInput(v) {
      const { ctrlKey, altKey, key } = v
      console.log('key input', v, ctrlKey, altKey, key, this.data.id)
      if (!ctrlKey || !altKey) return
      if (key === 'ArrowRight') {
        return this.directSubmit({ is_right: false, is_manual: true })
      } else if (key === 'ArrowLeft') {
        return this.directSubmit({ is_right: true, is_manual: true })
      } else if (key === 'Enter') this.onSubmit({ type: 'el-input', i: this.current_index })
    },
    onSubmit(v) {
      this.current_index = v.i + 1
      if (v.i + 1 < this.user_input.length) {
        return this.onFocus(v)
      }
      return this.judgeSubmit(this.user_input)
    },
    judgeSubmit(result) {
      const answer = this.data.answer
      const is_right = !answer.find((i, index) => {
        return i !== result[index]
      })
      return this.directSubmit({ is_right, answer: result })
    },
    directSubmit ({ is_right, is_manual, answer }) {
      return this.$emit('onUserSubmit', { is_right, is_manual, answer })
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
