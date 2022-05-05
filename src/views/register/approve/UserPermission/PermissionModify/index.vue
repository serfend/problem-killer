<template>
  <div>
    <span>权限编辑</span>
    <el-tooltip effect="light" :content="name">
      <span style="color:#c33">{{ title }} {{ value.title }}</span>
    </el-tooltip>
    <div class="card-item">
      <CompaniesSelector v-model="companies" @change="hasChange" />
    </div>
    <div class="card-item">
      <div style="margin-bottom:1rem">当前已有权限的作用范围:{{ companies.length }}条</div>
      <CompanyFormItem
        v-for="(i,index) in companies"
        :key="index"
        v-model="i.code"
        :data.sync="companies[index]"
        style="margin:0.5rem"
      >{{ i.code }}</CompanyFormItem>
    </div>
    <el-card class="card-item">
      <el-button type="success" style="width:10rem" @click="$emit('require-update')">保存</el-button>
      <el-button type="info" style="width:10rem;float:right" @click="$emit('require-close')">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import CompaniesSelector from '@/components/Company/CompaniesSelector'
import CompanyFormItem from '@/components/Company/CompanyFormItem'
export default {
  name: 'PermissionModify',
  components: {
    CompaniesSelector,
    CompanyFormItem,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    title: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    value: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    companies: [],
  }),
  watch: {
    value: {
      handler(val) {
        const p = val.permissions
        this.companies = (p && p.map((i) => ({ code: i }))) || []
      },
      immediate: true,
    },
  },
  methods: {
    hasChange() {
      this.$nextTick(() => {
        const v = this.value
        v.permissions = this.companies.map((i) => i.code)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.card-item {
  margin-top: 1rem;
}
</style>
