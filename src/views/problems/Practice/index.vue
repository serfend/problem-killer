<template>
  <el-card>
    <DataBaseSelector v-show="showSelector" v-model="database" @requireStart="requireStart" />
    <Train v-show="!showSelector" :name="database" />
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
