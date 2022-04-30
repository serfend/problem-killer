<template>
  <el-card>
    <transition-group name="slide-fade">
      <DataBaseSelector v-if="showSelector" key="2" v-model="database" @requireStart="requireStart" />
      <div v-if="!showSelector" key="1">
        <el-button type="danger" style="margin-bottom:0.5rem" @click="requireStart()">返回</el-button>
        <Train :name="database" />
      </div>
    </transition-group>
  </el-card>
</template>

<script>
export default {
  name: 'Practice',
  components: {
    DataBaseSelector: () => import('./DataBaseSelector'),
    Train: () => import('./Train')
  },
  data: () => ({
    database: null,
    showSelector: true
  }),
  methods: {
    requireStart (v) {
      if (v) this.database = v.name
      this.showSelector = !v
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
