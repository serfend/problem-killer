<template>
  <div v-if="name" v-loading="loading">
    <div v-if="database">
      <el-row>
        <el-col :lg="8" :md="10" :sm="12" :xm="24">
          <ProblemOverview :data="database.problems" :focus.sync="problem_focus" />
          <el-divider />
          <TrainOptions :database="name" :problems="database.problems" />
          <el-divider />
          <TrainStatus :data="problem_status" />
        </el-col>
        <el-col :lg="16" :md="14" :sm="12" :xm="24" class="train-container">
          <div class="train">
            <h1>题库：{{ database.alias || database.description }}</h1>
            <ProblemList :data="database.problems" :status.sync="problem_status" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from '@/api/problems'
export default {
  name: 'Train',
  components: {
    ProblemOverview: () => import('./ProblemOverview'),
    ProblemList: () => import('./ProblemList'),
    TrainOptions: () => import('./TrainOptions'),
    TrainStatus: () => import('./TrainStatus'),
  },
  props: {
    name: { type: String, default: null }
  },
  data: () => ({
    database: null,
    loading: false,
    problem_focus: null,
    problem_status: null
  }),
  watch: {
    name: {
      handler (val) {
        this.refresh()
      },
      immediate: true
    }
  },
  methods: {
    refresh () {
      const { name } = this
      if (!name) return
      this.loading = true
      api.get_database_detail(name).then(data => {
        this.database = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.train-container {
  display: flex;
  justify-content: center;
}
.train {
  width: 64rem;
  padding: 0 0.2rem 0 0.2rem;
  border: 1px solid #ddd;
}
</style>
