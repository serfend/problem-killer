<template>
  <el-card
    :style="{ 'box-shadow': iFocus ? '0 2px 12px 0 #0ff7f0' : null }"
    class="base-card"
    @mouseenter.native="onMouseEnter"
    @mouseleave.native="onMouseLeave"
  >
    <template #header>
      <ProblemHeader ref="header" :show-answer.sync="showAnswer" v-bind="$props" @onAnswer="onAnswer" />
    </template>
    <div ref="content" class="content-container">
      <slot v-if="reset_index" v-bind="$props" name="content" />
    </div>
    <ProblemAnalysis
      :show-answer.sync="showAnswer"
      v-bind="$props"
      :user-answer="user_answer"
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
    user_answer: null,
    userAnswerResult: null,
    userAnswerConfirmResult: false,
    lastEnter: 0,
    time_spent: 0,
    mouse_active: false,
    reset_index: true
  }),
  computed: {
    options () {
      return this.$store.state.problems.current_options
    },
    lighting_mode () {
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
        this.$emit('update:completed', val ? new Date() : null)
      }
    }
  },
  methods: {
    reset () {
      this.showAnswer = false
      this.userAnswerResult = null
      this.userAnswerConfirmResult = false
      this.reset_index = false
      this.$nextTick(() => { this.reset_index = true })
      const c = this.$refs.header
      c && c.reset()
    },
    onSubmit ({ is_right, is_manual, answer }) {
      const c = this.$refs.header
      c && c.practice_submit({ is_right, is_manual, answer })
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
    onAnswer ({ is_right, is_manual, answer }) {
      this.userAnswerResult = is_right
      this.user_answer = answer
      // 当做对了 且 开启了急速过题 且是正常提交答案，则直接跳过该题显示答案
      if (is_right && this.lighting_mode && !is_manual) return this.onAnswerResult({ is_right, is_manual })
      if (!is_right) this.update_problem({ is_right: false, is_manual })
    },
    onAnswerResult ({ is_right, is_manual, answer }) {
      console.log('onAnswerResult', is_right, is_manual, answer)
      this.userAnswerConfirmResult = true
      if (this.userAnswerResult === false) return
      this.showAnswer = false
      console.log('update_problem', is_right, is_manual, answer)
      this.update_problem({ is_right, is_manual, answer })
    },
    update_problem ({ is_right, is_manual, answer }) {
      const database = this.current_database.name
      const { data, time_spent } = this
      api.user_problem_result({ database }).then(v => {
        const problem_id = data.id || data.content
        const val = statistics_problem(v[problem_id], is_right, time_spent)
        this.$emit('onSubmit', { is_right, is_manual, answer })
        console.log('update problem', problem_id, val)
        api.user_problem_result({ database, problem_id, val })
      })
    }
  }
}
</script>
