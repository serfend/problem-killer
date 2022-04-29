<template>
  <span>
    <span v-if="Array.isArray(type)&&type.length>1">
      <InnerType
        v-for="(t,index) in type"
        :key="index"
        v-bind="$props"
        :type="t"
        class="multi-items"
      />
    </span>
    <InnerType v-else-if="Array.isArray(type)" v-bind="$props" :type="type[0]" />
    <InnerType v-else v-bind="$props" />
  </span>
</template>

<script>
import defaultConfig from './config'
export default {
  name: 'BaseDictionaryType',
  components: {
    InnerType: () => import('./InnerType')
  },
  model: {
    prop: 'type',
    event: 'change'
  },
  props: {
    type: { type: [Number, Array], default: -1 },
    dictionary: { type: Object, default: null },
    config: { type: Object, default: () => defaultConfig }
  }
}
</script>
<style lang="scss" scoped>
.multi-items {
  margin-left: 0.2rem;
}
</style>
