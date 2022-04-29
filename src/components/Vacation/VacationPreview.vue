<template>
  <div>
    <el-button :icon="`el-icon-arrow-${Hide?'up':'down'}`" style="width:100%" type="info" @click="Hide=!Hide">{{ inner_hide?`展开查看：${title}`:'隐藏' }}</el-button>
    <el-card :header="title" :style="{transition:'all 0.5s ease',height:Hide?0:'30rem'}">
      <ApplyAuditStreamPreview
        v-show="!validateInfoInner"
        :solution-name.sync="solutionName"
        :userid="userid"
        :entity-type="entityType"
        :entity-type-desc="entityTypeDesc"
        :show-detail="true"
        :validate-info.sync="validateInfoInner"
      />
      <div v-show="validateInfoInner">
        <span>当前审批流程加载失败：</span>
        <el-tag type="danger">{{ validateInfoInner }}</el-tag>
      </div>
    </el-card>
  </div>
</template>

<script>
import ApplyAuditStreamPreview from '@/components/ApplicationApply/ApplyAuditStreamPreview'
export default {
  name: 'VacationPreview',
  components: { ApplyAuditStreamPreview },
  props: {
    userid: { type: String, default: null },
    entityType: { type: String, default: 'vacation' },
    entityTypeDesc: { type: String, default: null },
    validateInfo: { type: String, default: null },
    hide: { type: Boolean, default: false }
  },
  data: () => ({
    solutionName: null,
    validate_info: null,
    inner_hide: false
  }),
  computed: {
    title() {
      const { extractEntityType, entityType, solutionName } = this
      return `${extractEntityType(entityType)}审批流程预览[${solutionName || '无审批流'}]`
    },
    Hide: {
      get() { return this.inner_hide },
      set(val) {
        this.inner_hide = val
      }
    },
    validateInfoInner: {
      get () { return this.validate_info },
      set (v) {
        this.validate_info = v
        this.$emit('update:validateInfo', v)
      }
    }
  },
  watch: {
    hide: {
      handler(v) {
        this.Hide = v
      },
      immediate: true
    }
  },
  methods: {
    extractEntityType (v) {
      return { vacation: '休假', inday: '请假' }[v]
    }
  }
}
</script>

<style>
</style>
