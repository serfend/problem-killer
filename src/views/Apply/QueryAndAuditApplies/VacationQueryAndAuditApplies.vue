<template>
  <div>
    <div v-if="currentUser&&currentUser.id" v-loading="loading">
      <ApplySearchCommon
        ref="queryAppliesForm"
        :loading.sync="appliesListIsLoading"
        :list.sync="appliesList"
        :pages.sync="pages"
        :pages-total-count.sync="pagesTotalCount"
        :fullui.sync="fullSearchUI"
        @exportApplies="exportApplies"
      />
      <ApplicationList
        ref="applicationlist"
        :list="appliesList"
        :pages.sync="pages"
        :pages-total-count="pagesTotalCount"
        :loading="appliesListIsLoading"
        @updated="requestUpdate"
      >
        <template slot="action" slot-scope="{row}">
          <el-tooltip content="点击此处或双击空白处查看">
            <el-link type="info" :href="detailUrl(row.id)" target="_blank">查看详情</el-link>
          </el-tooltip>
          <ActionExamine :row="row" :entity-type="entityType" @updated="requestUpdate([row])" />
          <ActionUser :row="row" :entity-type="entityType" @updated="requestUpdate([row])" />
        </template>
      </ApplicationList>
    </div>
    <Login v-else />
  </div>
</template>

<script>
import { exportMultiApplies } from '@/api/common/static'
export default {
  name: 'QueryAndAuditApplies',
  components: {
    ApplySearchCommon: () => import('./ApplySearchCommon'),
    ApplicationList: () => import('./ApplicationList/ApplicationListvacation'),
    ActionExamine: () => import('./ActionExamine'),
    ActionUser: () => import('./ActionUser'),
    Login: () => import('@/views/login')
  },
  data: () => ({
    entityType: 'vacation',
    loading: false,
    appliesList: [],
    appliesListIsLoading: false,
    pages: {
      pageSize: 20,
      pageIndex: 0
    },
    pagesTotalCount: 0,
    fullSearchUI: false
  }),
  computed: {
    currentUser() {
      return this.$store.state.user.data
    }
  },
  watch: {
    pages: {
      handler(val) {
        localStorage.setItem(
          'queryAndAuditApplies',
          JSON.stringify({ pages: val })
        )
      },
      deep: true
    }
  },
  methods: {
    exportApplies() {
      const total = this.pagesTotalCount
      const expFn = this.exportAppliesDirect
      this.$confirm(`当前记录共有${total}条，是否导出?`).then(() => {
        this.loading = true
        const nowScrrenCount = this.appliesList.length
        if (nowScrrenCount < total) {
          this.$message.success('加载全部休假申请中')
          const fn = this.$refs.queryAppliesForm.searchData
          const callback = data => {
            expFn(data.list.map(i => i.id))
          }
          fn(true, callback, { pageIndex: 0, pageSize: total }, true)
        } else expFn(this.appliesList.map(i => i.id))
      })
    },
    exportAppliesDirect(ids) {
      this.loading = true
      this.$message.success('导出申请中')
      exportMultiApplies('休假人员统计表.xlsx', ids).finally(() => {
        this.loading = false
      })
    },
    detailUrl(id) {
      var t = `/#/apply/${this.entityType}/applydetail?id=${id}`
      return t
    },
    requestUpdate(row) {
      this.$refs.queryAppliesForm.searchData(true)
      this.$refs.applicationlist.handleUpdated(row)
    }
  }
}
</script>
<style scoped>
.alldivinline {
  float: inline-end !important;
}
</style>
