<template>
  <el-tooltip :content="`${onlyTag?'从下拉框中选取类别':'先选中类别后，再选中职务'}`">
    <span>
      <el-select
        v-model="iTag"
        :remote-method="tagFilter"
        filterable
        clearable
        default-first-option
        remote
        placeholder="选择类别"
        style="width:8rem"
        @change="tagChange"
      >
        <el-option v-for="(item,i) in tags" :key="i" :value="item" :label="item" />
      </el-select>
      <el-autocomplete
        v-if="!onlyTag"
        v-model="iDuties"
        class="inline-input"
        :fetch-suggestions="dutiesQuery"
        :placeholder="dutiesIsObj?duties.name:(duties?duties.map(i=>i.name).join(' '):'搜索并选择职务')"
        style="width:12rem"
        @select="handleDutiesSelect"
      />
    </span>
  </el-tooltip>
</template>

<script>
import { dutiesQuery, dutiesTag } from '@/api/company'
export default {
  name: 'DutiesSelector',
  model: {
    prop: 'duties',
    event: 'change'
  },
  props: {
    onlyTag: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: null
    },
    duties: {
      type: [Array, Object],
      default: null
    }
  },
  data: () => ({
    iDuties: null,
    iTag: null,
    tags: []
  }),
  computed: {
    dutiesIsObj() {
      const list = this.duties
      if (!list) return false
      return Object.prototype.toString.call(list) === '[object Object]'
    }
  },
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
      this.$emit('update:tag', val)
      this.$emit('tagChange', val)
      this.iDuties = null
    },
    tagFilter(val) {
      dutiesTag(val).then(d => {
        this.tags = d.list
        this.iDuties = null
      })
    },
    async dutiesQuery(queryString, cb) {
      const data = await dutiesQuery(queryString, this.iTag)
      await this.queryItem(data, cb)
    },
    async queryItem(data, cb) {
      const list = data.list
      const result = list.map(item => {
        return {
          value: item.name,
          code: item.code
        }
      })
      cb(result)
    },
    handleDutiesSelect(val) {
      const list = this.duties
      const isObj = this.dutiesIsObj
      const c = {
        name: val.value,
        code: val.code
      }
      if (list && !isObj) {
        const existed = list.map(i => i.code).indexOf(c.code)
        if (existed > -1) {
          return this.$message.warning(`已存在${c.name}`)
        }
      }
      this.$message.success(`已选中${c.name}(${c.code})`)
      this.$emit('change', isObj || !list ? c : list.concat([c]))
    }
  }
}
</script>

<style>
</style>
