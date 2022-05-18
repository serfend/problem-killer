<template>
  <div class="singe-problem" @dblclick="onClick">
    <ProblemBase v-if="type" ref="base" v-bind="$props" :completed.sync="completed" @onSubmit="v => handle_submit(v)">
      <component :is="type" v-bind="$props" slot="content" @onUserSubmit="onSubmit" />
    </ProblemBase>
    <el-popover v-else trigger="hover">
      <span class="single-invalid">{{ d }}</span>
      <template #reference>
        <el-button type="text">{{ index }}.暂不支持的题型</el-button>
      </template>
    </el-popover>
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
    focus: { type: Boolean, default: false },
    index: { type: Number, default: null },
    options: { type: Object, default: null },
    preferences: { type: Object, default: null }
  },
  data: () => ({
    ProblemType: api.ProblemType,
    completed: false,
    submitted: false
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
      handler (val) {
        this.$emit('update:completed', val)
      },
      immediate: true
    }
  },
  methods: {
    handle_submit ({ is_right, is_manual }) {
      if (this.submitted) return
      this.submitted = true
      return this.$emit('onSubmit', { is_right, is_manual })
    },
    onClick () {
      this.$emit('requireFocus')
    },
    onSubmit ({ is_right, is_manual }) {
      const c = this.$refs.base
      c && c.onSubmit({ is_right, is_manual })
    },
    reset () {
      this.completed = false
      this.submitted = false
      const c = this.$refs.base
      c && c.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
.singe-problem {
  margin-top: 1rem;
}

.single-invalid {
  font-size: 0.5rem;
  color: #ccc;
}
</style>
