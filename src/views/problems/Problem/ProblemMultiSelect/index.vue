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
        <el-checkbox v-for="(opt,oindex) in options" :key="oindex" :label="oindex+1">{{ `${String.fromCharCode(65+oindex)}.${opt}` }}</el-checkbox>
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
    index: { type: Number, default: null }
  },
  data: () => ({
    blanking: null,
    user_input: [],
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
        .filter(i => i > 0)
        .sort((a, b) => a - b)
      return this.judgeSubmit(v)
    },
    judgeSubmit (result) {
      let answer = this.data.answer
      if (!answer) return this.$message.warn('本题无答案')
      answer = answer.sort((a, b) => a - b)
      const is_right = !answer.find((i, index) => {
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
