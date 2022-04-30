<template>
  <div>
    <ProblemBase v-bind="$props">
      <span>
        <component :is="b.type" v-for="(b,bindex) in blanking" :key="bindex" v-model="user_input[b.i]" v-bind="b.attrs" :style="b.style">{{ b.value }}
        </component>
      </span>
    </ProblemBase>
  </div>

</template>

<script>
import { build_input, build_span } from '../loader'
export default {
  label: '填空',
  name: 'ProblemBlanking',
  components: {
    ProblemBase: () => import('../ProblemBase')
  },
  props: {
    data: { type: Object, default: null },
    index: { type: Number, default: null },
    options: { type: Object, default: null }
  },
  data: () => ({
    blanking: null,
    user_input: [],
  }),
  watch: {
    data: {
      handler (val) {
        this.refresh(val)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    refresh (v) {
      if (!v) {
        this.blanking = null
        return
      }
      const { content } = v
      const c = (content && `${content}。`) || null
      const b = c && c.split('{{ANS}}') || []
      if (!b.length) {
        this.blanking = null
        return
      }
      const r = []
      this.user_input = new Array(b.length - 1)
      b.map((v, index) => {
        r.push(build_span(index, v))
        r.push(build_input(index, v))
      })
      r.pop()
      this.blanking = r
    }
  }
}
</script>
<style lang="scss" scoped>
.content-container {
  display: flex;
}
</style>
