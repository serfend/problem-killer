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
      <el-radio-group v-model="user_input">
        <el-radio v-for="(opt,oindex) in options" :key="oindex" :label="oindex+1">{{ `${String.fromCharCode(65+oindex)}.${opt}` }}</el-radio>
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
    index: { type: Number, default: null }
  },
  data: () => ({
    blanking: null,
    user_input: 0,
    options: []
  }),
  watch: {
    'data.id': {
      handler (val) {
        this.refresh()
      },
      immediate: true
    }
  },
  methods: {
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
