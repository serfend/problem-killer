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
      <el-checkbox-group v-model="user_input" size="mini">
        <el-checkbox v-for="(opt,oindex) in filtered_options" :key="oindex" :disabled="oindex<options.length && is_select_all" :label="oindex+1" class="opt-single">{{ `${String.fromCharCode(65+oindex)}.${opt}` }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <el-button :type="btn_submit.btn_types||'text'" :size="btn_submit.btn_sizes||'mini'" class="pb" @click="onSubmit">提交</el-button>
    <el-button
      v-if="btn_select_all.btn_show || false"
      :type="btn_select_all.btn_types || 'text'"
      :size="btn_select_all.btn_sizes || 'mini'"
      class="pb"
      @click="onSubmitAll"
    >全选并提交</el-button>
  </span>
</template>

<script>
import { build_content } from '../loader'
export default {
  label: '多项选择',
  name: 'ProblemMultiSelect',
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
    user_input: [],
    options: [],
    focus_callback_set: null
  }),
  computed: {
    btn_submit() {
      return (this.preferences && this.preferences.btn_submit) || {}
    },
    btn_select_all () {
      return (this.preferences && this.preferences.btn_select_all) || {}
    },
    user_options () {
      return this.$store.state.problems.current_options
    },
    enable_select_all() {
      return this.user_options && this.user_options.enable_select_all
    },
    filtered_options() {
      const { options, enable_select_all } = this
      if (!options) return []
      return enable_select_all ? options.concat(['全选']) : options
    },
    is_select_all() {
      const { enable_select_all, user_input, options } = this
      return (enable_select_all && user_input[user_input.length - 1] > options.length)
    }
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
    keyInput (v) {
      const { ctrlKey, altKey, key } = v
      console.log('key input', ctrlKey, altKey, key, this.data.id)
      if (!ctrlKey || !altKey) return
      if (key === 'ArrowRight') {
        return this.directSubmit({ is_right: false, is_manual: true })
      } else if (key === 'ArrowLeft') {
        return this.directSubmit({ is_right: true, is_manual: true })
      } else if (key === 'Enter') return this.onSubmit()
      const value = parseInt(key)
      if (!value) return
      const index = this.user_input.findIndex(i => i === value)
      if (index > -1) {
        this.user_input.splice(index, 1)
        return
      }
      if (this.filtered_options.length >= value) { this.user_input.push(value) }
    },
    onSubmit () {
      const { user_input, options } = this
      const result = this.is_select_all ? options.map((i, index) => index) : user_input
      const v = result
        .filter(i => i > 0)
        .sort((a, b) => a - b)
      return this.judgeSubmit(v)
    },
    onSubmitAll() {
      this.is_select_all = true
      return this.onSubmit()
    },
    judgeSubmit (result) {
      let answer = this.data.answer
      if (!answer) return this.$message.warning('本题无答案')
      answer = answer.sort((a, b) => a - b)
      const is_right = answer.length === result.length && !answer.find((i, index) => {
        return i !== result[index]
      })
      return this.directSubmit({ is_right })
    },
    directSubmit({ is_right, is_manual }) {
      return this.$emit('onUserSubmit', { is_right, is_manual })
    },
    refresh (v) {
      const { data } = this
      if (!data) return
      const { options, content } = data
      if (!content) return
      this.options = options
      this.user_input = []
      const r = build_content(content)
      this.blanking = r.items
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
  user-select: auto;
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
</style>
