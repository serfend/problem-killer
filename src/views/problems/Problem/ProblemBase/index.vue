<template>
  <el-card style="transition:all ease 0.5s">
    <template #header>
      <ProblemHeader :show-answer.sync="showAnswer" v-bind="$props" @onAnswer="onAnswer" />
    </template>
    <div class="content-container">
      <slot />
    </div>
    <ProblemAnalysis :show-answer.sync="showAnswer" v-bind="$props" :user-answer-result="userAnswerResult" :user-answer-confirm-result="userAnswerConfirmResult" @onAnswerResult="onAnswerResult" />
  </el-card>
</template>

<script>
import { statistics_problem } from './statistics'
import api from '@/api/problems'
export default {
  name: 'ProblemBase',
  components: {
    ProblemAnalysis: () => import('../ProblemAnalysis'),
    ProblemHeader: () => import('../ProblemBase/ProblemHeader'),
  },
  props: {
    data: { type: Object, default: null },
    index: { type: Number, default: null }
  },
  data: () => ({
    showAnswer: false,
    userAnswerResult: null,
    userAnswerConfirmResult: false
  }),
  computed: {
    current_database() {
      return this.$store.state.problems.current_database
    }
  },
  watch: {
    userAnswerConfirmResult: {
      handler(val) {
        this.$emit('update:completed', val)
      }
    }
  },
  methods: {
    onAnswer(is_right) {
      this.userAnswerResult = is_right
      if (!is_right) this.update_problem(false)
    },
    onAnswerResult(is_right) {
      this.userAnswerConfirmResult = true
      if (this.userAnswerResult === false) return
      this.showAnswer = false
      this.update_problem(is_right)
    },
    update_problem(is_right) {
      const database = this.current_database.name
      const { data } = this
      api.user_problem_result({ database }).then(v => {
        const problem_id = data.id || data.content
        const val = statistics_problem(v[problem_id], is_right)
        this.$emit('onSubmit', is_right)
        api.user_problem_result({ database, problem_id, val })
      })
    }
  }
}
</script>
