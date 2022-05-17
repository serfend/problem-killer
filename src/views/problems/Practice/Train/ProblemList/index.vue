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
          :preferences="preferences"
          @onSubmit="v => onSubmit(d, v)"
          @requireFocus="handle_focus({ id: d.id, is_manual: true })"
        />
      </li>
    </transition-group>
    <CompletionTip
      ref="completion_tip"
      @onStatus="v => $emit('onStatus', v)"
      @requireResetProblem="v => reset_by_dict(v)"
    />
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
    filtered_data: null,
    total_data_count: 0,
    filter_record: {}
  }),
  computed: {
    preferences() {
      const p = this.$store.state.problems.preferences
      const practice = p && p.practice
      return practice
    },
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
      this.filtered_data = null
      console.log('problem list reseting')
      this.$nextTick(() => {
        this.init(data)
      })
    },
    reset_by_dict ({ dict, is_manual }) {
      const data = !dict ? null : this.filtered_data
        .filter(i => dict[i.id] !== undefined).map(i => {
          delete i.page_index
          return i
        })
      return this.reset({ data, is_manual })
    },
    init (data) {
      if (!this.options) return this.$emit('requireInit')
      this.loading = true
      this.init_problems(data).then(({ prblems, duplicated }) => {
        this.$refs.completion_tip.init_status({ prblems, duplicated })
        this.$refs.completion_tip.init_wrong_set(prblems)
        setTimeout(() => {
          const hide_count = this.total_data_count - this.filtered_data.length
          const { filter_record } = this
          if (hide_count > 0) {
            this.$notify.warning({
              title: `${hide_count}道题被隐藏啦~`,
              message: Object.keys(filter_record).map(i => `${i}:${filter_record[i]}道`).join(';')
            })
          }
          const item = this.filtered_data[0]
          if (!item) return
          this.handle_focus({ id: item.id })
        }, 2e2)
      }).finally(() => {
        this.loading = false
      })
    },
    filter_with_record({ items, predict, reason, is_init }) {
      if (is_init) {
        this.filter_record = {}
        return
      }
      const previous_count = items.length
      items = predict(items)
      const current_count = items.length
      const result = previous_count - current_count
      if (result === 0) return items
      this.filter_record[reason] = result
      return items
    },
    do_filter_problems (problems) {
      const options = this.options
      const { problem_range_start, problem_range_end, shuffle_problem, shuffle_problem_options, new_problem, combo_problem, problem_max_num } = options
      const dic = this.current_problems
      this.filter_with_record({ is_init: true })
      let items = problems
      items = this.filter_with_record({ items, predict: v => v.filter(i => i), reason: '重复的题目' })
      items = this.filter_with_record({ items, predict: v => v.slice(problem_range_start - 1, problem_range_end || v.length), reason: '筛选题目范围' })
      if (shuffle_problem) items = shuffle(items)
      this.do_shuffle_options(items, shuffle_problem_options)
      this.do_attach_analysis(items)
      if (combo_problem) items = this.filter_with_record({ items, predict: v => v.filter(i => ((dic[i.id] && dic[i.id].combo_kill) || 0) < combo_problem), reason: '筛选连对' })
      if (new_problem) items = this.filter_with_record({ items, predict: v => v.filter(v.filter(i => !(dic[i.id] && dic[i.id].total))), reason: '筛选新题' })
      if (problem_max_num > 0) this.filter_with_record({ items, predict: v => v.slice(0, problem_max_num), reason: '筛选最大刷题数' })
      return items
    },
    do_attach_analysis (r) {
      r.map(i => {
        if (!i.options) return
        let { analysis } = i
        if (!analysis) {
          i.analysis = '暂无题解'
          return
        }
        if (i.option_map) {
          i.option_map.map((i, index) => {
            analysis = analysis.replace(`{{OPT:${i + 1}}}`, `[${index + 1}]`)
          })
          i.analysis = analysis
        }
      })
    },
    do_shuffle_options (r, is_to_shuffle) {
      const convert = (map_to, options, answers) => {
        const new_options = options.map((i, index) => {
          const new_index = map_to[index]
          return options[new_index]
        })
        const map_to_dict = {}
        map_to.map((i, index) => {
          map_to_dict[i] = index
        })
        const single_map = i => map_to_dict[i - 1] + 1
        const new_answers = answers.length ? answers.map(single_map).sort((a, b) => a - b) : single_map(answers)
        return [new_options, new_answers]
      }
      r.map(i => {
        if (!i.options) return
        const { options } = i
        let { answer, analysis } = i
        const check_answer = a => a > 0 && a <= options.length
        if (answer.length) {
          // 多选题判断选项合法性
          answer = answer.filter(check_answer)
          if (!answer.length) {
            answer = [1] // 否则设置答案为A
            analysis = `(该题答案存在问题)${analysis}`
          }
        } else if (!check_answer(answer)) {
          // 单选题判断选项合法性
          answer = 1 // 否则将答案设置为A
          analysis = `(该题答案存在问题)${analysis}`
        }
        let option_map = new Array(options.length).fill(0).map((i, index) => index)
        // 如果需要打乱选项
        if (is_to_shuffle) {
          console.log('start shuffle options')
          option_map = shuffle(option_map)
          const r = convert(option_map, options, answer, analysis)
          i.options = r[0]
          i.answer = r[1]
        }
        i.option_map = option_map
      })
    },
    init_problems (data) {
      let prblems = data || this.data || []
      return new Promise((res, rej) => {
        const id_dict = {}
        this.total_data_count = prblems.length
        prblems = prblems.map((i) => {
          const r = Object.assign({}, i) // 创建新的题目对象
          // 若题目没有定义id，则通过题目内容创建id
          // TODO 此处应该再按题目内容加入去重筛选
          if (!r.id) r.id = `${i.content}${JSON.stringify(i.answer)}`
          if (id_dict[r.id]) {
            id_dict[r.id]++
            return null // 如果id重复，则标记题目为待删除
          }
          id_dict[r.id] = 1 // 将题目加入重复判断字典中
          r.completed = false
          return r
        })
        prblems = this.do_filter_problems(prblems)
        prblems = prblems.map((i, page_index) => Object.assign({ page_index }, i)) // 初始化题目的页面位置
        this.filtered_data = prblems
        return res({ prblems, duplicated: id_dict })
      })
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
