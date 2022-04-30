<template>
  <div style="min-height:50rem">
    <transition-group name="slide-fade" mode="out-in" tag="ul" class="slide-container" @enter="enter" @before-enter="beforeEnter" @before-leave="beforeLeave">
      <li
        v-for="(d,index) in filtered_data"
        v-show="item_should_show(d)"
        :key="d.id"
        :data-index="index"
        class="slide-fade-item"
      >
        <Problem :data="d" :index="index" v-bind="$props" :completed.sync="d.completed" @onSubmit="v=>onSubmit(d,v)" />
      </li>
      <li v-if="status.total<=status.solved" key="tip" class="slide-fade-item" style="text-align:center">
        <el-button type="text" @click="reset">已完成本轮练习，再来一轮吧~</el-button>
      </li>
    </transition-group>
  </div>
</template>

<script>
import Velocity from 'velocity-animate'
export default {
  name: 'ProblemList',
  components: {
    Problem: () => import('@/views/problems/Problem')
  },
  props: {
    data: { type: Array, default: () => [] }
  },
  data: () => ({
    filtered_data: null,
    status: {
      total: 0,
      solved: 0,
      wrong: 0
    },
  }),
  computed: {
    options () {
      return this.$store.state.problems.current_options
    },
  },
  watch: {
    data: {
      handler (val) {
        this.reset()
      },
      immediate: true
    },
    status: {
      handler(val) {
        this.$emit('update:status', val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    item_should_show(d) {
      const { options } = this
      const r = !d.completed || !options.kill_problem
      return r
    },
    onSubmit (v, is_right) {
      const { status } = this
      status.solved++
      if (!is_right) status.wrong++
    },
    reset () {
      this.filtered_data = null
      setTimeout(() => {
        this.init()
      }, 1e2)
    },
    init() {
      let d = this.data || []
      d = d.map(i => {
        const r = Object.assign({ id: i.content }, i)
        r.completed = false
        return r
      })
      const status = {
        total: d.length,
        solved: 0,
        wrong: 0
      }
      this.status = status
      this.filtered_data = d
    },
    beforeEnter (el) {
      el.style.opacity = 0
      el.style['margin-left'] = '5rem'
    },
    enter (el, done) {
      const delay = (el.dataset.index || 0) * 150
      setTimeout(() => {
        Velocity(
          el,
          { 'margin-left': '', opacity: 1 },
          { complete: done }
        )
      }, delay)
    },
    beforeLeave (el, done) {
      return this.beforeEnter(el)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
