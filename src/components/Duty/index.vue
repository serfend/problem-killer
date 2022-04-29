<template>
  <div>
    <el-card>
      <template slot="header">
        <h2>
          <el-tag v-if="data.isMajorManager">主官</el-tag>
          <el-tag v-else type="info">非主官</el-tag>
          {{ data.name }}
        </h2>
      </template>
      <el-form style="width:250px">
        <el-form-item label="代码">{{ data.code }}</el-form-item>
        <el-form-item label="类别">
          <el-tag v-if="data.tags.length==0" type="info">无</el-tag>
          <el-tag v-for="i in data.tags" v-else :key="i">{{ i }}</el-tag>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Duty',
  props: {
    data: { type: Object, default: () => ({ name: 'null' }) }
  }
}
</script>

<style>
</style>
