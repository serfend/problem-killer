<template>
  <div style="display:flex">
    <el-input v-model="inner_search.name" placeholder="题目内容" />
    <el-button type="primary" @click="$emit('onSearch')">搜索</el-button>
  </div>
</template>

<script>

export default {
  name: 'SearchOptions',
  model: {
    prop: 'search',
    event: 'change'
  },
  props: {
    search: { type: Object, default: null },
  },
  data: () => ({
  }),
  computed: {
    inner_search: {
      get() {
        return this.search
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
