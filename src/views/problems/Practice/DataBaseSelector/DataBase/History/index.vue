<template>
  <el-table :data="history">
    <el-table-column label="时间">
      <template slot-scope="{row}">
        <span>{{ row.time_start }}</span>
      </template>
    </el-table-column>
    <el-table-column label="做题用时">
      <template slot-scope="{row}">
        <span>{{ row.time_used }}</span>
      </template>
    </el-table-column>
    <el-table-column label="答题数">
      <template slot-scope="{row}">
        <span>{{ row.problem_complete }}</span>
      </template>
    </el-table-column>
    <el-table-column label="正确数">
      <template slot-scope="{row}">
        <span>{{ row.problem_solved }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="{row}">
        <el-button type="text" disabled @click="onDetail(row)">查看详情</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'History',
  props: {
    data: { type: Array, default: () => [] }
  },
  data: () => ({}),
  computed: {
    history() {
      const d = this.data || []
      return d
    }
  },
  methods: {
    onDetail(v) {}
  }
}
</script>

<style>

</style>
