<template>
  <div v-if="show" key="tip" class="slide-fade-item" style="text-align:center">
    <el-button type="text" @click="updatedb({ is_manual: true })">已完成本轮练习，再来一轮吧~</el-button>
    <div>
      <el-button
        type="text"
        :disabled="!Object.keys(wrong_current).length"
        @click="updatedb({ dict: wrong_current, is_manual: true })"
      >复习本轮错题
      </el-button>
      <el-button
        type="text"
        :disabled="!Object.keys(wrong_history).length"
        @click="updatedb({ dict: wrong_history, is_manual: true })"
      >再刷历史错题
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompletionTip',
  data: () => ({
    inited: false,
    status: {
      total: 0,
      solved: 0,
      wrong: 0
    },
    wrong_history: {},
    wrong_current: {}
  }),
  computed: {
    show () {
      const { inited, status } = this
      return inited && status.total <= status.solved
    },
    current_problems () {
      return this.$store.state.problems.current_problems
    },
    options () {
      return this.$store.state.problems.current_options
    },
  },
  watch: {
    status: {
      handler (v) {
        this.$emit('onStatus', v)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    updatedb ({ db, is_manual = true }) {
      this.$emit('requireResetProblem', { is_manual, db })
    },
    init_status ({ prblems, duplicated }) {
      const status = {
        total: prblems.length,
        solved: 0,
        wrong: 0,
        duplicated
      }
      this.status = status
    },
    init_wrong_set (d) {
      this.inited = true
      this.wrong_current = {}
      const dict = {}
      const { current_problems } = this
      d.map(i => {
        const item = current_problems[i.id]
        if (item && item.wrong) dict[i.id] = item.combo_kill
      })
      this.wrong_history = dict
    },
    update_status ({ problem, is_right }) {
      const { status } = this
      status.solved++
      if (!is_right) {
        status.wrong++
        this.wrong_current[problem.id] = true
      }
    }
  }
}
</script>
