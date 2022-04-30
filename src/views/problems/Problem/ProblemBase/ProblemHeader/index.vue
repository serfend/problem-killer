<template>
  <span>
    <span>{{ index+1 }}.</span>
    <span v-if="data">
      <span v-if="data.score">{{ data.score }}分</span>
      <ProblemType :data="data.type" />
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
    options: { type: Object, default: null },
    showAnswer: { type: Boolean, default: false }
  },
  methods: {
    requireShowAnswer() {
      this.$emit('update:showAnswer', true)
    }
  }
}
</script>

<style>

</style>
