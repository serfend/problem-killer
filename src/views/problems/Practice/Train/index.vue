<template>
  <div v-if="name" v-loading="loading">
    <div v-if="database">
      <h1>题库：{{ database.description }}</h1>
      <el-divider />
      <ProblemList :data="database.problems" />
    </div>
  </div>
</template>

<script>
import api from '@/api/problems'
export default {
  name: 'Train',
  components: {
    ProblemList: () => import('./ProblemList')
  },
  props: {
    name: { type: String, default: null }
  },
  data: () => ({
    database: null,
    loading: false
  }),
  watch: {
    name: {
      handler(val) {
        this.refresh()
      },
      immediate: true
    }
  },
  methods: {
    refresh() {
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
