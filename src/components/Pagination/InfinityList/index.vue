<template>
  <div v-infinite-scroll="refresh">
    <slot name="items" />
    <el-button v-if="haveNext" :loading="loading" type="text" style="width:100%" @click="refresh">{{ content }}</el-button>
    <FlatLine v-else />
  </div>
</template>
<script>
export default {
  name: 'InfinityList',
  components: {
    FlatLine: () => import('./FlatLine')
  },
  props: {
    immediateLoad: { type: Boolean, default: true },
    pageSize: { type: Number, default: 5 },
    loadMethod: { type: Function, default: () => { } },
    loadPayload: { type: Object, default: () => ({}) },
    loadPageMergeMethod: { type: Function, default: (payload, page) => Object.assign({ page }, payload) },
    items: { type: Array, default: () => [] }
  },
  data: () => ({
    loading: false,
    haveNext: true,
    inner_items: [],
    currentPage: 0,
  }),
  computed: {
    content () {
      const { loading } = this
      return loading ? '加载中...' : '点击加载更多记录'
    },
  },
  watch: {
    currentPage: {
      handler(v) {
        this.$emit('update:currentPage', v)
      }
    },
    inner_items: {
      handler(v) {
        this.$emit('update:items', v)
      }
    }
  },
  mounted() {
    if (!this.immediateLoad) return
    this.refresh()
  },
  methods: {
    refresh () {
      if (!this.haveNext || this.loading) return
      const { loadPayload, loadMethod, loadPageMergeMethod } = this
      if (!loadMethod) return
      const page = {
        index: this.currentPage,
        size: this.pageSize
      }
      const payload = loadPageMergeMethod(loadPayload, page)
      this.loading = true
      const f = loadMethod(payload)
      if (!f || !f.then) {
        this.loading = false
        return console.warn('invlid fetching method')
      }
      f.then(data => {
        this.haveNext = data && data.length >= this.pageSize
        if (data) {
          this.inner_items = this.inner_items.concat(data)
          this.currentPage++
        }
      }).finally(() => {
        this.$nextTick(() => {
          this.loading = false
        })
      })
    },
    reset () {
      this.inner_items = []
      this.currentPage = 0
      this.haveNext = true
    }
  },
}
</script>
