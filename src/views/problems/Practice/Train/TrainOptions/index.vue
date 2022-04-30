<template>
  <div v-loading="loading">
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
    </el-form>
  </div>
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
    data: { type: Object, default: null }
  },
  data: () => ({
    loading: false,
    options: null
  }),
  watch: {
    database: {
      handler(v) {
        this.refresh()
      },
      immediate: true
    },
    options: {
      handler(val) {
        const name = this.database
        api.user_database_detail({ name, key: train_options, val }).then(data => {
          this.$emit('change', val)
        })
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    refresh() {
      const name = this.database
      if (!name) return
      this.loading = true
      api.user_database_detail({ name }).then(data => {
        this.options = (data && data[train_options]) || {}
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style>

</style>
