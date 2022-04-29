<template>
  <div>
    <div v-if="type">
      <div label-width="3rem">
        <h2 v-if="showTag" style="margin-left:0.2rem">{{ type.alias }}</h2>
        <div style="height:1px;background-color:#dcdfe6;margin:0.5rem 0.2rem" />
        <SingleLineItem label="类型" :show-tag="showTag">
          <component
            :is="showTag?'el-tag':'span'"
            :type="type.primary?'primary':'danger'"
          >{{ type.primary?'主假期':'非主假期' }}</component>
        </SingleLineItem>
        <SingleLineItem label="天数" :show-tag="showTag">
          <span>{{ type.minLength }}天到{{ type.primary?'剩余假期天数':`${type.maxLength}天` }}</span>
        </SingleLineItem>
        <SingleLineItem label="政策" :show-tag="showTag">
          <div>
            <component :is="showTag?'el-tag':'span'" v-if="!type.allowBeforePrimary">仅正休结束后可提交</component>
            <component :is="showTag?'el-tag':'span'" v-if="!type.caculateBenefit">无福利假</component>
            <component :is="showTag?'el-tag':'span'" v-if="!type.canUseOnTrip">无路途</component>
            <component :is="showTag?'el-tag':'span'" v-if="type.minusNextYear">次年扣正休</component>
            <component :is="showTag?'el-tag':'span'" v-if="type.notPermitCrossYear">不允许跨年</component>
          </div>
        </SingleLineItem>
        <SingleLineItem label="备注" :show-tag="showTag">
          <div v-for="(l,i) in type.description.split('\n')" :key="i">{{ l }}</div>
        </SingleLineItem>
      </div>
    </div>
    <div v-else>无效的信息</div>
  </div>
</template>

<script>
export default {
  name: 'VacationTypeDetail',
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
