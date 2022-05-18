<template>
  <transition name="el-fade-in-linear">
    <div v-if="showAnswer">
      <el-divider />
      <el-button type="text" icon="el-icon-hide" class="analysis-btn-hide" @click="$emit('update:showAnswer', false)">
        隐藏解析</el-button>
      <el-row>
        <el-col :span="16">
          <el-form label-width="5rem">
            <el-form-item label="答案">
              <div>
                <span>{{ answer }}</span>
                <span class="answer-user">
                  <span class="answer-user-label">您的答案</span>
                  <span>{{ user_answer }}</span>
                </span>
              </div>
            </el-form-item>
            <el-form-item label="解析">
              <div>{{ data.analysis || '无' }}</div>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form v-if="status" label-width="5rem">
            <el-form-item label="总刷题数">
              <div>{{ status.total }}</div>
            </el-form-item>
            <el-form-item label="平均用时">
              <div>{{ Math.ceil(status.total_time / status.total) / 1000 }}秒</div>
            </el-form-item>
            <el-form-item label="上次出错">
              <div>{{ parseTime(status.last_wrong) }}</div>
            </el-form-item>
            <el-form-item label="错误数">
              <div>{{ status.wrong }}</div>
            </el-form-item>
          </el-form>
          <div v-else>暂无统计</div>
        </el-col>
      </el-row>
      <div v-if="userAnswerResult !== null && !userAnswerConfirmResult" class="btn-group">
        <el-button
          ref="btn_confirm"
          type="success"
          class="btn-primary"
          @click="$emit('onAnswerResult', { is_right: true, is_manual: true })"
        >确认会做</el-button>
        <el-button type="danger" class="btn-primary" @click="$emit('onAnswerResult', { is_right: false, is_manual: true })">
          确认不会做</el-button>
      </div>
    </div>
  </transition>
</template>

<script>
import { parseTime } from '@/utils'
import { tNum, tBool, tStr, tCheck } from '@/utils/type'
export default {
  name: 'ProblemAnalysis',
  props: {
    data: { type: Object, default: null },
    showAnswer: { type: Boolean, default: false },
    options: { type: Object, default: null },
    userAnswer: { type: [Object, Array, Boolean, String], default: null },
    userAnswerResult: { type: Boolean, default: null },
    userAnswerConfirmResult: { type: Boolean, default: false }
  },
  computed: {
    status () {
      const { data, current_problems } = this
      const d = current_problems[data.id]
      return d
    },
    current_problems () {
      return this.$store.state.problems.current_problems
    },
    answer () {
      if (!this.data) return null
      const r = this.data.answer
      return this.convert_answer_from_raw(r)
    },
    user_answer() {
      const r = this.userAnswer
      return this.convert_answer_from_raw(r)
    }
  },
  watch: {
    userAnswerResult: {
      handler (val) {
        setTimeout(() => {
          const e = this.$refs.btn_confirm
          e && e.$el.focus()
        }, 2e2)
      }
    }
  },
  methods: {
    parseTime,
    convert_answer_from_raw(r) {
      if (!r) return '无答案'
      if (r.length) return r.map(this.convert_answer)
      return this.convert_answer(r)
    },
    convert_answer (v) {
      const t = tCheck(v)
      if (t === tNum) return String.fromCharCode('A'.charCodeAt(0) + v - 1)
      if (t === tBool) return v ? '√' : '×'
      if (t === tStr) return v
      return v
    },
  }
}
</script>
<style lang="scss" scoped>
.analysis-btn-hide {
  width: 100%;
}

.btn-group {
  display: flex;
  justify-content: space-between;

  .btn-primary {
    width: 45%;
  }
}

.answer-user {
  margin-left: 0.5rem;

  .answer-user-label {
    color: #0300a6;
  }
}
</style>
