<template>
  <div style="min-height:50rem">
    <transition-group name="slide-fade" mode="out-in" tag="ul" class="slide-container" @enter="enter" @before-enter="beforeEnter" @before-leave="beforeLeave">
      <li v-for="(d,index) in filtered_data" v-show="item_should_show(d)" :key="d.id" :data-index="index" class="slide-fade-item">
        <Problem :data="d" :index="index" v-bind="$props" :completed.sync="d.completed" @onSubmit="v=>onSubmit(d,v)" />
      </li>
      <li v-if="status.total<=status.solved" key="tip" class="slide-fade-item" style="text-align:center">
        <el-button type="text" @click="reset()">已完成本轮练习，再来一轮吧~</el-button>
        <div>
          <el-button type="text" :disabled="!Object.keys(wrong_current).length" @click="reset_current()">复习本轮错题</el-button>
          <el-button type="text" :disabled="!Object.keys(wrong_history).length" @click="reset_history()">再刷历史错题</el-button>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import Velocity from 'velocity-animate'
import { debounce } from '@/utils'
import { shuffle } from '@/utils/data-handle'
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
    wrong_current: {},
    wrong_history: {}
  }),
  computed: {
    current_problems () {
      return this.$store.state.problems.current_problems
    },
    options () {
      return this.$store.state.problems.current_options
    },
    problem_range() {
      const r = this.options
      return r && r.problem_range
    },
    shuffle_problem() {
      const r = this.options
      console.log('shuffle')
      return (r && r.shuffle_problem) || false
    },
    requireReset() {
      return debounce(() => { this.reset() }, 2e2)
    }
  },
  watch: {
    data: {
      handler (val) {
        this.requireReset()
      },
      immediate: true
    },
    problem_range: {
      handler(val, prev) {
        if (prev && (!val || !val.find((c, index) => c !== prev[index]))) return
        this.requireReset()
      },
      immediate: true,
      deep: true
    },
    shuffle_problem: {
      handler(val) {
        console.log('shuffle_problem', val)
        this.requireReset()
      },
      immediate: true
    },
    status: {
      handler (val) {
        if (!val) return
        this.$emit('update:status', val)
        if (val.total <= val.solved) {
          this.$store.dispatch('problems/update_database')
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    item_should_show (d) {
      const { options } = this
      let r = false
      if (options.show_only_error_current) {
        r = !!this.wrong_current[d.id]
      } else if (options.show_only_error_history) {
        r = !!this.wrong_history[d.id]
      } else {
        r = !options.kill_problem || !d.completed
      }
      return r
    },
    onSubmit (v, is_right) {
      const { status } = this
      status.solved++
      if (!is_right) {
        status.wrong++
        this.wrong_current[v.id] = true
      }
    },
    reset (data) {
      // this.filtered_data = null
      this.$store.dispatch('problems/update_database').then(() => {
        setTimeout(() => {
          this.init(data)
        }, 1e2)
      })
    },
    reset_current () {
      const dict = this.wrong_current
      return this.reset_by_dict(dict)
    },
    reset_history () {
      const dict = this.wrong_history
      return this.reset_by_dict(dict)
    },
    reset_by_dict(dict) {
      const data = this.filtered_data
        .filter(i => dict[i.id])
      return this.reset(data)
    },
    init (data) {
      const d = this.init_problems(data)
      this.init_status(d)
      this.init_wrong_set(d)
    },
    init_status (d) {
      const status = {
        total: d.length,
        solved: 0,
        wrong: 0
      }
      this.status = status
    },
    init_wrong_set (d) {
      this.wrong_current = {}
      const dict = {}
      const { current_problems } = this
      d.map(i => {
        const item = current_problems[i.id]
        if (item && item.need_practice > 0) dict[i.id] = item.need_practice
      })
      this.wrong_history = dict
    },
    do_filter_problems(problems) {
      const { problem_range, shuffle_problem } = this
      let r = problems.slice(problem_range[0], problem_range[1])
      if (shuffle_problem) r = shuffle(r)
      return r
    },
    init_problems (data) {
      let d = data || this.data || []
      d = this.do_filter_problems(d)
      d = d.map(i => {
        const r = Object.assign({ id: i.content }, i)
        r.completed = false
        return r
      })
      this.filtered_data = d
      return d
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
