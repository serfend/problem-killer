<template>
  <div class="singe-problem">
    <component :is="type" v-if="type" v-bind="$props" />
    <div v-else>暂不支持的题型{{ d.type }}</div>
  </div>
</template>

<script>
import { importAllByDefault } from '@/utils/common/importAll'
const modules = importAllByDefault(require.context('.', true, /\.vue$/))
console.log(modules)
import api from '@/api/problems'
import { getTypeName } from './type_dispatch'
export default {
  name: 'Problem',
  components: {
    ...modules
  },
  props: {
    data: { type: Object, default: null },
    index: { type: Number, default: null }
  },
  data: () => ({
    ProblemType: api.ProblemType
  }),
  computed: {
    d () {
      return this.data || {}
    },
    type () {
      const { d } = this
      const t = getTypeName(d.type)
      return t
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.singe-problem{
  margin-top:1rem;
}
</style>
