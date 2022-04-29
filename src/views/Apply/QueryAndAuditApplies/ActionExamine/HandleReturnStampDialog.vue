<template>
  <span>
    <el-dialog v-if="asOperation" :visible.sync="innerShow" :title="`${displayName}完成时间`" append-to-body>
      <el-card v-loading="loading">
        <ExecuteForm :data.sync="auditForm" :display-name="displayName" :only-view="onlyView" />
      </el-card>
      <span slot="footer">
        <el-button-group v-if="!onlyView">
          <el-button type="info" @click="$emit('update:show',false)">取 消</el-button>
          <el-button type="warning" @click="SubmitRecall">确 定</el-button>
        </el-button-group>
        <el-button v-else @click="$emit('update:show',false)">取 消</el-button>
      </span>
    </el-dialog>
    <el-card v-else style="min-width:25rem">
      <ExecuteForm :data.sync="auditForm" :display-name="displayName" :only-view="onlyView" />
    </el-card>
  </span>
</template>

<script>
import { parseTime } from '@/utils'
export default {
  name: 'HandleReturnStampDialog',
  components: {
    ExecuteForm: () => import('./ExecuteForm')
  },
  props: {
    show: { type: Boolean, default: false },
    onlyView: { type: Boolean, default: false },
    row: { type: Object, default: () => ({}) },
    defaultStampReturn: { type: [String, Date], default: '' },
    defaultReason: { type: String, default: '' },
    displayName: { type: String, required: true },
    dataGetter: { type: Function, required: true },
    dataSetter: { type: Function, required: true },
    handleId: { type: String, default: null },
    entityType: { type: String, default: 'vacation' },
    asOperation: { type: Boolean, default: true }
  },
  data: () => ({
    loading: false,
    auditForm: {
      auth: {
        authByUserId: null,
        code: null
      },
      recallData: {},
      stampReturn: null,
      remark: null,
      handleBy: null,
      handleTo: null
    }
  }),
  computed: {
    innerShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  },
  watch: {
    'row.id': {
      handler(val) {
        const { userBase, base } = this.row
        const userid = userBase && userBase.id || base.userId
        this.auditForm.handleTo = userid
      },
      immediate: true
    },
    'auditForm.auth.authByUserId': {
      handler(val) {
        if (!this.onlyView) this.auditForm.handleBy = val
      }
    },
    defaultStampReturn: {
      handler(val) {
        this.auditForm.stampReturn = val
      },
      immediate: true
    },
    defaultReason: {
      handler(val) {
        if (!this.onlyView) this.auditForm.remark = val
      },
      immediate: true
    },
    'auditForm.stampReturn': {
      handler(val) {
        const { row, auditForm } = this
        const { recallData } = auditForm
        const rawStampReturn = (recallData && recallData.stampReturn) || (row && row.request && row.request.stampReturn)

        this.$emit('requireUpdateReason', { stampReturn: val, rawStampReturn })
      },
      immediate: true
    },
    show: {
      handler(val) {
        if (!val) return
        if (this.onlyView) return this.showRecallMsg()
        this.recallApply()
      },
      immediate: true
    }
  },
  methods: {
    SubmitRecall() {
      const model = {
        apply: this.auditForm.applyId,
        reason: this.auditForm.remark,
        returnStamp: parseTime(this.auditForm.stampReturn),
        handleBy: this.auditForm.handleBy
      }
      const fn = this.dataSetter
      fn({
        data: model,
        auth: this.auditForm.auth,
        entityType: this.entityType
      }).then(result => {
        this.$notify.success(`${this.displayName}操作已提交`)
        this.innerShow = false
        this.$emit('updated')
      })
    },
    recallApply() {
      const row = this.row
      const sr = row.request.stampReturn
      const sl = row.request.stampLeave
      const auditForm = this.auditForm
      auditForm.applyId = row.id
      auditForm.rawStampLeave = sl
      auditForm.recallData = {
        rawStampReturn: sr
      }
    },
    showRecallMsg() {
      const row = this.row
      const auditForm = this.auditForm
      auditForm.recallData.rawStampReturn = row.request.stampReturn
      this.loading = true
      const fn = this.dataGetter
      fn({ id: this.handleId, entityType: this.entityType })
        .then(res => {
          const { create, returnStamp, reason, handleBy } = res
          const { realName, id } = handleBy
          auditForm.recallData.create = create
          auditForm.stampReturn = returnStamp
          const row = this.row
          auditForm.rawStampLeave = row && row.request.stampLeave
          auditForm.remark = reason
          auditForm.handleBy = id
          this.$notify.success(`${realName}${this.displayName}的人员`)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style>
</style>
