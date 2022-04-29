<template>
  <div
    v-loading="loading"
    class="display-item"
  >{{ company }} load {{ loading?'pending':`${dataLength} items` }}</div>
</template>
<script>
import { groupByFiled } from '@/utils/data-handle'
import { debounce } from '@/utils'

import { apiOption } from './dataDriverApiOption'
export default {
  name: 'StatisticsDataDriver',
  props: {
    company: {
      type: String,
      default: null
    },
    companies: {
      type: Array,
      default: null
    },
    dateRange: {
      type: Object,
      default: () => ({
        start: new Date(new Date() - 7 * 86400000),
        end: new Date()
      })
    },
    memberType: {
      type: String,
      default: null
    }
  },
  data: () => ({
    loading: false,
    loadingArray: [],
    dataLength: 0,
    prevOinfo: null,
    dataIsLoading: false
  }),
  computed: {
    updatedCompanies() {
      return debounce(() => {
        return this.initCompaniesAndAppliesCount()
      }, 500)
    },
    refreshDebounceInner() {
      return debounce(() => {
        return this.refreshInner()
      }, 500)
    }
  },
  methods: {
    companyDataFilted(companyData) {
      if (!companyData) return {}
      const mType = this.memberType
      const toKeys = {}
      if (mType) toKeys[mType] = true
      else {
        for (var k of companyData.types) {
          toKeys[k] = true
        }
      }
      const result = { types: companyData.types }
      const items = Object.keys(companyData).filter(i => i !== 'types')
      for (var item of items) {
        const itemObj = companyData[item]
        let newItem = []
        const itemObjTypes = Object.keys(itemObj)
        for (k of itemObjTypes) {
          if (toKeys[k]) {
            newItem = newItem.concat(itemObj[k])
          }
        }
        result[item] = newItem
      }
      return result
    },
    refresh() {
      return this.refreshDebounceInner()
    },
    refreshInner() {
      if (this.dataIsLoading) return
      this.dataIsLoading = true
      const action = []
      action.push(this.updatedCompanies())
      Promise.all(action).then(() => {
        this.showLoading(0, false)
        setTimeout(() => {
          this.dataIsLoading = false
        }, 3000)
      })
    },
    showLoading(rank, info) {
      this.loadingArray[rank - 1] = info
      if (!info) {
        let i = 1
        while (this.loadingArray[i]) i++
        rank = i - 1
      }
      this.loadingArray = this.loadingArray.splice(0, rank)
      let oinfo = this.loadingArray.join(' ')
      if (!oinfo && this.loading) oinfo = '...'
      if (oinfo === this.prevOinfo) return
      this.prevOinfo = oinfo
      // console.log('loading modify', oinfo)
      this.$emit('update:loading', oinfo)
    },
    initCompaniesAndAppliesCount() {
      return new Promise(res => {
        this.showLoading(2, '单位信息')
        const targets = [this.company].concat(this.companies)
        targets.forEach((v, i) => {
          if (v.code) targets[i] = v.code
        })
        console.log('load targets data', targets)
        this.loadingCompany(targets).then(data => {
          const companyData = data.shift()
          const companiesData = data
          // console.log(companyData, companiesData)
          setTimeout(() => {
            this.$emit('update:companiesData', companiesData)
            res()
          }, 5000)
          this.$emit('update:companyData', companyData)
        })
      })
    },
    loadingCompany(companies, apis) {
      if (!apis) apis = apiOption
      return new Promise((res, rej) => {
        const start = this.dateRange.start
        const end = this.dateRange.end
        const action = []
        const apiCollection = Object.keys(apis)
        for (let i = 0; i < apiCollection.length; i++) {
          action.push(apis[apiCollection[i]].api(companies, start, end))
        }
        Promise.all(action).then(apiResults => {
          const result = []
          for (let i = 0; i < companies.length; i++) {
            const r = this.handleSingleCompany(apiResults, apiCollection, i)
            result.push(r)
          }
          res(result) // List<FilterData>
        })
      })
    },
    handleSingleCompany(data, apiCollection, indexOfCompany) {
      const d = {}
      for (let i = 0; i < apiCollection.length; i++) {
        const name = apiCollection[i]
        const singleCompanyData = data[i].list[indexOfCompany]
        d[name] = groupByFiled(singleCompanyData.list, 'type')
      }
      const types = {}
      Object.keys(d).forEach((dv, di, darr) => {
        Object.keys(d[dv]).forEach((v, i, arr) => {
          types[v] = true
        })
      })
      d.types = Object.keys(types)
      if (!d.types || d.types.length === 0) d.types = ['无数据']
      const filtedData = this.companyDataFilted(d)
      return filtedData
    }
  }
}
</script>
<style lang="scss" scoped>
.display-item {
  color: #aaa;
  font-size: 0.05rem;
}
</style>
