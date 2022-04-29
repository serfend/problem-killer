<template>
  <div v-loading="loading" @mouseenter="init">
    <el-dialog :visible.sync="show">
      <template v-if="data" #title>
        <h2>{{ data.auditSolution }}</h2>
        <div>{{ getCDdes(data.base,data.baseInfo) }}</div>
      </template>
      <ApplyAuditStreamPreview
        v-if="data"
        show-detail
        :audit-status="data.steps"
        :title="data.auditStreamSolution"
        :now-step="data.nowStep ? data.nowStep.index : data.steps.length"
        :entity-type="entityType"
      />
    </el-dialog>
    <div style="cursor:pointer;" @click="showDialog">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import { detail } from '@/api/apply/query'
export default {
  name: 'ApplyAuditStreamPreviewLoader',
  components: {
    ApplyAuditStreamPreview: () => import('./ApplyAuditStreamPreview')
  },
  props: {
    id: { type: String, default: null },
    entityType: { type: String, require: true, default: null }
  },
  data: () => ({
    loading: false,
    data: null,
    initilize: false,
    show: false
  }),
  watch: {
    id: {
      handler(val) {
        if (!this.initialize) return
        this.refresh()
      },
      immediate: true
    }
  },
  methods: {
    getCDdes(row, prevRow) {
      const cn = row.companyName
      const prevCn = prevRow.companyName
      const dn = row.dutiesName
      const prevDn = prevRow.dutiesName
      const result = [cn, dn]
      if (cn !== prevCn || dn !== prevDn) {
        result.push('(')
        result.push(prevCn)
        result.push(prevDn)
        result.push(')')
      }
      return result.join(' ')
    },
    showDialog() {
      this.show = true
    },
    init() {
      if (this.initialize) return
      this.initialize = true
      this.refresh()
    },
    refresh() {
      const { id, entityType } = this
      this.loading = true
      detail({ id, entityType })
        .then(d => {
          this.data = d.model
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
