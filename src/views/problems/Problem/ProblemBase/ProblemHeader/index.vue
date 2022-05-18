<template>
  <span>
    <span>{{ index + 1 }}.</span>
    <span v-if="data">
      <span class="global-index">[{{ data.index + 1 }}]</span>
      <span v-if="data.score">{{ data.score }}分</span>
      <ProblemType :data="data.type" />
      <span v-if="options.practice_mode && !beenSolved">
        <el-button size="mini" type="success" @click="practice_submit({ is_right: true, is_manual: true })">会做</el-button>
        <el-button size="mini" type="info" @click="practice_submit({ is_right: false, is_manual: true })">不会做</el-button>
      </span>
      <el-button v-else-if="beenSolved" type="text" @click="reset">重做</el-button>
      <el-button v-show="!showAnswer" type="text" @click="requireShowAnswer()">查看解析</el-button>
      <span v-if="showAnswer && combo_kill_desc" class="problem-info">{{ combo_kill_desc }}</span>
    </span>
  </span>
</template>

<script>
export default {
  name: 'ProblemHeader',
  components: {
    ProblemType: () => import('../../ProblemType'),
  },
  props: {
    data: { type: Object, default: null },
    index: { type: Number, default: null },
    showAnswer: { type: Boolean, default: false }
  },
  data: () => ({
    beenSolved: false
  }),
  computed: {
    combo_kill_desc () {
      const { data, current_problems } = this
      const d = current_problems[data.id]
      if (!d) return '暂无记录'
      const { combo_kill } = d
      return `连对${combo_kill || 0}次`
    },
    current_problems () {
      return this.$store.state.problems.current_problems
    },
    options () {
      return this.$store.state.problems.current_options
    },
  },
  methods: {
    reset () {
      this.beenSolved = false
      this.requireShowAnswer(false)
    },
    requireShowAnswer (show = true) {
      this.$emit('update:showAnswer', show)
    },
    practice_submit ({ is_right, is_manual }) {
      if (this.beenSolved) {
        this.$message.warning('已提交过答案啦')
        return
      }
      if (!is_right) this.$message.error((is_manual ? '不会做' : '做错了') + '，仔细看看哦~')
      else this.$message.success(is_manual ? '我会做！' : '做对啦~')
      this.requireShowAnswer()
      this.beenSolved = true
      this.$emit('onAnswer', { is_right, is_manual })
    }
  }
}
</script>

<style lang="scss" scoped>
%description {
  color: #ccc;
  font-size: 0.9rem;
}

.problem-info {
  @extend %description;
}

.global-index {
  @extend %description;
}
</style>
