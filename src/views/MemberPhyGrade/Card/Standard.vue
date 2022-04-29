<template>
  <el-table :data="mappingData">
    <el-table-column v-for="(t,i) in [''].concat(data)" :key="i" :label="t.type">
      <template slot-scope="scope">{{ scope.row[i] }}</template>
    </el-table-column>
  </el-table>
</template>

<script>
import { rankingOpt } from './rankingOpt'
export default {
  name: 'RankingStandard',
  data: () => ({
    data: rankingOpt
  }),
  computed: {
    mappingData() {
      if (!this.data) return null
      const d = this.data
      const rowHeader = d[0].standards.filter(i => !i[3]).map(i => i[0])
      const column = d.map(i => i.standards.filter(i => !i[3]).map(j => j[1]))
      const r = []
      for (let i = 0; i < rowHeader.length; i++) {
        const line = [rowHeader[i]]
        for (let j = 0; j < column.length; j++) {
          line.push(column[j][i])
        }
        r.push(line)
      }
      return r
    }
  }
}
</script>

<style>
</style>
