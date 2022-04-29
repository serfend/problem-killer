<template>
  <el-collapse-transition>
    <div v-if="!firstShow">
      <el-collapse-transition>
        <el-card v-show="show">
          <div v-if="innerData">
            <div class="action-row">
              <el-button type="primary" plain @click="openDetail(innerData.id)">查看详情</el-button>
              <ActionUser btn-type="danger" :row="innerData" @updated="userUpdate" />
            </div>
            <IndayApplyProgress
              :execute-id="innerData.executeStatusId"
              :show="show"
              :stamp-leave="innerData.request && innerData.request.stampLeave"
              :stamp-return="innerData.request && innerData.request.stampReturn"
            />
            <div style="display:flex">
              <el-form style="min-width:22rem;max-width:30rem">
                <el-form-item v-if="innerData.status!==20" label="请假类别">
                  <VacationType v-model="innerData.request.requestType" :entity-type="entityType" />
                  <TransportationType v-model="innerData.request.byTransportation" />
                </el-form-item>
                <el-form-item label="审批流程">
                  <ApplyAuditStreamPreviewLoader :id="innerData.id" :entity-type="entityType">
                    <el-button slot="content" type="text">点击查看</el-button>
                  </ApplyAuditStreamPreviewLoader>
                </el-form-item>
                <el-form-item v-if="innerData.status!==20" label="请假原因">{{ innerData.request.reason?innerData.request.reason:'未填写' }}</el-form-item>
                <el-form-item v-if="innerData.status!==20" label="请假去向">
                  {{ `${innerData.request.vacationPlace.name} ${innerData.request.vacationPlaceName==null?'无详细地址':innerData.request.vacationPlaceName}` }}
                </el-form-item>
                <el-form-item v-if="innerData.status!==20" label="预计离队">{{ timeFormat(innerData.request.stampLeave) }}</el-form-item>
                <el-form-item v-if="innerData.status!==20" label="预计归队">{{ timeFormat(innerData.request.stampReturn) }}</el-form-item>
              </el-form>
              <ActionExamine :row="innerData" :entity-type="entityType" :as-operation="false" />
            </div>
          </div>
          <NoData v-else content="无效的申请" />
        </el-card>
      </el-collapse-transition>
    </div>
  </el-collapse-transition>
</template>

<script>
import { parseTime, formatTime } from '@/utils'
export default {
  name: 'ApplyCard',
  components: {
    ActionUser: () => import('@/views/Apply/QueryAndAuditApplies/ActionUser'),
    ActionExamine: () => import('@/views/Apply/QueryAndAuditApplies/ActionExamine'),
    ApplyAuditStreamPreviewLoader: () => import('@/components/ApplicationApply/ApplyAuditStreamPreviewLoader'),
    VacationType: () => import('@/components/Vacation/VacationType'),
    TransportationType: () => import('@/components/Vacation/TransportationType'),
    IndayApplyProgress: () => import('./IndayApplyProgress'),
    NoData: () => import('@/views/Loading/NoData')
  },
  props: {
    data: { type: Object, default: () => ({}) },
    show: { type: Boolean, default: false }
  },
  data: () => ({
    entityType: 'inday',
    innerData: null,
    firstShow: true
  }),
  watch: {
    data: {
      handler (val) {
        if (!val) return
        this.innerData = val
      },
      immediate: true,
      deep: true
    },
    show: {
      handler (val) {
        if (!val) return
        this.firstShow = false
      },
      immediate: true
    }
  },
  methods: {
    openDetail (id) {
      const { applyDetailUrl } = this
      window.open(applyDetailUrl(id))
    },
    applyDetailUrl (id) {
      return `/#/apply/inday/applydetail?id=${id}`
    },
    userUpdate () {
      this.$emit('updated')
    },
    timeFormat (val) {
      const f = parseTime(val)
      const dis = formatTime(val)
      return f === dis ? f : `${f}(${dis})`
    }
  }
}
</script>
<style lang="scss" scoped>
@import './common';
</style>
