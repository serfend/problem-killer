<template>
  <div v-loading="loading">
    <h2>题库选取</h2>
    <el-row :gutter="20">
      <el-col v-for="d in database_filtered" :key="d.name" :lg="12" :md="24" class="database-item">
        <DataBase :data="d" @requireStart="requireStart(d)" />
      </el-col>
    </el-row>
    <Pagination :pagesetting.sync="page" :total-count="totalPage" />
  </div>
</template>

<script>
import { get_all_database_summary } from '../../Problem/loader'
export default {
  name: 'DataBaseSelector',
  components: {
    DataBase: () => import('./DataBase'),
    Pagination: () => import('@/components/Pagination')
  },
  data: () => ({
    loading: false,
    database: [],
    page: {
      pageIndex: 0,
      pageSize: 5
    },
    totalPage: 0
  }),
  computed: {
    database_filtered () {
      const d = this.database || []
      let r = d.filter(i => i).filter(i => i.problems)
      r = r.sort((a, b) => Number(a.index) - Number(b.index))
      return r
    }
  },
  watch: {
    page: {
      handler (v) {
        this.refresh()
      },
      deep: true
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh() {
      const { page } = this
      this.loading = true
      get_all_database_summary(page).then(data => {
        this.database = data.items
        this.totalPage = data.total
      }).finally(() => {
        this.loading = false
      })
    },
    requireStart (database) {
      if (!database) return
      this.loading = true
      this.$store.dispatch('problems/select_database', { database }).then(() => {
        this.$emit('requireStart', database)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.database-item {
  margin-top: 1rem;
}
</style>
