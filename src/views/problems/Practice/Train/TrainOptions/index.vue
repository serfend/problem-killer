<template>
  <el-card v-loading="loading">
    <el-form v-if="options" label-width="5rem" inline>
      <el-form-item label="刷题模式">
        <el-tooltip content="刷题模式将无需填入答案，直接选会或不会即可，更高效">
          <el-switch v-model="options.practice_mode" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="斩杀模式">
        <el-tooltip content="每做完一题，该题将被隐藏">
          <el-switch v-model="options.kill_problem" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="本轮错题">
        <el-tooltip content="查看本次练习中出现的错题">
          <el-switch v-model="options.show_only_error_current" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="历史错题">
        <el-tooltip content="查看最近练习中出现的错题">
          <el-switch v-model="options.show_only_error_history" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="随机题序">
        <el-tooltip content="将题目的顺序打乱">
          <el-switch v-model="options.shuffle_problem" />
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div style="display:flex;align-items: center;">
      <div style="width:100%">
        <el-slider v-model="options.problem_range" range show-stops :max="(problems && problems.length)||0" :min="0" />
        <el-tooltip content="本次训练的题目范围">
          <div>
            <span>从</span>
            <el-input-number v-model="options.problem_range[0]" size="mini" :max="options.problem_range[1]" style="width:40%" />
            <span>到</span>
            <el-input-number v-model="options.problem_range[1]" size="mini" :min="options.problem_range[0]" style="width:40%" />
          </div>
        </el-tooltip>
      </div>
    </div>
  </el-card>
</template>

<script>
const train_options = 'train_options'
import api from '@/api/problems'
export default {
  name: 'TrainOptions',
  model: {
    event: 'change',
    prop: 'data'
  },
  props: {
    database: { type: String, default: null },
    problems: { type: Array, default: null }
  },
  data: () => ({
    loading: false,
    options: {
      practice_mode: true,
      kill_problem: true,
      show_only_error_current: false,
      show_only_error_history: false,
      problem_range: [0, 10],
      shuffle_problem: false
    }
  }),
  computed: {
  },
  watch: {
    database: {
      handler (v) {
        this.refresh()
      },
      immediate: true
    },
    options: {
      handler (val) {
        const name = this.database
        api.user_database_detail({ name, key: train_options, val }).then(data => {
          if (val) { this.$store.dispatch('problems/update_database') }
          this.$emit('change', val)
        })
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    refresh () {
      const name = this.database
      if (!name) return
      this.loading = true
      api.user_database_detail({ name }).then(data => {
        const r = (data && data[train_options]) || {}
        console.log('user_database_detail', r)
        this.options = Object.assign(this.options, r)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style>
</style>
