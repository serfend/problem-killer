<template>
  <el-card style="transition:all ease 0.5s">
    <template #header>
      <span>{{ index+1 }}.</span>
      <span v-if="data">
        <span v-if="data.score">{{ data.score }}分</span>
        <ProblemType :data="data.type" />
        <el-button v-show="!showAnswer" type="text" @click="requireShowAnswer">查看解析</el-button>
      </span>
    </template>
    <div class="content-container">
      <span>
        <span>
          <component :is="b.type" v-for="(b,bindex) in blanking" :key="bindex" v-model="user_input[b.i]" v-bind="b.attrs" :style="b.style">{{ b.value }}
          </component>
        </span>
      </span>
    </div>
    <ProblemAnalysis :data="data" :show-answer.sync="showAnswer" />
  </el-card>
</template>

<script>
import { build_input, build_span } from '../loader'
export default {
  label: '填空',
  name: 'ProblemBlanking',
  components: {
    ProblemType: () => import('../ProblemType'),
    ProblemAnalysis: () => import('../ProblemAnalysis')
  },
  props: {
    data: { type: Object, default: null },
    index: { type: Number, default: null }
  },
  data: () => ({
    blanking: null,
    user_input: [],
    showAnswer: false
  }),
  watch: {
    data: {
      handler (val) {
        this.refresh(val)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    requireShowAnswer () {
      this.showAnswer = true
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
