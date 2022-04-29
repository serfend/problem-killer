<template>
  <el-card class="mini-card">
    <span style="font-weight:600">{{ name }}:{{ parseTime(start) }}</span>
    <span>
      <span>
        <span v-if="length!==maxLength">当前为 {{ length }} 天 /</span>
        {{ maxLength }}天
      </span>
    </span>
    <el-slider
      v-model="length"
      show-stops
      :max="maxLength"
      :min="0"
      :format-tooltip="formatTooltip"
    />
  </el-card>
</template>

<script>
import { parseTime } from '@/utils'
export default {
  name: 'LawVacation',
  model: {
    prop: 'useLength',
    event: 'change'
  },
  props: {
    useLength: { type: Number, default: 0 },
    maxLength: { type: Number, default: 0 },
    name: { type: String, default: '无名称' },
    description: { type: String, default: null },
    start: { type: String, default: null }
  },
  data: () => ({
    lengthRange: null
  }),
  computed: {
    length: {
      get() {
        return this.useLength
      },
      set(val) {
        // 2 day in calendar should be 1 day in length
        this.$emit('change', val)
      }
    }
  },
  methods: {
    parseTime(val) {
      return parseTime(val, '{y}年{m}月{d}日')
    },
    formatTooltip(val) {
      return `${val}天`
      // const end = val * 86400000 + (new Date(this.start) - 0)
      // return this.parseTime(new Date(end))
    }
  }
}
</script>

<style lang="scss" >
.mini-card {
  .el-card__body {
    padding: 0.5rem !important;
  }
}
</style>
