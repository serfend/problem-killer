<template>
  <CascaderSelector
    ref="companyInnerSelector"
    v-model="companySelectItem"
    :child-getter-method="companyChild"
    :placeholder="value.name||placeholder"
    @change="updateItem"
  />
</template>

<script>
import CascaderSelector from '@/components/CascaderSelector'
import { companyChild, companyDetail } from '@/api/company'
import { debounce } from '@/utils'
export default {
  name: 'CompanySelector',
  components: { CascaderSelector },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: { type: Object, default: null },
    placeholder: { type: String, default: null },
    code: { type: String, default: null }
  },
  data: () => ({
    companySelectItem: null,
    value: {}
  }),
  computed: {
    requireCheckName () {
      return debounce(() => {
        this.checkName()
      }, 500)
    }
  },
  watch: {
    code: {
      handler (val) {
        this.handleDataChange({ code: val })
      },
      immediate: true
    },
    data: {
      handler (val) {
        this.handleDataChange(val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    companyChild,
    handleDataChange (val) {
      if (!val || !val.code) {
        this.value = {}
        return
      }
      companyDetail(val.code).then(d => {
        this.value = d.model
      })
    },
    updateItem (val) {
      const item = {}
      if (val) {
        item.code = val.value
        item.name = val.label
      }
      this.$emit('change', item)
      this.$emit('update:data', item)
      this.$emit('update:code', item.code)
    },
    checkName () {
      const data = this.data
      const val = this.placeholder
      if (val || !data) return
      // already implement name display , remove this
      // companyDetail(data.code).then(d => {
      //   this.showPlaceholder = data.name
      // })
    }
  }
}
</script>

<style>
</style>
