<template>
  <span>
    <span>{{ index+1 }}.</span>
    <span v-if="data">
      <span v-if="data.score">{{ data.score }}分</span>
      <ProblemType :data="data.type" />
      <span v-if="options.practice_mode&&!beenSolved">
        <el-button size="mini" type="success" @click="practice_submit(true)">会做</el-button>
        <el-button size="mini" type="info" @click="practice_submit(false)">不会做</el-button>
      </span>
      <el-button v-show="!showAnswer" type="text" @click="requireShowAnswer">查看解析</el-button>
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
    options() {
      return this.$store.state.problems.current_options
    },
  },
  methods: {
    requireShowAnswer() {
      this.$emit('update:showAnswer', true)
    },
    practice_submit(is_right) {
      this.requireShowAnswer()
      this.beenSolved = true
      this.$emit('onAnswer', is_right)
    }
  }
}
</script>

<style>

</style>
