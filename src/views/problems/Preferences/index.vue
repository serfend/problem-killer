<template>
  <div style="margin:0.2rem;display: flex;justify-content: center;">
    <el-form label-width="5rem">
      <el-collapse v-model="current_focus" accordion>
        <el-collapse-item v-for="(target,index) in to_config" :key="target.name" :title="target.alias" :name="index">
          <el-card>
            <template #header>
              <h4>{{ target.alias }}</h4>
            </template>
            <div v-if="target.items">
              <el-form-item
                v-for="operation in target.items.map(i => operations[i])"
                :key="operation.name"
                :label="operation.alias"
              >
                <el-radio-group v-model="options.practice[target.name][operation.name]">
                  <el-radio-button v-for="i in operation_dict[operation.name]" :key="i.name" :label="i.name">{{ i.alias }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
            <div v-else>无设置项</div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
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
const btn_show = [
  { name: true, alias: '显示' },
  { name: false, alias: '不显示' },
]
const to_config = [
  { name: 'btn_submit', alias: '提交按钮', items: ['btn_sizes', 'btn_types'] },
  { name: 'btn_select_all', alias: '全选并提交按钮', items: ['btn_show'] },
]
const operations = [
  { name: 'btn_show', alias: '是否显示' },
  { name: 'btn_sizes', alias: '大小' },
  { name: 'btn_types', alias: '样式' },
]
import { user_preferences } from '@/api/problems/preferences'
export default {
  name: 'Preferences',
  data: () => ({
    loading: false,
    current_focus: 0,
    options: {
      practice: {
        btn_submit: {
          btn_sizes: 'mini',
          btn_types: 'text'
        },
        btn_select_all: {
          btn_show: false
        }
      }
    },
    to_config,
    operation_dict: {
      btn_sizes,
      btn_types,
      btn_show
    },
    operations: operations.reduce((prev, cur) => (((prev[cur.name] = cur) && false) || prev), {})
  }),
  watch: {
    options: {
      handler (val) {
        if (!val) return
        user_preferences({ val }).then(() => {
          this.$store.dispatch('problems/update_preferences')
        })
      },
      deep: true
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.loading = true
      user_preferences({}).then(data => {
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
