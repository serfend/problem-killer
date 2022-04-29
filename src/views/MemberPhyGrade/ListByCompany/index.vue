<template>
  <el-card>
    <Loading />
    <template slot="header">
      <h3>{{ $t('default.app.phyGrade.list.title') }}</h3>
    </template>
    <el-card>
      <el-form inline label-width="5rem">
        <el-form-item :label="$t('form.company.title')">
          <CompanySelector v-model="company" />
        </el-form-item>
        <el-form-item label="考核">施工中</el-form-item>
        <el-form-item :label="$t('form.date.title')">施工中</el-form-item>
      </el-form>
    </el-card>
  </el-card>
</template>

<script>
import CompanySelector from '@/components/Company/CompanySelector'
export default {
  name: 'ListByCompany',
  components: { CompanySelector, Loading: () => import('@/views/Loading') },
  data: () => ({
    company: null
  })
}
</script>

<style>
</style>
