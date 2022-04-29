<template>
  <CascaderSelector
    ref="companyInnerSelector"
    v-model="companySelectItem"
    :default-select-first="defaultSelectFirst"
    :child-getter-method="companyChild"
    :multiple="true"
    :placeholder="placeholder"
  />
</template>

<script>
import CascaderSelector from '@/components/CascaderSelector'
import { companyChild } from '@/api/company'
import { debounce } from '@/utils'
export default {
  name: 'CompaniesSelector',
  components: { CascaderSelector },
  model: {
    prop: 'companies',
    event: 'change'
  },
  props: {
    defaultSelectFirst: {
      type: Boolean,
      default: false
    },
    companies: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    companySelectItem: null,
    showPlaceholder: '未选择'
  }),
  computed: {
    requireCheckName() {
      return debounce(() => {
        this.checkName()
      }, 500)
    },
    placeholder() {
      const cn =
        this.companies &&
        this.companies
          .filter(i => i)
          .map(i => i.name)
          .join(',')
      return cn || this.showPlaceholder
    }
  },
  watch: {
    companySelectItem: {
      handler(val) {
        const item = val.map(i => ({
          code: i.value,
          name: i.label
        }))
        this.$emit('change', item)
      }
    },
    immediate: true,
    deep: true
  },
  methods: {
    companyChild,
    checkName() {
      const data = this.companies
      const val = this.placeholder
      if (val || !data) return
      // already implement names display remove this
      // companyDetail(data.code).then(d => {
      //   this.showPlaceholder = data.name
      // })
    }
  }
}
</script>

<style>
</style>
