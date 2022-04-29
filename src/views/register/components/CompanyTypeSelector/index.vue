<template>
  <el-select v-model="Type" :placeholder="placeholder||'查询单位'">
    <el-option v-for="item in companyTypes" :key="item[0]" :label="item[1]" :value="item[0]">
      <span style="float: left">{{ item[1] }}</span>
      <span style="float: right; color: #cccccc; font-size: 13px">{{ item[0] }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { companyTypes } from '../dictionary'
export default {
  name: 'CompanyTypeSelector',
  model: {
    event: 'change',
    prop: 'type'
  },
  props: {
    type: { type: Number, default: null },
    placeholder: { type: String, default: null }
  },
  data: () => ({
    inner_type: null,
    companyTypes
  }),
  computed: {
    Type: {
      get() {
        return this.inner_type
      },
      set(v) {
        this.inner_type = v
        this.$emit('change', v)
      }
    }
  }
}
</script>

<style>

</style>
