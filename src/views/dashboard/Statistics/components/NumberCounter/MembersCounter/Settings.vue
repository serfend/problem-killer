<template>
  <div>
    <div v-for="(item, index) in data" :key="index">
      <SingleSetting :value.sync="data[index]" @deleted="deleteItem(index)" />
    </div>
    <el-button type="success" icon="el-icon-plus" style="width: 100%" @click="addNew">添加</el-button>
  </div>
</template>

<script>
import SingleSetting from './SingleSetting'
export default {
  name: 'MembersCardSetting',
  components: { SingleSetting },
  model: {
    prop: 'data',
    event: 'change',
  },
  props: {
    data: {
      type: Array,
      default: null,
    },
  },
  methods: {
    addNew() {
      const newData = this.data
      newData.push({})
      this.$emit('update:data', newData)
    },
    deleteItem(index) {
      const newData = this.data
      newData.splice(index, 1)
      this.$emit('update:data', newData)
    },
  },
}
</script>

<style></style>
