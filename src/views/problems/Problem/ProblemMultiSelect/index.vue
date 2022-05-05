<template>
  <span>
    <component
      :is="b.type"
      v-for="(b,bindex) in blanking"
      :ref="`${b.type}${b.i}`"
      :key="bindex"
      v-model="user_input[b.i]"
      v-bind="b.attrs"
      :style="b.style"
      @keyup.enter.native="onSubmit(b)"
    >{{ b.value }}
    </component>
    <div class="p-ms">
      <el-checkbox-group v-model="user_input">
        <el-checkbox v-for="(opt,oindex) in options" :key="oindex" :label="oindex+1" class="opt-single">{{ `${String.fromCharCode(65+oindex)}.${opt}` }}
        </el-checkbox>
      </el-checkbox-group>
      <el-button type="text" class="pb" @click="onSubmit">提交</el-button>
    </div>
  </span>
</template>

<script>
import { build_span } from '../loader'
export default {
  label: '多项选择',
  name: 'ProblemMultiSelect',
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
    options: [],
    focus_callback_set: null
  }),
  watch: {
    'data.id': {
      handler (val) {
        this.refresh()
      },
      immediate: true
    },
    // TODO 实现通过父级的slot.ref统一管理
    focus: {
      handler (val) {
        if (val && !this.focus_callback_set) {
          console.log('callback is set to', this.index)
          document.addEventListener('keyup', this.keyInput)
          this.focus_callback_set = true
          return
        } else if (!val && this.focus_callback_set) {
          console.log('callback remove from', this.index)
          document.removeEventListener('keyup', this.keyInput)
          this.focus_callback_set = false
          return
        }
      },
      immediate: true
    }
  },
  methods: {
    keyInput (v) {
      const { ctrlKey, altKey, key } = v
      console.log('key input', ctrlKey, altKey, key, this.data.id)
      if (!ctrlKey || !altKey) return
      if (key === 'Enter') return this.onSubmit()
      const value = parseInt(key)
      if (!value) return
      const index = this.user_input.findIndex(i => i === value)
      if (index > -1) {
        this.user_input.splice(index, 1)
        return
      }
      if (this.options.length > value) { this.user_input.push(value) }
    },
    onSubmit () {
      const v = this.user_input
        .filter(i => i > 0)
        .sort((a, b) => a - b)
      return this.judgeSubmit(v)
    },
    judgeSubmit (result) {
      let answer = this.data.answer
      if (!answer) return this.$message.warn('本题无答案')
      answer = answer.sort((a, b) => a - b)
      const is_right = answer.length === result.length && !answer.find((i, index) => {
        return i !== result[index]
      })
      this.$emit('onUserSubmit', is_right)
    },
    refresh () {
      const { data } = this
      const { content, options } = data
      this.user_input = options.map(i => -1)
      this.options = options
      const c = (content && `${content}。`) || null
      const r = []
      r.push(build_span(0, c))
      this.blanking = r
    },
    set_focus () {
      console.log('focus single')
    }
  }
}
</script>
<style>
.opt-single {
  white-space: normal;
  display: block;
}
</style>
<style lang="scss" scoped>
.content-container {
  display: flex;
}
.p-ms {
  display: flex;
  align-items: center;
}
.pb {
  margin-left: 1rem;
}
</style>
