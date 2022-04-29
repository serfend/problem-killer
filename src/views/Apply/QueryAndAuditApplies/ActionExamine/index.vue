<template>
  <span>
    <span v-if="!asOperation&&isApplyAccepted">
      <el-tabs v-if="shouldMoreThanOneCanShow" v-model="currentFocusForm">
        <el-tab-pane label="召回情况" name="0" />
        <el-tab-pane label="归队情况" name="1" />
      </el-tabs>
    </span>
    <HandleReturnStampDialog
      v-if="showExecuteStatus"
      :entity-type="entityType"
      :display-name="recallOrExecute?'召回':'确认'"
      :default-stamp-return.sync="defaultStampReturn"
      :default-reason.sync="defaultReason"
      :show.sync="showExecuteStatus"
      :only-view.sync="onlyView"
      :row="row"
      :data-getter="dataGetter"
      :data-setter="dataSetter"
      :handle-id="handleId"
      :as-operation="asOperation"
      @updated="requireUpdate"
      @requireUpdateReason="updateDefaultReason"
    />
    <span v-if="enableAudit&&asOperation&&row.status>30&&row.status<75">
      <AuditApplyDialog :apply-id="row.id" :show.sync="showAudit" :entity-type="entityType" @updated="requireUpdate" />
      <el-link v-show="!showAudit" type="success" @click="showAudit=true">审批</el-link>
    </span>

    <span v-if="isApplyAccepted" v-loading="loading">
      <span v-if="asOperation">
        <el-tooltip v-if="entityTypeHasRecall" content="填写召回单交终审人审批完成后，确认召回生效">
          <el-link v-if="shouldShowRecall" type="primary" @click="recallApply(true)">已召回</el-link>
          <el-link v-else type="danger" @click="recallApply(false)">召回</el-link>
        </el-tooltip>
        <el-tooltip v-if="shouldShowExecuteBtn" :content="`${entityTypeReturnBeforeEnd?'':'请假结束后，'}确认实际归队时间`">
          <el-link v-if="!hasExecuteStatus" type="success" @click="confirmExecuteStatus(false)">确认</el-link>
        </el-tooltip>
        <el-link v-if="row.executeStatus&4" type="danger" @click="confirmExecuteStatus(true)">推迟归队</el-link>
        <el-link v-else-if="hasExecuteStatus" type="info" @click="confirmExecuteStatus(true)">已确认</el-link>
      </span>
    </span>
  </span>
</template>

<script>
import {
  postRecallOrder,
  getRecallOrder,
  postExecuteStatus,
  getExecuteStatus
} from '@/api/apply/recall'
import { parseTime, debounce } from '@/utils'
const INFO_delay_return = '因XXXX，需延迟归队'
const INFO_ontime_return = '按时归队'
const INFO_need_recall_return = '因XXXXX工作需要，此同志需尽快归队'
export default {
  name: 'ActionExamine',
  components: {
    HandleReturnStampDialog: () => import('./HandleReturnStampDialog'),
    AuditApplyDialog: () => import('../AuditApplyDialog')
  },
  props: {
    row: { type: Object, default: () => ({}) },
    entityType: { type: String, default: 'vacation' },
    asOperation: { type: Boolean, default: true },
    enableAudit: { type: Boolean, default: true }
  },
  data: () => ({
    loading: false,
    showAudit: false,
    showExecuteStatus: false,
    recallOrExecute: false,
    defaultStampReturn: '',
    defaultReason: '',
    dataGetter: null,
    dataSetter: null,
    recallRecord: null,
    handleId: null,
    onlyView: false,
    currentFocusForm: null
  }),
  computed: {
    entityTypeConfirmCurrent () {
      return !this.entityTypeHasRecall
    },
    entityTypeHasRecall () {
      return this.entityType === 'vacation'
    },
    entityTypeReturnBeforeEnd () {
      return !this.entityTypeHasRecall
    },
    shouldShowRecall () {
      const { entityTypeHasRecall, row } = this
      return entityTypeHasRecall && row.recallId !== null
    },
    shouldShowExecuteBtn () {
      const { entityTypeReturnBeforeEnd, row, recallRecord } = this
      const n = (recallRecord && recallRecord.returnStamp) || new Date()
      const { stampReturn } = row.request || row
      return entityTypeReturnBeforeEnd || new Date(stampReturn) <= new Date(n)
    },
    hasExecuteStatus () {
      const { row } = this
      return (row.executeStatus & 1) && row.executeStatusId
    },
    shouldMoreThanOneCanShow () {
      const { shouldShowRecall, hasExecuteStatus } = this
      return shouldShowRecall && hasExecuteStatus
    },
    isApplyAccepted() {
      const { row } = this
      return row.status === 100
    },
    requireShowExecuteStatus() {
      return debounce(() => {
        this.loadRecallInfo()
          .catch(e => {})
          .finally(() => {
            if (this.asOperation) return
            this.directShowForm()
          })
      }, 5e2)
    }
  },
  watch: {
    row: {
      handler (val) {
        if (!val) return
        this.requireShowExecuteStatus()
      },
      immediate: true,
      deep: true
    },
    currentFocusForm(val) {
      if (Number(val) === 0) return this.recallApply(true)
      return this.confirmExecuteStatus(true)
    }
  },
  methods: {
    loadRecallInfo () {
      const { entityType, row } = this
      const recallId = row && row.recallId
      if (!recallId) return Promise.reject()
      this.loading = true
      return getRecallOrder({ id: recallId, entityType, ignoreError: true })
        .then((data) => {
          this.recallRecord = data
        }).finally(() => {
          this.loading = false
        })
    },
    directShowForm () {
      if (this.shouldMoreThanOneCanShow) return
      if (this.shouldShowRecall) return this.recallApply(true)
      if (this.hasExecuteStatus) return this.confirmExecuteStatus(true)
    },
    requireUpdate () {
      this.$emit('updated')
    },
    updateDefaultReason ({ stampReturn, rawStampReturn }) {
      const n = new Date(stampReturn)
      const raw_n = new Date(rawStampReturn)
      const system_desc = [INFO_delay_return, INFO_need_recall_return, INFO_ontime_return]
      if (!system_desc.find(i => i === this.defaultReason)) return
      if (n > raw_n) {
        this.defaultReason = INFO_delay_return
      } else if (n < raw_n - 86400e3) {
        this.defaultReason = INFO_need_recall_return
      } else {
        this.defaultReason = INFO_ontime_return
      }
    },
    recallApply (isOnlyShow) {
      this.handleId = this.row.recallId
      this.dataGetter = getRecallOrder
      this.dataSetter = postRecallOrder
      this.defaultStampReturn = parseTime(new Date())
      this.defaultReason = INFO_need_recall_return
      this.recallOrExecute = true
      this.onlyView = isOnlyShow
      this.showExecuteStatus = true
    },
    confirmExecuteStatus (isOnlyShow) {
      this.handleId = this.row.executeStatusId
      this.dataGetter = getExecuteStatus
      this.dataSetter = postExecuteStatus
      this.defaultStampReturn = this.entityTypeConfirmCurrent
        ? parseTime(new Date())
        : this.row.request.stampReturn
      this.defaultReason = INFO_ontime_return
      this.recallOrExecute = false
      this.onlyView = isOnlyShow
      this.showExecuteStatus = true
    }
  }
}
</script>

