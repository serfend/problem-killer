<template>
  <div>
    <el-form-item
      label="联系方式"
      prop="phone"
      inline-message
      :rules="[{ validator: phoneRoleCheck, trigger: 'blur' }]"
    >
      <el-input v-model="innerForm.phone" placeholder="请输入常用的手机号" />
    </el-form-item>
    <el-tabs v-model="nowStep">
      <el-tab-pane label="本人居住地">
        <el-alert type="warning" show-icon>本人地址应为当前居住地，而非家乡所在地。</el-alert>
        <SettleFormItem
          :form.sync="innerForm.settle.self"
          :disabled="false"
          label="本人居住地"
          :show-label="false"
        />
      </el-tab-pane>
      <el-tab-pane label="配偶居住地">
        <SettleFormItem
          :form.sync="innerForm.settle.lover"
          :disabled="false"
          label="配偶居住地"
          :show-label="false"
        />
      </el-tab-pane>
      <el-tab-pane label="本人父母居住地">
        <SettleFormItem
          :form.sync="innerForm.settle.parent"
          :disabled="false"
          label="本人父母居住地"
          :show-label="false"
        />
      </el-tab-pane>
      <el-tab-pane label="配偶父母居住地">
        <SettleFormItem
          :form.sync="innerForm.settle.loversParent"
          :disabled="false"
          label="配偶父母居住地"
          :show-label="false"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { validPhone } from '@/utils/validate'
import SettleFormItem from '@/components/SettleFormItem'
export default {
  name: 'Social',
  components: { SettleFormItem },
  props: {
    childIndex: {
      type: Number,
      default: 0,
    },
    form: {
      type: Object,
      default() {
        return this.innerForm
      },
    },
  },
  data() {
    return {
      nowStep: '0',
      innerForm: {
        phone: '',
        settle: {
          self: {},
          lover: {},
          parent: {},
          loversParent: {},
        },
      },
    }
  },
  watch: {
    childIndex: {
      handler(val) {
        const v = val.toString()
        this.nowStep = v
      },
    },
    form: {
      handler(val) {
        if (!val || !val.settle) return
        this.innerForm = val
        var settle = this.innerForm.settle
        if (settle.id) delete settle.id
      },
      deep: true,
      immediate: true,
    },
    innerForm: {
      handler(val, oldVal) {
        this.$nextTick(() => {
          this.$emit('update:form', this.innerForm)
        })
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    phoneRoleCheck(filed, invalidVal, cb) {
      var val = this.innerForm[filed.field]
      var result = validPhone(val)
      if (result) cb(new Error(result))
      cb()
    },
  },
}
</script>

<style lang="less" scoped>
.normal-item-card {
  margin-top: 1rem;
  max-width: 40rem;
}
</style>
