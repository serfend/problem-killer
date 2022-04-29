<template>
  <span>
    <el-dialog :visible.sync="auditShow" append-to-body @closed="$emit('update:show',false)">
      <span slot="title">审批</span>
      <el-form ref="auditForm" :model="auditForm" label-width="80px">
        <el-form-item label="同意" align="left">
          <el-switch
            v-model="auditForm.action"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="备注内容">
          <el-input v-model="auditForm.remark" placeholder="可选项" type="textarea" />
        </el-form-item>
        <AuthCode :form.sync="auditForm.auth" select-name="请假单点审批" />
      </el-form>
      <span slot="footer">
        <el-button @click="auditShow = false">取 消</el-button>
        <el-button type="primary" @click="SubmitAuditForm">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import AuthCode from '@/components/AuthCode'
import { audit } from '@/api/audit/handle'
export default {
  name: 'AuditApplyDialog',
  components: { AuthCode },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    applyId: {
      type: String,
      default: '',
      required: true
    },
    entityType: {
      type: String,
      default: 'vacation'
    }
  },
  data() {
    return {
      auditForm: {
        action: 1,
        remark: '',
        auth: {}
      },
      auditShow: false
    }
  },
  watch: {
    show: {
      handler(val) {
        this.auditShow = val
      },
      immediate: true
    }
  },
  methods: {
    SubmitAuditForm() {
      const { action, remark, auth } = this.auditForm
      const list = [{ id: this.applyId, action, remark }]
      audit({ list }, auth, this.entityType)
        .then(resultlist => {
          resultlist.forEach(result => {
            if (result.status === 0) {
              this.$message.success('审批成功')
            } else {
              this.$message.error(`审批失败:${result.message}`)
            }
          })
          this.$emit('updated')
          this.auditShow = false
        })
        .finally(() => {})
    }
  }
}
</script>

<style>
</style>
