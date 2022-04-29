<template>
  <div v-loading="loading">
    <Top3 :list="list_top3" style="display: flex;" />
    <Top50 :list="list_top50" :self="self" />
  </div>
</template>

<script>
import { itemMapper } from './item'
import { getRankWithSelf } from '@/api/apply/query'
import { debounce } from '@/utils'
export default {
  name: 'RankList',
  components: {
    Top3: () => import('./Top3'),
    Top50: () => import('./Top50')
  },
  props: {
    loading: { type: Boolean, default: false },
    queryForm: { type: Object, default: null },
    levelDescFunc: { type: Function, default: s => s }
  },
  data: () => ({
    list_top3: [],
    list_top50: [],
    self: null,
    totalCount: 0,
    pages: { pageIndex: 0, pageSize: 50 }
  }),
  computed: {
    requireRefresh() {
      return debounce(() => {
        this.refresh()
      }, 1e2)
    }
  },
  watch: {
    queryForm: {
      handler(val) {
        this.requireRefresh()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    refresh() {
      const page = {
        pages: this.pages
      }
      const f1 = Object.assign({}, this.queryForm)
      const f = Object.assign(f1, page)
      const func = getRankWithSelf(f)
      if (!func) return
      this.$emit('update:loading', true)
      const cb = data => {
        data = data.model
        if (!data) return this.$message.danger('加载失败')
        const list = data.list.map(c => itemMapper(c, this.levelDescFunc))
        this.totalCount = data.totalCount
        this.self = itemMapper(data.self, this.levelDescFunc)
        this.list_top3 = list.slice(0, 3)
        this.list_top50 = list.slice(3)
      }
      func.then(cb).finally(() => {
        this.$emit('update:loading', false)
      })
    }
  }
}
</script>
