<template>
  <div>
    <h2>题库选取</h2>
    <DataBase v-for="d in database_filtered" :key="d.name" :data="d" @requireStart="requireStart(d)" />
  </div>
</template>

<script>
import { get_all_database_summary } from '../../Problem/loader'
export default {
  name: 'DataBaseSelector',
  components: {
    DataBase: () => import('./DataBase')
  },
  data: () => ({
    database: []
  }),
  computed: {
    database_filtered () {
      const d = this.database || []
      let r = d.filter(i => i).filter(i => i.problems)
      r = r.sort((a, b) => Number(a.index) - Number(b.index))
      return r
    }
  },
  mounted () {
    get_all_database_summary().then(data => {
      this.database = data
    })
  },
  methods: {
    requireStart(v) {
      this.$emit('requireStart', v)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
