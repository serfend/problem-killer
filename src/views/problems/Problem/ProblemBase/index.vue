<template>
  <el-card style="transition:all ease 0.5s">
    <template #header>
      <ProblemHeader :show-answer.sync="showAnswer" v-bind="$props" />
    </template>
    <div class="content-container">
      <slot />
    </div>
    <ProblemAnalysis :show-answer.sync="showAnswer" v-bind="$props" />
  </el-card>
</template>

<script>
export default {
  name: 'ProblemBase',
  components: {
    ProblemAnalysis: () => import('../ProblemAnalysis'),
    ProblemHeader: () => import('../ProblemBase/ProblemHeader'),
  },
  props: {
    data: { type: Object, default: null },
    index: { type: Number, default: null },
    options: { type: Object, default: null }
  },
  data: () => ({
    showAnswer: false
  })
}
</script>
