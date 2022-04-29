<template>
  <el-select v-model="innerData" v-bind="$attrs">
    <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script>
export default {
  name: 'Selector',
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: {
      type: [String, Number],
      default: null
    },
    option: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    innerData: null
  }),
  watch: {
    innerData: {
      handler(val) {
        this.$emit('change', val)
      }
    },
    data: {
      handler(val) {
        this.innerData = val
      }
    }
  }
}
</script>

<style>
</style>
