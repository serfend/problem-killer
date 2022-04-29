<template>
  <div>
    <h2>题库选取</h2>
    <el-card v-for="d in database_filtered" :key="d.name" class="problem">
      <template #header>
        <div class="header">
          <h3>{{ d.alias }}</h3>
          <el-button type="primary" class="btn-start">开始答题</el-button>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <div>共{{ d.problems && d.problems.length }}题</div>
          <div class="problem-description">{{ d.description || '无描述' }}</div>
        </el-col>
        <el-col :span="16">
          <h2>历史答题情况</h2>
          <div>开发中</div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { get_all_database_summary } from '../Problem/loader'
export default {
  name: 'DataBaseSelector',
  data: () => ({
    database: []
  }),
  computed: {
    database_filtered () {
      const d = this.database || []
      let r = d.filter(i => i).filter(i => i.problems)
      r = r.sort((a, b) => Number(a.index) - Number(b.index))
      return r
    }
  },
  mounted () {
    get_all_database_summary().then(data => {
      this.database = data
    })
  }
}
</script>
<style lang="scss" scoped>
.problem {
  .problem-description {
    color: #ccc;
  }
  .header {
    display: flex;
  }
  .btn-start {
    margin-left: 1rem;
  }
}
</style>
