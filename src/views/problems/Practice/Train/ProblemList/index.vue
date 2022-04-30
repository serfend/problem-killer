<template>
  <div style="min-height:50rem">
    <transition-group name="slide-fade" mode="out-in" tag="ul" class="slide-container" @enter="enter" @before-enter="beforeEnter" @before-leave="beforeLeave">
      <li v-for="(d,index) in filtered_data" v-show="(!d.completed||!options.kill_problem)&&should_show" :key="d.id" :data-index="index" class="slide-fade-item">
        <Problem :data="d" :index="index" v-bind="$props" :completed.sync="d.completed" />
      </li>
      <li v-if="left_count">1</li>
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
    left_count: 0,
    inner_should_show: false
  }),
  computed: {
    should_show: {
      get() {
        return this.inner_should_show
      },
      set(v) {
        this.inner_should_show = v
      }
    },
    options () {
      return this.$store.state.problems.current_options
    },
  },
  watch: {
    data: {
      handler (val) {
        let d = this.data || []
        d = d.map(i => {
          const r = Object.assign({ id: i.content, completed: false }, i)
          return r
        })
        this.filtered_data = d
        setTimeout(() => {
          this.should_show = true
        }, 1e3)
      },
      immediate: true
    }
  },
  methods: {
    beforeEnter (el) {
      el.style.opacity = 0
      el.style['margin-left'] = '5rem'
    },
    enter (el, done) {
      const delay = el.dataset.index * 150
      setTimeout(() => {
        Velocity(
          el,
          { 'margin-left': '', opacity: 1 },
          { complete: done }
        )
      }, delay)
    },
    beforeLeave(el, done) {
      return this.beforeEnter(el)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
