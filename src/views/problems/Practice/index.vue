<template>
  <el-card>
    <DataBaseSelector v-show="showSelector" v-model="database" @requireStart="requireStart" />
    <div class="train-container">
      <Train v-show="!showSelector" :name="database" class="train" />
    </div>
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
    requireStart(v) {
      this.database = v.name
      this.showSelector = false
    }
  }
}
</script>
<style lang="scss" scoped>
.train-container{
  display: flex;
    justify-content: center;
}
.train {
  width: 60rem;
}
</style>
