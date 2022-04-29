<template>
  <el-tooltip :content="description">
    <SvgIcon :icon-class="iconClass" />
  </el-tooltip>
</template>

<script>
import transportationType from './types.js'
export default {
  name: 'TransportationType',
  components: { SvgIcon: () => import('@/components/SvgIcon') },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: { type: Number, default: 0 }
  },
  computed: {
    type() {
      const v = this.value
      return transportationType[v] || transportationType['default']
    },
    description() {
      return this.type[1]
    },
    iconClass() {
      return this.type[0]
    }
  }
}
</script>
