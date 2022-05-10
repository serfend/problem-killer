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
          :focus="current_focus === d.id"
          @onSubmit="v => onSubmit(d, v)"
          @requireFocus="handle_focus({ id: d.id, is_manual: true })"
        />
      </li>
    </transition-group>
    <CompletionTip ref="completion_tip" @onStatus="v => $emit('onStatus', v)" @requireRestProblem="v => reset_by_dict(v)" />
    <el-backtop target=".train" />
  </div>
</template>

<script>
import { beforeLeave, enter, beforeEnter } from './animations'
import { debounce } from '@/utils'
import { shuffle } from '@/utils/data-handle'
export default {
  name: 'ProblemList',
  components: {
    Problem: () => import('@/views/problems/Problem'),
    CompletionTip: () => import('./CompletionTip')
  },
  props: {
    data: { type: Array, default: () => [] }
  },
  data: () => ({
    loading: false,
    current_focus: null,
    filtered_data: null
  }),
  computed: {
    current_index () {
      const { current_focus, filtered_data } = this
      if (!current_focus || !filtered_data) return -1
      const last_index = filtered_data.findIndex(i => i.id === current_focus)
      return last_index
    },
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
      return debounce(() => { this.reset({}) }, 2e2)
    },
    focus_data () {
      const data_list = this.filtered_data
      if (!data_list) return data_list
      const { current_index } = this
      const { show_max_problem_range } = this.options
      const valid_range = [0, data_list.length]
      let result = []
      // 获取有效的X个题
      const get_problems = (step) => {
        let pointer = current_index
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
      data_list[current_index] && result.push(data_list[current_index])
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
  },
  mounted () {
    document.addEventListener('keyup', this.onKeyUp)
  },
  destroyed () {
    document.removeEventListener('keyup', this.onKeyUp)
  },
  methods: {
    beforeEnter,
    enter,
    beforeLeave,
    problem_show (d) {
      if (!d) return
      return !this.kill_problem || !d.completed
    },
    onKeyUp (v) {
      const { ctrlKey, shiftKey, key } = v
      if (!ctrlKey || !shiftKey) return
      const r = { is_manual: true, new_focus: 0 }
      if (key === 'ArrowUp') {
        r.focus_move_step = -1
      } else if (key === 'ArrowDown') {
        r.focus_move_step = 1
      }
      this.focus_next(r)
    },
    handle_focus ({ id, is_manual = false }) {
      console.log('handle_focus', id)
      const { current_focus, filtered_data } = this
      if (current_focus === id) return
      const item = filtered_data.find(i => i.id === id)
      if (!item) return console.warn('题目不存在')
      if (is_manual) this.$message.success(`已选中第${item.page_index + 1}题，可以提交它了。`)
      this.current_focus = id
    },
    focus_next ({ focus_move_step, is_manual = false }) {
      const { filtered_data, current_index } = this
      if (focus_move_step < 0) focus_move_step = 0
      if (focus_move_step > filtered_data.length) focus_move_step = filtered_data.length
      const step = Math.sign(focus_move_step) // 方向规定
      let new_index = current_index
      while (focus_move_step !== 0) {
        new_index += step
        if (!filtered_data[new_index]) {
          return console.warn('已无题可被选中啦')
        }
        if (!filtered_data[new_index].completed) focus_move_step -= step
      }
      console.log('focus to', new_index)
      this.handle_focus({ id: filtered_data[new_index].id, is_manual })
    },
    onSubmit (v, is_right) {
      this.$refs.completion_tip.update_status({ problem: v, is_right })
      this.focus_next({ focus_move_step: 1 })
    },
    async reset ({ data, is_manual }) {
      if (is_manual) {
        const result = await this.$confirm('是否要刷新题目').catch(e => { })
        if (result !== 'confirm') return
      }
      // this.filtered_data = null
      console.log('problem list reseting')
      this.init(data)
    },
    reset_by_dict ({ dict, is_manual }) {
      const data = !dict ? null : this.filtered_data
        .filter(i => dict[i.id])
      return this.reset({ data, is_manual })
    },
    init (data) {
      this.loading = true
      this.init_problems(data).then(d => {
        this.$refs.completion_tip.init_status(d)
        this.$refs.completion_tip.init_wrong_set(d)
        setTimeout(() => {
          const item = this.filtered_data[0]
          if (!item) return
          this.handle_focus({ id: item.id })
        }, 2e2)
      }).finally(() => {
        this.loading = false
      })
    },
    do_filter_problems (problems) {
      const options = this.options
      const { problem_range_start, problem_range_end, shuffle_problem, new_problem, combo_problem, problem_max_num } = options
      const dic = this.current_problems
      let r = problems.slice(problem_range_start, problem_range_end || problems.length)
      if (shuffle_problem) r = shuffle(r)
      if (combo_problem) r = r.filter(i => ((dic[i.id] && dic[i.id].combo_kill) || 0) < combo_problem)
      if (new_problem) r = r.filter(i => !(dic[i.id] && dic[i.id].total))
      if (problem_max_num > 0) r = r.slice(0, problem_max_num)
      return r
    },
    init_problems (data) {
      let d = data || this.data || []
      return new Promise((res, rej) => {
        const id_dict = {}
        d = d.map((i) => {
          const r = Object.assign({}, i) // 创建新的题目对象
          if (!r.id) r.id = `${i.content}${JSON.stringify(i.answer)}` // 若题目没有定义id，则通过题目内容创建id
          if (id_dict[r.id]) {
            return null // 如果id重复，则标记题目为待删除
          }
          id_dict[r.id] = r // 将题目加入重复判断字典中
          r.completed = false
          return r
        }).filter(i => i)
        d = this.do_filter_problems(d)
        d = d.map((i, page_index) => Object.assign({ page_index }, i)) // 初始化题目的页面位置
        this.filtered_data = d
        return res(d)
      })
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
