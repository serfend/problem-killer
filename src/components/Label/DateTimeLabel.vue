<template>
  <el-tooltip effect="light" :content="parseTime(label)">
    <span>{{ formatTime(label) }}</span>
  </el-tooltip>
</template>

<script>
import { formatTime, parseTime } from '@/utils'
export default {
  name: 'DateTimeLabel',
  props: {
    label: {
      type: [Date, String],
      default: null
    }
  },
  methods: { formatTime, parseTime }
}
</script>
