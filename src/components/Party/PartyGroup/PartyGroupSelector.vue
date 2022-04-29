<template>
  <div>
    <CompanySelector v-model="company" :style="{width}" />
    <div v-loading="loading" class="group-list">
      <PartyGroup
        v-for="i in options"
        :key="i.key"
        :data="i"
        :selected.sync="i.selected"
        :is-selector="true"
        @click="handleClick(i)"
      />
    </div>
  </div>
</template>

<script>
import { getList, groupDetail } from '@/api/zzxt/party-group'
export default {
  name: 'PartyGroupSelector',
  components: {
    CompanySelector: () => import('@/components/Company/CompanySelector'),
    PartyGroup: () => import('./index')
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    width: { type: String, default: '15rem' },
    value: { type: [String, Array], default: null },
    multi: { type: Boolean, default: false },
    levelIsSelected: { type: Boolean, default: false },
    defaultSelectFirstGroup: { type: Boolean, default: false },
    defaultSelectFirstCompany: { type: Boolean, default: true }
  },
  data: () => ({
    company: null,
    options: [],
    loading: false
  }),
  computed: {
    hasValue() {
      // 如果有值传入则不应用 默认选取
      const v = this.inner_value
      const { multi } = this
      return (!multi && v) || (multi && v && v.length)
    },
    partyGroupItemDict() {
      return this.$store.state.party.partyGroupItemDict
    },
    inner_value: {
      get() {
        return this.value
      },
      set(val) {
        const multi = this.multi
        const isArray = Array.isArray(val)
        if (isArray && !multi) val = val[0]
        else if (!isArray && multi) val = [val]
        val = val || (multi ? [] : '')
        this.$emit('update:value', val)
        this.$emit('change', val)
        this.sync_selection()
      }
    },
    currentCompany() {
      return this.$store.state.user.globalCompany
    }
  },
  watch: {
    currentCompany: {
      handler(val) {
        if (!val) return
        if (this.value) return
        this.company = { code: val }
      },
      immediate: true
    },
    value: {
      handler(val) {
        this.inner_value = val
        this.$nextTick(() => {
          this.load_group_detail().finally(() => {
            this.$nextTick(() => {
              this.sync_selection()
            })
          })
        })
      },
      immediate: true,
      deep: true
    },
    company: {
      handler(val) {
        if (!val) return
        this.load_groups(val)
        this.$emit('update:code', val && val.code)
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.$store.dispatch('party/initDictionary')
  },
  methods: {
    load_groups() {
      const company = this.company && this.company.code
      this.loading = true
      this.options = []
      getList({ company })
        .then(data => {
          this.initOptions(data.list)
          if (!this.options.length) return
          this.defaultSelect(company)
        })
        .finally(() => {
          this.loading = false
        })
    },
    initOptions(list) {
      const dictGroup = this.$store.state.party.partyGroupItemDict
      this.options = list.map((i, index) => {
        dictGroup[i.id] = i
        return i
      })
    },
    defaultSelect(company) {
      if (this.hasValue) return

      const firstItem = this.options[0]
      if (this.defaultSelectFirstGroup) this.inner_value = firstItem.id
      if (!company && this.defaultSelectFirstCompany) {
        // 未指定单位时，则获取首项的单位
        this.company = { code: firstItem.company }
      }
    },
    load_group_detail() {
      if (!this.value) return Promise.reject()
      const list = Array.isArray(this.value) ? this.value : [this.value]
      const dict = {}
      this.options.map(i => {
        dict[i.id] = true
      })
      const actions = list
        .filter(group => !dict[group])
        .map(group => {
          return new Promise((res, rej) => {
            groupDetail({ group })
              .then(data => {
                const d = data.model
                this.company = { code: d.company }
                this.options.push(d)
                res()
              })
              .catch(e => rej(e))
          })
        })
      return Promise.all(actions)
    },
    handleClick(i) {
      if (!this.multi) {
        this.remove_all_select(i)
        this.inner_value = i.selected ? i.id : null
        return
      }
      const list = this.options.filter(i => i.selected).map(i => i.id)
      this.inner_value = list
    },
    sync_selection() {
      const dict = {}
      const list = this.multi ? this.inner_value : [this.inner_value]
      list.forEach(o => {
        dict[o] = true
      })
      this.options.forEach(i => {
        this.$set(i, 'selected', !!dict[i.id])
      })
    },
    remove_all_select(i) {
      this.options.map(item => {
        if (item.id === i.id) return
        item.selected = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.group-list {
  margin-top: 1rem;
  padding: 0.2rem;
  display: flex;
  flex-wrap: wrap;
  row-gap: 1rem;
  column-gap: 0.5rem;
}
</style>
