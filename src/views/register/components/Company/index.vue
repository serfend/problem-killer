<template>
  <div v-if="innerForm">
    <el-form-item prop="company" label="管理单位" style="width: 25.2rem">
      <CompanySelector v-model="innerForm.company" :placeholder="innerForm.company && innerForm.company.name || '仅当前登录的用户的单位可见'" />
    </el-form-item>
    <el-form-item prop="duties" label="职务">
      <el-tooltip content="需选用下拉框中的建议" placement="right">
        <DutiesSelector v-model="innerForm.duties" class="inline-input" placeholder="请输入并选中职务名称" />
      </el-tooltip>
    </el-form-item>
    <el-form-item prop="title" label="职务等级">
      <el-tooltip content="需选用下拉框中的建议" placement="right">
        <el-autocomplete
          v-model="innerForm.title.name"
          class="inline-input"
          :fetch-suggestions="companyTitleQuery"
          style="width: 14rem"
          placeholder="请输入并选中职务等级"
        />
      </el-tooltip>
    </el-form-item>
    <el-form-item prop="titleDate" label="等级时间">
      <el-date-picker v-model="innerForm.titleDate" placeholder="职务等级生效时间" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" style="width: 14rem" />
    </el-form-item>
  </div>
</template>

<script>
const createForm = () => ({
  company: {},
  companyOfManage: {},
  duties: {},
  title: {}
})
import CompanySelector from '@/components/Company/CompanySelector'
import DutiesSelector from '@/components/Duty/DutiesSelector'
import { companyChild, companyTitleQuery } from '@/api/company'
export default {
  name: 'Company',
  components: {
    CompanySelector,
    DutiesSelector
  },
  props: {
    form: {
      type: Object,
      default: createForm()
    }
  },
  data: () => ({
    innerForm: createForm()
  }),
  watch: {
    form: {
      handler (val) {
        if (!val || !val.company) return
        this.innerForm = val
      },
      deep: true,
      immediate: true
    },
    innerForm: {
      handler (val, oldVal) {
        this.$nextTick(() => {
          this.$emit('update:form', this.innerForm)
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    companyChild,
    async companyTitleQuery (queryString, cb) {
      var data = await companyTitleQuery(queryString)
      await this.queryItem(data, cb)
    },
    async queryItem (data, cb) {
      var list = data.list
      var result = list.map(item => {
        return {
          value: item.name,
          code: item.code
        }
      })
      cb(result)
    }
  }
}
</script>

<style></style>
