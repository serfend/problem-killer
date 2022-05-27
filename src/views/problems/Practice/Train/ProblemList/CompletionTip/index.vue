<template>
  <div v-if="show" key="tip" class="slide-fade-item" style="text-align:center">
    <el-button type="text" @click="updatedb({ is_manual: true })">已完成本轮练习，再来一轮吧~</el-button>
    <div>
      <el-button
        v-for="i in actions"
        :key="i.alias"
        type="text"
        :disabled="!Object.keys(action_record[i.target]).length"
        @click="updatedb({ dict: action_record[i.target], is_manual: true })"
      >{{ i.alias }}({{ Object.keys(action_record[i.target]).length }}道)
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
    global_status: {
      global_solved: 0,
      global_wrong: 0
    },
    action_record: {
      wrong_history: {},
      wrong_current: {},
    },
    actions: [
      { alias: '复习本轮错题', target: 'wrong_current' },
      { alias: '复习历史错题', target: 'wrong_history' },
    ]
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
        v = Object.assign({}, v)
        this.$emit('onStatus', Object.assign(v, this.global_status))
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    updatedb ({ dict, is_manual = true }) {
      this.$emit('requireResetProblem', { is_manual, dict })
    },
    init_status ({ problems, duplicated }) {
      const status = {
        total: problems.length,
        solved: 0,
        wrong: 0,
        duplicated
      }
      this.status = status
    },
    init_wrong_set (d) {
      this.inited = true
      this.action_record.wrong_current = {}
      const dict = {}
      const { current_problems } = this
      d.map(i => {
        const item = current_problems[i.id]
        if (item && item.wrong) dict[i.id] = item.combo_kill
      })
      this.action_record.wrong_history = dict
    },
    update_status ({ problem, is_right }) {
      const { status } = this
      this.global_status.global_solved++
      status.solved++
      if (!is_right) {
        this.global_status.global_wrong++
        status.wrong++
        this.action_record.wrong_current[problem.id] = true
      }
    }
  }
}
</script>
