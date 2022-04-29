<template>
  <div>
    <div v-if="type">
      <div label-width="3rem" style="width:100%">
        <h2 v-if="showTag" style="margin-left:0.2rem">{{ type.alias }}</h2>
        <div style="height:1px;background-color:#dcdfe6;margin:0.5rem 0.2rem" />
        <SingleLineItem label="政策" :show-tag="showTag">
          <div>
            <component
              :is="showTag?'el-tag':'span'"
              v-if="type.permitCrossDay"
            >允许最多跨{{ type.permitCrossDay }}天请假</component>
            <component :is="showTag?'el-tag':'span'" v-else>不允许跨天请假</component>
            <component :is="showTag?'el-tag':'span'" v-if="type.needTrace">需要登记详细去向</component>
          </div>
        </SingleLineItem>
        <SingleLineItem label="备注" :show-tag="showTag">
          <div>
            <p v-for="(l,i) in type.description.split('\n')" :key="i">{{ l }}</p>
          </div>
        </SingleLineItem>
      </div>
    </div>
    <div v-else>无效的信息</div>
  </div>
</template>

<script>
export default {
  name: 'IndayRequestTypeDetail',
  components: { SingleLineItem: () => import('./SingleLineItem') },
  model: {
    prop: 'type',
    event: 'change'
  },
  props: {
    type: { type: Object, default: null },
    showTag: { type: Boolean, default: true },
    leftLength: { type: Number, default: 0 }
  },
  data: () => ({
    entityType: 'inday'
  })
}
</script>
<style lang="scss" >
</style>
