<template>
  <el-card v-if="!disabled">
    <span v-if="showLabel" slot="header" style="font-weight:800;font-size:1rem">{{ label }}</span>
    <el-form-item label="启用状态">
      <el-tooltip :content="`当不存在${label}时请禁用此项目`">
        <el-switch
          v-model="innerForm.valid"
          active-text="启用"
          inactive-text="禁用"
          inactive-color="#e22d2d"
        />
      </el-tooltip>
    </el-form-item>
    <el-form-item v-show="innerForm.valid" label="生效时间">
      <el-tooltip :content="`${label}最后一次更换地点的时间`">
        <el-date-picker
          v-model="innerForm.date"
          :placeholder="`填写${label}开始日期`"
          format="yyyy年MM月dd日"
          value-format="yyyy-MM-dd"
        />
      </el-tooltip>
    </el-form-item>
    <el-form-item v-show="innerForm.valid" label="行政区划">
      <el-tooltip content="请准确选中到区/县一级">
        <CascaderSelector
          v-model="innerForm.address"
          :value-name="'code'"
          :label-name="'name'"
          :placeholder="`${label}所在地`"
          :child-getter-method="locationChildren"
        />
      </el-tooltip>
    </el-form-item>
    <el-form-item v-show="innerForm.valid" label="详细地址">
      <el-input v-model="innerForm.addressDetail" :placeholder="`填写${label}详细地址`" />
    </el-form-item>
  </el-card>
  <div v-else>
    <el-form-item :label="label">
      <div v-if="!innerForm.valid">无</div>
      <div v-else>
        <el-tag>{{ parseTime(new Date(innerForm.date),'{yyyy}年{mm}月{dd}日') }}</el-tag>
        <span style="font-size:1.1em">{{ innerForm.address.name }}</span>
        <div style="color:#aaa;font-size:1em">{{ innerForm.addressDetail }}</div>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import CascaderSelector from '@/components/CascaderSelector'
import { locationChildren } from '@/api/common/static'
export default {
  name: 'SettleFormItem',
  components: { CascaderSelector },
  props: {
    disabled: { type: Boolean, default: false, },
    label: { type: String, default: '', },
    form: { type: Object, default() { return this.createInnerForm() }, },
    showLabel: { type: Boolean, default: true, },
  },
  data() {
    return {
      innerForm: this.createInnerForm(),
    }
  },
  watch: {
    form: {
      handler(val) {
        if (this.innerForm === val) return
        this.innerForm = this.form
        if (!this.innerForm) this.innerForm = {}
        if (this.innerForm.id) delete this.innerForm.id
        if (this.form.address) {
          this.innerForm.address = {
            code: this.form.address.code + '',
            name: this.form.address.name,
          }
          // fix bug empty address
          if (this.innerForm.address.code === '') {
            this.innerForm.address.code = '0'
          }
        } else {
          this.innerForm.address = {
            code: '0',
            name: null,
          }
        }
      },
      deep: true,
      immediate: true,
    },
    innerForm: {
      handler(val) {
        this.$emit('update:form', val)
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    parseTime,
    locationChildren,
    createInnerForm() {
      return {
        date: '2000-1-1',
        valid: true,
        address: {
          code: '0',
        },
        addressDetail: '0',
      }
    },
  },
}
</script>

<style></style>
