<template>
  <el-tooltip placement="right" effect="light">
    <div slot="content">
      <Duty :data="data" />
    </div>
    <el-tag>{{ data.name }}</el-tag>
  </el-tooltip>
</template>

<script>
import Duty from './index'
export default {
  name: 'DutyFormItem',
  components: { Duty },
  props: { data: { type: Object, default: () => ({ realName: 'null' }) }},
  mounted() {}
}
</script>

<style>
</style>
