<template>
  <el-card>
    <el-form v-if="data" label-width="6rem">
      <el-form-item label="开始时间">
        <span>{{ parseTime(time_start) }}</span>
      </el-form-item>
      <el-form-item label="总题数">
        <span>
          <span>{{ data.total }}</span>
          <el-button v-if="duplicated.length" type="text" @click="showDuplicated = !showDuplicated">({{
            duplicated.length
          }}题重复)</el-button>
        </span>
      </el-form-item>
      <el-form-item label="轮/次 完成">
        <span>{{ data.solved }}</span>
        <span> / </span>
        <span>{{ data.global_solved }}</span>
      </el-form-item>
      <el-form-item label="轮/次 错题">
        <span>{{ data.wrong }}</span>
        <span> / </span>
        <span>{{ data.global_wrong }}</span>
      </el-form-item>
      <el-form-item label="总/题均 耗时">
        <span>{{ time_spent || '未开始' }}</span>
        <span> / </span>
        <span>{{ `${Math.ceil((time_spent_seconds && data.global_solved && (time_spent_seconds /
          data.global_solved)) * 100) / 100}秒` || '暂无'
        }}</span>
      </el-form-item>
    </el-form>
    <el-dialog v-if="showDuplicated" :visible.sync="showDuplicated" append-to-body>
      <template #title>
        <h3>重复题目</h3>
      </template>
      <el-table :data="duplicated">
        <el-table-column label="重复次数">
          <template slot-scope="{row}">
            <span>{{ data.duplicated[row] - 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="题目内容">
          <template slot-scope="{row}">
            <span>{{ row }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script>
import { parseTime, datedifference } from '@/utils'
export default {
  name: 'TrainStatus',
  props: {
    data: { type: Object, default: null }
  },
  data: () => ({
    time_start: new Date(),
    time_spent: null,
    time_spent_seconds: 0,
    timer: null,
    showDuplicated: false
  }),
  computed: {
    duplicated () {
      if (!this.data) return []
      const { data } = this
      const { duplicated } = data
      if (!duplicated) return []
      return Object.keys(duplicated).filter(i => data.duplicated[i] > 1)
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      const t = new Date()
      this.time_spent = parseTime(t - this.time_start - 8 * 3600e3, '{d}d{h}h{i}m{s}s')
      this.time_spent_seconds = datedifference(new Date(), this.time_start, 'second')
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
