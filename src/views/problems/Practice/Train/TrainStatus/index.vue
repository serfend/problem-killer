<template>
  <el-card>
    <el-form v-if="data" label-width="5rem">
      <el-form-item label="总题数">
        <span>
          <span>{{ data.total }}</span>
          <el-button v-if="duplicated.length" type="text" @click="showDuplicated = !showDuplicated">({{ duplicated.length
          }}题重复)</el-button>
        </span>
      </el-form-item>
      <el-form-item label="已完成">
        <span>{{ data.solved }}</span>
      </el-form-item>
      <el-form-item label="总错题">
        <span>{{ data.wrong }}</span>
      </el-form-item>
      <el-form-item label="开始时间">
        <span>{{ parseTime(time_start) }}</span>
      </el-form-item>
      <el-form-item label="已耗时">
        <span>{{ time_spent || '未开始' }}</span>
      </el-form-item>
    </el-form>
    <el-dialog v-if="showDuplicated" :visible="showDuplicated">
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
import { parseTime } from '@/utils'
export default {
  name: 'TrainStatus',
  props: {
    data: { type: Object, default: null }
  },
  data: () => ({
    time_start: new Date(),
    time_spent: null,
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
