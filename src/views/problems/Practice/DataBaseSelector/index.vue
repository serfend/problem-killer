<template>
  <div v-loading="loading">
    <h2>题库选取</h2>
    <div style="display:grid;grid-template-columns: min-content min-content;grid-row-gap:4rem;grid-column-gap:4rem;">
      <DataBase v-for="d in database_filtered" :key="d.name" :data="d" @requireStart="requireStart(d)" />
    </div>
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
    loading: false,
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
    requireStart (v) {
      if (!v) return
      this.loading = true
      this.$store.dispatch('problems/select_database', { database: v }).then(() => {
        this.$emit('requireStart', v)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
