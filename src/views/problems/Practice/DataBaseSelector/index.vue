<template>
  <div v-loading="loading">
    <h2>题库选取</h2>
    <InfinityList :load-method="refresh" :load-payload="{}" :load-page-merge-method="merge_page_payload" :items.sync="database">
      <template slot="items">
        <el-row :gutter="20">
          <el-col v-for="d in database_filtered" :key="d.name" :lg="12" :md="24" class="database-item">
            <DataBase :data="d" @requireStart="requireStart" />
          </el-col>
        </el-row>
      </template>
    </InfinityList>
  </div>
</template>

<script>
import { get_all_database_summary } from '../../Problem/loader'
export default {
  name: 'DataBaseSelector',
  components: {
    DataBase: () => import('./DataBase'),
    InfinityList: () => import('@/components/Pagination/InfinityList')
  },
  data: () => ({
    loading: false,
    database: [],
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
  methods: {
    merge_page_payload(payload, page) {
      return Object.assign({ data: payload }, { pageIndex: page.index, pageSize: page.size })
    },
    refresh(data) {
      return new Promise((res, rej) => {
        get_all_database_summary(data).then(data => {
          this.totalPage = data.total
          res(data.items)
        }).catch(e => rej(e))
      })
    },
    requireStart ({ database, is_manual }) {
      if (!database) return
      this.loading = true
      this.$store.dispatch('problems/select_database', { database }).then(() => {
        this.$emit('requireStart', { database_name: database.name, is_manual })
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
