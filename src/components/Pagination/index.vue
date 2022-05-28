<template>
  <div v-show="!hidden" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page="innerPages.pageIndex"
      :page-size="innerPages.pageSize"
      :small="small"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="totalCount"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    pagesetting: { required: true, type: Object, default: () => this.innerPages },
    pageSizes: { type: Array, default() { return [5, 10, 20, 30, 50, 100] }
    },
    totalCount: { type: Number, default: 0 },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: { type: Boolean, default: false },
    autoScroll: { type: Boolean, default: true },
    hidden: { type: Boolean, default: false },
    small: { type: Boolean, default: false }
  },
  data() {
    return {
      innerPages: { pageIndex: 1, pageSize: 10, totalCount: 0 }
    }
  },
  watch: {
    pagesetting: {
      handler(val) {
        const p = this.innerPages
        p.pageIndex = val.pageIndex + 1
        p.pageSize = val.pageSize
        this.checkTotalCount()
      },
      deep: true,
      immediate: true
    },
    totalCount: {
      handler(val) {
        this.checkTotalCount()
      },
      immediate: true
    }
  },
  methods: {
    checkTotalCount() {
      const p = this.innerPages
      if ((p.pageIndex - 1) * p.pageSize > this.totalCount) {
        p.pageIndex = Math.ceil(this.totalCount / p.pageSize)
        this.handleChange()
      }
    },
    handleSizeChange(val) {
      this.innerPages.pageSize = val
      this.handleChange()
    },
    handlePageChange(val) {
      this.innerPages.pageIndex = val
      this.handleChange()
    },
    handleChange() {
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
      this.$emit('update:pagesetting', {
        pageSize: this.innerPages.pageSize,
        pageIndex: this.innerPages.pageIndex - 1
      })
    }
  }
}
</script>

<style scoped>
</style>
