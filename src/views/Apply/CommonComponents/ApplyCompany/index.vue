<template>
  <el-tooltip v-if="data" :hide-after="0" transition="el-zoom-in-top">
    <div slot="content">
      <div>
        <span>请假归属单位</span>
        <span>{{ data.companyOfIndayName || '无' }}</span>
      </div>
      <div>
        <span>休假归属单位</span>
        <span>{{ data.companyOfVacationName || '无' }}</span>
      </div>
      <div>
        <span>编制归属单位</span>
        <span>{{ data.companyOfManageName || '无' }}</span>
      </div>
    </div>
    <el-tag>{{ data.companyName }} {{ data.dutiesName }}</el-tag>
  </el-tooltip>
</template>

<script>
export default {
  name: 'ApplyCompany',
  props: {
    data: { type: Object, default: () => ({}) }
  }
}
</script>
