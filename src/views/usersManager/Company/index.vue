<template>
  <div>
    <el-card>
      <el-card style="margin-top:1rem">
        <el-switch v-model="asManage" active-text="按编制单位" inactive-text="按管理单位" />
        <CompanyTreeSelector v-model="nowCompany" />
      </el-card>
    </el-card>
  </div>
</template>

<script>
import CompanyTreeSelector from '@/components/Company/CompanyTreeSelector'
import { companyDetail, Managers, getMembers } from '@/api/company'
export default {
  name: 'Company',
  components: { CompanyTreeSelector },
  data: () => ({
    nowCompany: null,
    asManage: false,
    detail: null,
    members: null,
    membersPage: {
      pageIndex: 0,
      pageSize: 20
    },
    memberTotal: 0,
    managers: null
  }),
  computed: {
    memberQuery() {
      const c = this.nowCompany
      const { asManage } = this
      return Object.assign({ code: c.code, asManage }, this.membersPage)
    }
  },
  watch: {
    nowCompany: {
      handler(val) {
        this.$nextTick(() => {
          this.updateCompany()
        })
      }
    }
  },
  methods: {
    updateCompany() {
      const c = this.nowCompany.code
      companyDetail(c).then(detail => (this.detail = detail.model))
      getMembers(this.memberQuery).then(members => {
        this.members = members.list
        this.memberTotal = members.totalCount
      })
      Managers(c).then(managers => (this.managers = managers.list))
    }
  }
}
</script>

<style>
</style>

