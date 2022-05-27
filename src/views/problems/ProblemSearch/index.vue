<template>
  <div>
    <SearchOptions v-model="search" @onSearch="onSearch" />
    <el-dialog :visible.sync="show_result" :width="device === 'mobile' ? '100%' : '50%'" append-to-body>
      <template #title>
        <h3>题库:{{ database_data.alias }}(共{{ total_data_count }}题)</h3>
      </template>
      <SearchOptions v-model="search" @onSearch="onSearch" />
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
      name: null
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
      const data = this.problems
      if (!data) return []
      const name = this.search.name
      if (!name) return data
      return data.filter(i => JSON.stringify(i).indexOf(name) > -1)
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
