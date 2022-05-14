<template>
  <div style="margin:0.2rem;display: flex;justify-content: center;">
    <el-form label-width="5rem">
      <el-card v-for="target in to_config" :key="target.name">
        <template #header>
          <h4>{{ target.alias }}</h4>
        </template>
        <el-form-item v-for="operation in operations" :key="operation.name" :label="operation.alias">
          <el-radio-group v-model="options.practice[target.name][operation.name]">
            <el-radio-button v-for="i in operation_dict[operation.name]" :key="i.name" :label="i.name">{{ i.alias }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script>

const btn_sizes = [
  { name: 'medium', alias: '大' },
  { name: 'small', alias: '中' },
  { name: 'mini', alias: '小' },
]
const btn_types = [
  { name: 'primary', alias: '主题色' },
  { name: 'success', alias: '安全色' },
  { name: 'warning', alias: '警告色' },
  { name: 'danger', alias: '危险色' },
  { name: 'info', alias: '一般色' },
  { name: 'text', alias: '链接' },
]
const to_config = [
  { name: 'btn_submit', alias: '提交按钮' },
]
const operations = [
  { name: 'btn_sizes', alias: '大小' },
  { name: 'btn_types', alias: '样式' },
]
import { user_preferences } from '@/api/problems/preferences'
export default {
  name: 'Preferences',
  data: () => ({
    loading: false,
    options: {
      practice: {
        btn_submit: {
          btn_sizes: 'mini',
          btn_types: 'text'
        }
      }
    },
    to_config,
    operation_dict: {
      btn_sizes,
      btn_types,
    },
    operations
  }),
  watch: {
    options: {
      handler(val) {
        if (!val) return
        user_preferences({ val })
      },
      deep: true
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.loading = true
      user_preferences({}).then(data => {
        debugger
        this.options = Object.assign(this.options, data)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
