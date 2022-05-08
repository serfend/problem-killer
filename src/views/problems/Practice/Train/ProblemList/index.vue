<template>
  <div v-loading="loading" class="problem-list" style="min-height:50rem">
    <transition-group
      name="slide-fade"
      mode="out-in"
      tag="ul"
      class="slide-container"
      @enter="enter"
      @before-enter="beforeEnter"
      @before-leave="beforeLeave"
    >
      <li
        v-for="(d, index) in focus_data"
        v-show="problem_show(d)"
        :key="d.id"
        :data-index="index"
        class="slide-fade-item"
      >
        <Problem
          :ref="`p${d.page_index}`"
          :data="d"
          :index="d.page_index"
          v-bind="$props"
          :completed.sync="d.completed"
          :focus="current_focus === d.page_index"
          @onSubmit="v => onSubmit(d, v)"
          @requireFocus="handle_focus({ index, is_manual: true })"
        />
      </li>
      <li v-if="show_completed_tip" key="tip" class="slide-fade-item" style="text-align:center">
        <el-button type="text" @click="reset()">已完成本轮练习，再来一轮吧~</el-button>
        <div>
          <el-button type="text" :disabled="!Object.keys(wrong_current).length" @click="reset_current()">复习本轮错题
          </el-button>
          <el-button type="text" :disabled="!Object.keys(wrong_history).length" @click="reset_history()">再刷历史错题
          </el-button>
        </div>
      </li>
    </transition-group>
    <el-backtop target=".train" />
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
    loading: false,
    current_focus: -1,
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
    kill_problem () {
      return this.options && this.options.kill_problem
    },
    requireReset () {
      return debounce(() => { this.reset() }, 2e2)
    },
    show_completed_tip () {
      const { status, filtered_data } = this
      if (!filtered_data || !filtered_data.length) return true
      return status.total <= status.solved
    },
    focus_data () {
      const data_list = this.filtered_data
      if (!data_list) return data_list
      const { current_focus } = this
      const { show_max_problem_range } = this.options
      const valid_range = [0, data_list.length]
      let result = []
      // 获取有效的X个题
      const get_problems = (step) => {
        let pointer = current_focus
        let counter = 0
        const r = []
        while (counter < show_max_problem_range) {
          pointer += step
          if (pointer < valid_range[0] || pointer >= valid_range[1]) break
          const item = data_list[pointer]
          if (!this.problem_show(item)) continue
          r.push(item)
          counter++
        }
        return r
      }
      result = result.concat(get_problems(-1).reverse())
      data_list[current_focus] && result.push(data_list[current_focus])
      result = result.concat(get_problems(1))
      return result
    }
  },
  watch: {
    data: {
      handler (val) {
        this.requireReset()
      },
      immediate: true
    },
    options: {
      handler (val) {
        this.requireReset()
      },
      immediate: true,
      deep: true
    },
    status: {
      handler (val) {
        if (!val) return
        this.$emit('update:status', val)
      },
      deep: true,
      immediate: true
    },
  },
  mounted () {
    document.addEventListener('keyup', this.onKeyUp)
  },
  destroyed () {
    document.removeEventListener('keyup', this.onKeyUp)
  },
  methods: {
    problem_show (d) {
      if (!d) {
        return
      }
      return !this.kill_problem || !d.completed
    },
    onKeyUp (v) {
      const { ctrlKey, shiftKey, key } = v
      if (!ctrlKey || !shiftKey) return
      const r = { is_manual: true, new_focus: 0 }
      if (key === 'ArrowUp') {
        r.new_focus = this.current_focus - 1
      } else if (key === 'ArrowDown') {
        r.new_focus = this.current_focus + 1
      }
      this.focus_next(r)
    },
    handle_focus ({ index, is_manual = false }) {
      console.log('handle_focus', index)
      if (this.current_focus === index) return
      if (is_manual) this.$message.success(`已选中第${index + 1}题，可以提交它了。`)
      this.current_focus = index
    },
    focus_next ({ new_focus, is_manual = false }) {
      const { filtered_data, current_focus } = this
      if (new_focus < 0) new_focus = 0
      if (new_focus > filtered_data.length) new_focus = filtered_data.length
      const step = current_focus > new_focus ? -1 : 1 // 方向规定
      while (filtered_data[new_focus] && filtered_data[new_focus].completed) new_focus += step // 仅显示未隐藏的
      console.log('focus next', new_focus)
      this.handle_focus({ index: new_focus, is_manual })
    },
    onSubmit (v, is_right) {
      const { status } = this
      status.solved++
      if (!is_right) {
        status.wrong++
        this.wrong_current[v.id] = true
      }
      this.focus_next({ new_focus: this.current_focus + 1 })
    },
    reset (data) {
      // this.filtered_data = null
      console.log('problem list reseting')
      this.init(data)
    },
    reset_current () {
      const dict = this.wrong_current
      return this.reset_by_dict(dict)
    },
    reset_history () {
      const dict = this.wrong_history
      return this.reset_by_dict(dict)
    },
    reset_by_dict (dict) {
      const data = this.filtered_data
        .filter(i => dict[i.id])
      return this.reset(data)
    },
    init (data) {
      this.loading = true
      this.init_problems(data).then(d => {
        this.init_status(d)
        this.init_wrong_set(d)
        setTimeout(() => {
          this.focus_next({ new_focus: 0 })
        }, 2e2)
      }).finally(() => {
        this.loading = false
      })
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
        if (item && item.combo_kill < 3 && item.wrong) dict[i.id] = item.combo_kill
      })
      this.wrong_history = dict
    },
    do_filter_problems (problems) {
      const options = this.options
      const { problem_range_start, problem_range_end, shuffle_problem, new_problem, combo_problem } = options
      const dic = this.current_problems
      let r = problems.slice(problem_range_start, problem_range_end || problems.length)
      if (shuffle_problem) r = shuffle(r)
      if (combo_problem) r = r.filter(i => ((dic[i.id] && dic[i.id].combo_kill) || 0) < combo_problem)
      if (new_problem) r = r.filter(i => !(dic[i.id] && dic[i.id].total))
      return r
    },
    init_problems (data) {
      let d = data || this.data || []
      return new Promise((res, rej) => {
        d = d.map((i, page_index) => {
          const r = Object.assign({ id: i.content, page_index }, i)
          r.completed = false
          return r
        })
        d = this.do_filter_problems(d)
        this.filtered_data = d
        return res(d)
      })
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
