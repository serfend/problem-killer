<template>
  <el-card :style="{'box-shadow':iFocus?'0 2px 12px 0 #0ff7f0':null}" class="base-card" @mouseenter.native="onMouseEnter" @mouseleave.native="onMouseLeave">
    <template #header>
      <ProblemHeader ref="header" :show-answer.sync="showAnswer" v-bind="$props" @onAnswer="onAnswer" />
    </template>
    <div ref="content" class="content-container">
      <slot name="content" v-bind="$props" />
    </div>
    <ProblemAnalysis
      :show-answer.sync="showAnswer"
      v-bind="$props"
      :user-answer-result="userAnswerResult"
      :user-answer-confirm-result="userAnswerConfirmResult"
      @onAnswerResult="onAnswerResult"
    />
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
    focus: { type: Boolean, default: false },
    index: { type: Number, default: null }
  },
  data: () => ({
    showAnswer: false,
    userAnswerResult: null,
    userAnswerConfirmResult: false,
    lastEnter: 0,
    time_spent: 0,
    mouse_active: false
  }),
  computed: {
    options () {
      return this.$store.state.problems.current_options
    },
    lighting_mode() {
      return this.options && this.options.lighting_mode
    },
    current_database () {
      return this.$store.state.problems.current_database
    },
    iFocus () {
      return this.focus || this.mouse_active
    }
  },
  watch: {
    userAnswerConfirmResult: {
      handler (val) {
        this.$emit('update:completed', val)
      }
    }
  },
  methods: {
    reset () {
      this.showAnswer = false
      this.userAnswerResult = null
      this.userAnswerConfirmResult = false
      const c = this.$refs.header
      c && c.reset()
    },
    onSubmit (is_right) {
      const c = this.$refs.header
      c && c.practice_submit(is_right)
    },
    onMouseEnter () {
      this.lastEnter = new Date()
      this.mouse_active = true
    },
    onMouseLeave () {
      this.mouse_active = false
      this.recordSpendTime()
    },
    recordSpendTime () {
      const { lastEnter } = this
      const d = new Date() - lastEnter
      this.time_spent += d
    },
    onAnswer (is_right) {
      this.userAnswerResult = is_right
      if (this.lighting_mode) return this.onAnswerResult(is_right)
      if (!is_right) this.update_problem(false)
    },
    onAnswerResult (is_right) {
      this.userAnswerConfirmResult = true
      if (this.userAnswerResult === false) return
      this.showAnswer = false
      this.update_problem(is_right)
    },
    update_problem (is_right) {
      const database = this.current_database.name
      const { data, time_spent } = this
      api.user_problem_result({ database }).then(v => {
        const problem_id = data.id || data.content
        const val = statistics_problem(v[problem_id], is_right, time_spent)
        this.$emit('onSubmit', is_right)
        console.log('update problem', problem_id, val)
        api.user_problem_result({ database, problem_id, val })
      })
    }
  }
}
</script>
