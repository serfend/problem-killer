<template>
  <div class="singe-problem">
    <ProblemBase v-if="type" ref="base" v-bind="$props" :completed.sync="completed" @onSubmit="v=>$emit('onSubmit',v)">
      <component :is="type" v-bind="$props" @onUserSubmit="onSubmit" />
    </ProblemBase>
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
    ...modules,
    ProblemBase: () => import('./ProblemBase')
  },
  props: {
    show: { type: Boolean, default: true },
    data: { type: Object, default: null },
    index: { type: Number, default: null },
    options: { type: Object, default: null }
  },
  data: () => ({
    ProblemType: api.ProblemType,
    completed: false
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
  watch: {
    completed: {
      handler(val) {
        this.$emit('update:completed', val)
      },
      immediate: true
    }
  },
  methods: {
    onSubmit(v) {
      const c = this.$refs.base
      c && c.onSubmit(v)
    },
    reset() {
      this.completed = false
      const c = this.$refs.base
      c && c.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
.singe-problem{
  margin-top:1rem;
}
</style>
