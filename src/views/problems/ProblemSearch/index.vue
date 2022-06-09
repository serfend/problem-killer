<template>
  <div>
    <SearchOptions v-model="search" @onSearch="onSearch" />
    <el-dialog :visible.sync="show_result" :width="device === 'mobile' ? '100%' : '50%'" append-to-body>
      <template #title>
        <h3>题库:{{ database_data.alias }}(共{{ total_data_count }}题)</h3>
      </template>
      <SearchOptions v-model="search" :advance="true" @onSearch="onSearch" />
      <transition-group
        name="slide-fade"
        mode="out-in"
        tag="ul"
        class="slide-container"
        @enter="enter"
        @before-enter="beforeEnter"
        @before-leave="beforeLeave"
      >
        <li v-for="(d, index) in filtered_paged_problems" :key="d.id" :data-index="index" class="slide-fade-item">
          <Problem :key="d.id" :show="true" :data="d" :only-read="true" />
        </li>
      </transition-group>
      <Pagination :pagesetting.sync="page" :total-count="filtered_problems.length" />
    </el-dialog>
  </div>
</template>

<script>
import { build_options } from './SearchOptions/options'
import { beforeLeave, enter, beforeEnter } from '../Practice/Train/ProblemList/animations'
import { mapState } from 'vuex'
import { init_problems } from '../Practice/Train/ProblemList/problem_init'
import api from '@/api/problems'
export default {
  name: 'ProblemSearch',
  components: {
    Problem: () => import('../Problem'),
    Pagination: () => import('@/components/Pagination'),
    SearchOptions: () => import('./SearchOptions')
  },
  props: {
    name: { type: String, default: null },
  },
  data: () => ({
    loading: false,
    search: {
      content: null,
      name: null,
      answer: null,
      option: null,
      count_wrong: 0,
      count_right: 0,
      count_total: 0,
    },
    database_data: {},
    problems: [],
    show_result: false,
    page: {
      pageIndex: 0,
      pageSize: 5
    },
    total_data_count: 0
  }),
  computed: {
    filtered_paged_problems () {
      const { page, filtered_problems } = this
      const start = page.pageIndex * page.pageSize
      const end = start + page.pageSize
      return filtered_problems.slice(start, end)
    },
    filtered_problems () {
      let data = this.problems
      if (!data) return []
      const options_arr = build_options(this.search)
      const options = options_arr.reduce((prev, cur) => (prev[cur.k] = cur.v) && prev, {})
      const { name, answer, option, count_wrong, count_right, count_total } = options
      console.log({ name, answer, option, count_wrong, count_right, count_total })
      if (name) {
        name.map(name => {
          name = name && name.toLocaleLowerCase()
          data = data.filter(i => i && i.content && (i.content.toLocaleLowerCase().indexOf(name) > -1))
        })
      }
      if (answer) {
        answer.map(answer => {
          answer = answer && answer.toLocaleLowerCase()
          data = data.filter(i => {
            const p_answer = i.answer
            if (!p_answer) return false
            if (p_answer.push) {
              return p_answer.find(a => `${a}`.toLocaleLowerCase().indexOf(answer) > -1)
            }
            return `${p_answer}`.toLocaleLowerCase().indexOf(answer) > -1
          })
        })
      }
      if (option) {
        option.map(option => {
          option = option && option.toLocaleLowerCase()
          data = data.filter(i => {
            const p_option = i.options
            if (!p_option) return false
            return p_option.find(a => a && (a.toLocaleLowerCase().indexOf(option) > -1))
          })
        })
      }
      if (count_wrong) {
        // not support yet
      }
      if (count_right) {
        // not support yet
      }
      if (count_total) {
        // not support yet
      }
      return data
    },
    ...mapState({
      device: (state) => state.app.device,
    })
  },
  watch: {
    name: {
      handler () {
        this.refresh()
      }, immediate: true
    }
  },
  methods: {
    beforeLeave, enter, beforeEnter,
    onSearch () {
      this.show_result = true
    },
    refresh () {
      const { name } = this
      if (!name) return
      this.loading = true
      api.get_database_detail(name).then(data => {
        this.database_data = data
        init_problems(data.problems).then(({ problems, duplicated, total_count, filter_record }) => {
          this.problems = problems
          this.total_data_count = total_count
        })
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
