<template>
  <div>
    <transition-group
      name="slide-fade"
      tag="ul"
      class="slide-container"
      @enter="enter"
      @before-enter="beforeEnter"
    >
      <Problem v-for="(d,index) in filtered_data" v-show="!d.completed" :key="d.id" :data="d" :index="index" v-bind="$props" :completed.sync="d.completed" />
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
  computed: {
    options() {
      const d = this.$store.state.problems.current_info
      return d && d.train_info
    },
    filtered_data() {
      const d = this.data || []
      return d.map(i => Object.assign({ id: i.content, completed: false }, i))
    }
  },
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0
      el.style['margin-left'] = '5rem'
    },
    enter(el, done) {
      const delay = el.dataset.index * 150
      setTimeout(() => {
        Velocity(
          el,
          { 'margin-left': '', opacity: 1 },
          { complete: done }
        )
      }, delay)
    }
  }
}
</script>
