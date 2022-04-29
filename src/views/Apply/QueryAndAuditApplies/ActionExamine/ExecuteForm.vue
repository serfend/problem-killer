<template>
  <el-form ref="auditForm" label-width="6rem">
    <el-form-item :label="`被${displayName}人`">
      <UserFormItem :userid="auditForm.handleTo" />
    </el-form-item>
    <el-form-item :label="`${displayName}人`">
      <UserSelector :code.sync="auditForm.handleBy" />
    </el-form-item>
    <el-form-item v-show="onlyView" :label="`${displayName}创建`">
      <el-date-picker
        v-model="auditForm.recallData.create"
        disabled
        type="datetime"
        style="width:100%"
      />
    </el-form-item>
    <el-form-item label="预计离队">
      <el-date-picker
        v-model="auditForm.rawStampLeave"
        type="datetime"
        disabled
        style="width:100%"
      />
    </el-form-item>
    <el-form-item label="预计归队">
      <el-date-picker
        v-model="auditForm.recallData.rawStampReturn"
        type="datetime"
        disabled
        style="width:100%"
      />
    </el-form-item>
    <el-form-item :label="`${displayName}后时间`">
      <el-date-picker v-model="auditForm.stampReturn" type="datetime" style="width:100%" />
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="auditForm.remark" placeholder="请输入备注" type="textarea" />
    </el-form-item>
    <AuthCode :form.sync="auditForm.auth" :select-name="`${displayName} - 归队时间`" />
  </el-form>
</template>

<script>
export default {
  name: 'ExecuteForm',
  components: {
    AuthCode: () => import('@/components/AuthCode'),
    UserFormItem: () => import('@/components/User/UserFormItem'),
    UserSelector: () => import('@/components/User/UserSelector')
  },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: { type: Object, default: () => ({}) },
    displayName: { type: String, default: null },
    onlyView: { type: Boolean, default: true }
  },
  data: () => ({
    innerData: null
  }),
  computed: {
    auditForm: {
      get() { return this.innerData },
      set(v) {
        this.innerData = v
        this.$emit('change', v)
      }
    }
  },
  watch: {
    data: {
      handler(val) {
        this.innerData = val
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style>

</style>
