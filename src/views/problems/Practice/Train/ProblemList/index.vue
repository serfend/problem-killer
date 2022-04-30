<template>
  <div style="min-height:50rem">
    <transition-group name="slide-fade" mode="out-in" tag="ul" class="slide-container" @enter="enter" @before-enter="beforeEnter">
      <li v-for="(d,index) in filtered_data" v-show="!d.completed" :key="d.id" class="slide-fade-item">
        <Problem :data="d" :index="index" v-bind="$props" :completed.sync="d.completed" />
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
    filtered_data: null
  }),
  computed: {
    options () {
      const d = this.$store.state.problems.current_info
      return d && d.train_info
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
    }
  }
}
</script>
<style lang="scss" scoped>
.slide-fade-item {
  list-style-type: none;
  transition: all ease 1s;
  font-size: 1.5rem;
  opacity: 1;
}
.slide-fade-enter, .slide-fade-leave-to{
  opacity: 0;
  transform: translateX(100%);
}
.slide-fade-leave-active {
  position: absolute;
}

</style>
