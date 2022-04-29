<template>
  <el-select
    v-model="iTag"
    v-loading="loading"
    :remote-method="tagFilter"
    filterable
    clearable
    default-first-option
    remote
    :multiple="multiple"
    placeholder="选择类别"
    @change="tagChange"
  >
    <el-option v-for="(item,i) in tags" :key="i" :value="item" :label="item" />
  </el-select>
</template>

<script>
import { companyTag } from '@/api/company'

export default {
  name: 'CompanyTagSelector',
  model: {
    prop: 'tag',
    event: 'change'
  },
  props: {
    tag: { type: [String, Array], default: null },
    multiple: { type: Boolean, default: true }
  },
  data: () => ({
    iTag: null,
    tags: [],
    loading: false
  }),
  watch: {
    tag: {
      handler(val) {
        this.iTag = val
      },
      immediate: true
    }
  },
  mounted() {
    this.tagFilter()
  },
  methods: {
    tagChange(val) {
      this.iTag = val
      this.$emit('change', val)
    },
    tagFilter(val) {
      this.loading = true
      companyTag(val)
        .then(d => {
          this.tags = d.list
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style>
</style>
