<template>
  <el-card>
    <el-form label-width="5rem" inline>
      <el-form-item label="总题数">
        <span>{{ d.length }}</span>
      </el-form-item>
      <el-form-item label="已完成">
        <span>{{ d.length }}</span>
      </el-form-item>
      <el-form-item label="总错题">
        <span>{{ d.length }}</span>
      </el-form-item>
      <el-form-item label="开始时间">
        <span>{{ parseTime(time_start) }}</span>
      </el-form-item>
      <el-form-item label="已耗时">
        <span>{{ time_spent||'未开始' }}</span>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { parseTime } from '@/utils'
export default {
  name: 'TrainStatus',
  data: () => ({
    time_start: new Date(),
    time_spent: null,
    timer: null
  }),
  computed: {
    d () {
      return this.$store.state.problems.current_problems
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      const t = new Date()
      this.time_spent = parseTime(t - this.time_start - 8 * 3600e3, '{h}:{i}:{s}')
    }, 1e3)
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    parseTime
  }
}
</script>
