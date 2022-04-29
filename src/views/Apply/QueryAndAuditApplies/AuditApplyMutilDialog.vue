<template>
  <el-dialog v-loading="loading" :visible.sync="multiAuditFormShow" title="批量审核" append-to-body>
    <div v-if="multiAuditForm.responseList.length>0">
      <el-form ref="auditForm" :model="auditForm">
        <el-form-item label="审核结果" align="left">
          <el-switch
            v-model="auditForm.action"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="multiAuditUpdateAll"
          />
        </el-form-item>
        <el-form-item label="备注内容" prop="remark">
          <el-input
            v-model="auditForm.remark"
            placeholder="可选项"
            type="textarea"
            @change="multiAuditUpdateAll"
          />
        </el-form-item>
        <AuthCode :form.sync="auditForm.auth" select-name="请假多点审批" />
      </el-form>
      <span slot="footer">
        <el-button-group style="width:100%">
          <el-button style="width:50%" type="info" @click="multiAuditFormShow = false">取 消</el-button>
          <el-button style="width:50%" type="success" @click="SubmitMultiAuditForm">确 定</el-button>
        </el-button-group>
      </span>

      <el-collapse v-model="activeApply" style="overflow:auto" accordion>
        <el-collapse-item v-for="r in multiAuditForm.responseList" :key="r.id" :name="r.id">
          <template slot="title">
            <el-switch
              v-model="r.action"
              :active-value="1"
              :inactive-value="2"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="r.modefiedByUser=true"
            />
            <el-tag
              :type="r.apply.type.isPlan?'info':'primary'"
              class="info-tag"
            >{{ r.apply.type.isPlan?'计划':'正式' }}</el-tag>
            <el-tag class="info-tag">{{ r.apply.base.realName }}</el-tag>
            <el-tag class="info-tag">{{ r.apply.request.vacationPlace.name }}</el-tag>
            <el-tag
              class="info-tag"
            >{{ datedifference(r.apply.request.stampReturn,r.apply.request.stampLeave) + 1 }}天{{ r.apply.request.onTripLength>0?`(路途${r.apply.request.onTripLength}天)`:'(无路途)' }}</el-tag>
          </template>
          <el-form style>
            <el-form-item label="批复内容">
              <el-input v-model="r.remark" type="textarea" @change="r.modefiedByUser=true" />
            </el-form-item>
            <el-form-item label="单位职务">
              {{ r.apply.base.companyName }}
              {{ r.apply.base.dutiesName }}
            </el-form-item>
            <el-form-item label="休假原因">{{ r.apply.request.reason }}</el-form-item>
            <el-form-item label="休假地点">{{ r.apply.request.vacationPlace.name }}</el-form-item>
            <el-form-item label="离队时间">{{ r.apply.request.stampLeave }}</el-form-item>
            <el-form-item label="归队时间">{{ r.apply.request.stampReturn }}</el-form-item>
            <el-form-item
              label="总天数"
            >{{ datedifference(r.apply.request.stampReturn,r.apply.request.stampLeave) + 1 }}天</el-form-item>
            <el-form-item
              label="路途"
            >{{ r.apply.request.onTripLength>0?`路途${r.apply.request.onTripLength}天`:'无路途' }}</el-form-item>
            <div v-for="a in r.apply.request.additialvacations" :key="a.length">
              <el-tag>{{ a.name }}{{ a.length }}天</el-tag>
              {{ a.description }}
            </div>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div v-else>当前暂时没有选中可审批的申请</div>
  </el-dialog>
</template>

<script>
import AuthCode from '@/components/AuthCode'
import { datedifference } from '@/utils'
import { audit } from '@/api/audit/handle'
export default {
  name: 'AuditApplyMutilDialog',
  components: {
    AuthCode
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    responselist: {
      type: Array,
      default() {
        return []
      },
      required: true
    },
    entityType: {
      type: String,
      default: 'vacation'
    }
  },
  data() {
    return {
      loading: false,
      multiAuditForm: {
        responseList: []
      },
      multiAuditFormShow: false,
      auditForm: {
        action: 1,
        remark: null
      },
      activeApply: ''
    }
  },
  watch: {
    responselist: {
      handler(val) {
        this.multiAuditForm.responseList = []
        for (let i = 0; i < val.length; i++) {
          const item = val[i]
          if (item.status === 40 || item.status === 50) {
            this.multiAuditForm.responseList.push({
              apply: item,
              id: item.id,
              action: 1,
              remark: '',
              modefiedByUser: false
            })
          }
        }
        this.multiAuditUpdateAll()
      },
      immediate: true,
      deep: true
    },
    show: {
      handler(val) {
        this.multiAuditFormShow = val
      },
      immediate: true
    },
    multiAuditFormShow: {
      handler(val) {
        this.$emit('update:show', val)
      },
      immediate: true
    }
  },
  methods: {
    datedifference,
    SubmitMultiAuditForm() {
      this.$refs['auditForm'].validate(valid => {
        if (!valid) return
        this.loading = true
        const auth = this.auditForm.auth
        var list = this.multiAuditForm.responseList.map(item => {
          return {
            id: item.id,
            action: item.action,
            remark: item.remark
          }
        })
        audit({ list: list }, auth, this.entityType)
          .then(resultlist => {
            const fn = result => {
              if (result.status === 0) {
                this.$notify.success(result.msg)
              } else {
                this.$notify.error(result.msg)
              }
            }
            for (let i = 0; i < resultlist.length; i++) {
              const item = {
                message: resultlist[i].message,
                status: resultlist[i].status
              }
              const applyraw = this.multiAuditForm.responseList[i]
              const apply = applyraw.apply
              const from = apply.base.realName
              const r = apply.request
              const vacationLen =
                datedifference(r.stampReturn, r.stampLeave) + 1
              item.msg = applyraw.action === 2 ? '驳回' : '通过'
              item.msg = `${item.msg}${from}的${vacationLen}天申请`
              item.msg += item.status === 0 ? '成功' : `失败:${item.message}`
              setTimeout(fn, (i + 1) * 1000, item)
            }
            this.$emit('updated')
          })
          .finally(() => {
            this.loading = false
            this.multiAuditFormShow = false
          })
      })
    },
    multiAuditUpdateAll() {
      this.multiAuditForm.responseList.forEach(r => {
        if (!r.modefiedByUser) {
          r.remark = this.auditForm.remark
          r.action = this.auditForm.action
        }
      })
    }
  }
}
</script>

<style scope>
.el-form-item {
  margin-bottom: 1rem;
}
.info-tag {
  margin-left: 0.5rem;
}
</style>
