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
      <el-form-item label="随机题序">
        <el-tooltip content="将题目的顺序打乱">
          <el-switch v-model="options.shuffle_problem" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="做新题">
        <el-tooltip content="只做没做过的题">
          <el-switch v-model="options.new_problem" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="急速过题">
        <el-tooltip content="题做对了就不显示题解，直接下一题">
          <el-switch v-model="options.lighting_mode" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="筛选连对">
        <el-tooltip content="只做连对次数少于该次数的题">
          <el-input-number v-model="options.combo_problem" />
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div style="display:flex;align-items: center;">
      <el-card style="width:100%">
        <template #header>
          <h3>题库范围选取(共{{ (problems && problems.length) || 0 }}题)</h3>
        </template>
        <el-tooltip content="本次训练的题目范围">
          <div>
            <div>
              <span>从</span>
              <el-input-number
                v-model="options.problem_range_start"
                size="mini"
                :min="1"
                :max="options.problem_range_end"
                style="width:40%"
              />
              <span>到</span>
              <el-input-number
                v-model="options.problem_range_end"
                size="mini"
                :min="options.problem_range_start"
                style="width:40%"
              />
            </div>
            <div>
              <span>共选中题数(0表示全选)</span>
              <el-input-number
                v-model="options.problem_max_num"
                size="mini"
                :max="options.problem_range_end - options.problem_range_start"
                style="width:40%"
              />
            </div>
          </div>

        </el-tooltip>
        <el-tooltip content="页面上只显示有限题（当前题目向前和向后X个题）以降低性能消耗">
          <div>
            <span>显示题数量</span>
            <el-input-number v-model="options.show_max_problem_range" size="mini" />
          </div>
        </el-tooltip>

      </el-card>
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
      problem_range_start: 0,
      problem_range_end: 0,
      problem_max_num: 0,
      new_problem: false,
      lighting_mode: false,
      shuffle_problem: false,
      combo_problem: 3,
      show_max_problem_range: 3
    }
  }),
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

