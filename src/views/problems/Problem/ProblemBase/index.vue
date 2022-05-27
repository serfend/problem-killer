<template>
  <el-card
    :style="{ 'box-shadow': styleBoxShadow }"
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
import { problemColorSet } from '../type_dispatch'
import api from '@/api/problems'
import { debounce } from '@/utils'
export default {
  name: 'ProblemBase',
  components: {
    ProblemAnalysis: () => import('../ProblemAnalysis'),
    ProblemHeader: () => import('../ProblemBase/ProblemHeader'),
  },
  props: {
    onlyRead: { type: Boolean, default: false },
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
    reset_index: true,
    is_right: null,
    styleBoxShadow: null
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
    requireUpdateBoxShadow() {
      return debounce(() => {
        this.update_box_shadow()
      }, 2e2)
    }
  },
  watch: {
    userAnswerConfirmResult: {
      handler (val) {
        this.$emit('update:completed', val ? new Date() : null)
      }
    },
    mouse_active() { this.requireUpdateBoxShadow() },
    focus() { this.requireUpdateBoxShadow() },
    is_right() { this.requireUpdateBoxShadow() },
  },
  methods: {
    update_box_shadow() {
      const get_color = () => {
        const { mouse_active, focus, is_right } = this
        if (is_right === null) {
          if (mouse_active) return `0 2px 12px 0 ${problemColorSet.mouse_focus}`
          if (focus) return `0 2px 12px 0 ${problemColorSet.focus}`
          return null
        }
        const t = '0 4px 12px 0 '
        const r = `${t}${is_right ? problemColorSet.answer_right : problemColorSet.answer_wrong}`
        console.log('change to ', r)
        return r
      }
      this.styleBoxShadow = get_color()
    },
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
      if (this.is_right === null || this.is_right) this.is_right = is_right
      const is_confirm_submit = !(this.userAnswerResult === null)
      this.userAnswerResult = is_right
      this.user_answer = answer
      // 当 是确认答案 或 (做对了 且 开启了急速过题 且是正常提交答案)，则直接跳过该题显示答案
      if (is_confirm_submit || (is_right && this.lighting_mode && !is_manual)) return this.onAnswerResult({ is_right, is_manual, answer })
    },
    onAnswerResult ({ is_right, is_manual, answer }) {
      if (this.is_right === null || this.is_right) this.is_right = is_right
      console.warn('onAnswerResult', is_right, is_manual, answer)
      this.userAnswerConfirmResult = true
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
