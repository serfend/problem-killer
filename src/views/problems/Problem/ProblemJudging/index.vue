<template>
  <span>
    <component
      :is="b.type"
      v-for="(b, bindex) in blanking"
      :ref="`${b.type}${b.i}`"
      :key="bindex"
      v-model="user_input[b.i]"
      v-bind="b.attrs"
      :style="b.style"
      @keyup.enter.native="onSubmit(b)"
    >{{ b.value }}
    </component>
    <div class="p-ms">
      <el-radio-group v-model="user_input" size="mini">
        <el-radio-button :label="1">正确</el-radio-button>
        <el-radio-button :label="2">错误</el-radio-button>
      </el-radio-group>
    </div>
    <el-button
      :type="btn_submit.btn_types || 'text'"
      :size="btn_submit.btn_sizes || 'mini'"
      class="pb"
      @click="onSubmit"
    >提交
    </el-button>
  </span>
</template>

<script>
import { build_content } from '../loader'
export default {
  label: '判断',
  name: 'ProblemJudge',
  components: {

  },
  props: {
    data: { type: Object, default: null },
    focus: { type: Boolean, default: false },
    index: { type: Number, default: null },
    preferences: { type: Object, default: null }
  },
  data: () => ({
    blanking: null,
    user_input: 0,
    options: [],
    focus_callback_set: null
  }),
  computed: {
    btn_submit () {
      return (this.preferences && this.preferences.btn_submit) || {}
    },
  },
  watch: {
    'data.id': {
      handler (val) {
        this.refresh(val)
      },
      immediate: true
    },
    // TODO 实现通过父级的slot.ref统一管理
    focus: {
      handler (val) {
        this.setKeyHandler(val)
      },
      immediate: true
    }
  },
  destroyed () {
    this.setKeyHandler(false)
  },
  methods: {
    setKeyHandler (is_set) {
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
    keyInput (v) {
      const { ctrlKey, altKey, key } = v
      console.log('key input', ctrlKey, altKey, key, this.data.id)
      if (!ctrlKey || !altKey) return
      if (key === 'Enter') return this.onSubmit()
      const value = parseInt(v.key)
      if (!value) return
      if (value > 2) return
      this.user_input = value
    },
    onSubmit () {
      const v = this.user_input
      return this.judgeSubmit(v)
    },
    handleClick () {
      console.log(1)
    },
    judgeSubmit (result) {
      const answer = this.data.answer ? 1 : 2
      if (!answer) return this.$message.warning('本题无答案')
      const is_right = Number(answer) === Number(result)
      this.$emit('onUserSubmit', is_right)
    },
    refresh (v) {
      const content = this.data && this.data.content
      if (!content) {
        this.blanking = null
        return
      }
      const r = build_content(content)
      this.user_input = 0
      this.blanking = r.items
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
