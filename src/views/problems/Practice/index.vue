<template>
  <el-card>
    <h2>刷题</h2>
    <el-form label-width="5rem">
      <DataBaseSelector v-model="database" />
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'Practice',
  components: {
    DataBaseSelector: () => import('./DataBaseSelector')
  },
  data: () => ({
    database: null
  })
}
</script>
