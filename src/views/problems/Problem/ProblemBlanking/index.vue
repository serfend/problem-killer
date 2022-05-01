<template>
  <span>
    <component :is="b.type" v-for="(b,bindex) in blanking" :ref="`${b.type}${b.i}`" :key="bindex" v-model="user_input[b.i]" v-bind="b.attrs" :style="b.style" @keyup.enter.native="onSubmit(b)">{{ b.value }}
    </component>
  </span>
</template>

<script>
import { build_input, build_span } from '../loader'
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
  }),
  watch: {
    data: {
      handler (val) {
        this.refresh(val)
      },
      immediate: true,
      deep: true
    },
    focus: {
      handler(val) {
        if (val)document.addEventListener('keyup', this.keyInput)
        else document.removeEventListener('keyup', this.keyInput)
      }
    }
  },
  methods: {
    keyInput(v) {
      const { ctrlKey, altKey, key } = v
      console.log('key input', ctrlKey, altKey, key, this.data.id)
      if (!ctrlKey || !altKey) return
      if (key === 'Enter') this.onSubmit({ type: 'el-input', i: -1 })
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
      this.$emit('onUserSubmit', is_right)
    },
    refresh (v) {
      if (!v) {
        this.blanking = null
        return
      }
      const { content } = v
      const c = (content && `${content}。`) || null
      const b = c && c.split('{{ANS}}') || []
      if (!b.length) {
        this.blanking = null
        return
      }
      const r = []
      this.user_input = new Array(b.length - 1)
      b.map((v, index) => {
        r.push(build_span(index, v))
        r.push(build_input(index, v))
      })
      r.pop()
      this.blanking = r
    }
  }
}
</script>
<style lang="scss" scoped>
.content-container {
  display: flex;
}
</style>
