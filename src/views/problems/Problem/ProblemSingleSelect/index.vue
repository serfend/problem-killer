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
      <el-radio-group v-model="user_input" @keyup.native.enter="onSubmit">
        <el-radio v-for="(opt,oindex) in options" :key="oindex" :label="oindex+1" class="opt-single">{{ `${String.fromCharCode(65+oindex)}.${opt}` }}</el-radio>
      </el-radio-group>
      <el-button type="text" class="pb" @click="onSubmit">提交</el-button>
    </div>
  </span>
</template>

<script>
import { build_span } from '../loader'
export default {
  label: '单项选择',
  name: 'ProblemSingleSelect',
  components: {

  },
  props: {
    data: { type: Object, default: null },
    focus: { type: Boolean, default: false },
    index: { type: Number, default: null }
  },
  data: () => ({
    blanking: null,
    user_input: 0,
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
          this.setKeyHandler(true)
          return
        } else if (!val && this.focus_callback_set) {
          this.setKeyHandler(false)
          return
        }
      },
      immediate: true
    }
  },
  destroyed() {
    this.setKeyHandler(false)
  },
  methods: {
    setKeyHandler(is_set) {
      if (is_set) {
        console.log('callback is set to', this.index)
        document.addEventListener('keyup', this.keyInput)
        this.focus_callback_set = true
        return
      }
      console.log('callback remove from', this.index)
      document.removeEventListener('keyup', this.keyInput)
      this.focus_callback_set = false
    },
    keyInput (v) {
      const { ctrlKey, altKey, key } = v
      console.log('key input', ctrlKey, altKey, key, this.data.id)
      if (!ctrlKey || !altKey) return
      if (key === 'Enter') return this.onSubmit()
      const value = parseInt(v.key)
      if (!value) return
      if (this.options.length < value) return
      this.user_input = value
    },
    onSubmit () {
      const v = this.user_input
      return this.judgeSubmit(v)
    },
    judgeSubmit (result) {
      const answer = this.data.answer
      if (!answer) return this.$message.warn('本题无答案')
      const is_right = Number(answer) === Number(result)
      this.$emit('onUserSubmit', is_right)
    },
    refresh () {
      const { data } = this
      const { content, options } = data
      this.user_input = 0
      this.options = options
      const c = (content && `${content}。`) || null
      const r = []
      r.push(build_span(0, c))
      this.blanking = r
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
