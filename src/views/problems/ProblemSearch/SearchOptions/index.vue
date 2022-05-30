<template>
  <div>
    <div style="display:flex">
      <el-input v-model="inner_search.content" placeholder="题目内容" @keyup.enter.native="handleSearch" @change="generateOptionByResult" />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button v-if="advance && !show_advance" type="text" @click="show_advance=!show_advance">高级</el-button>
    </div>
    <el-card v-if="advance&&show_advance" style="margin-top:1rem">
      <template #header>
        <div style="display: flex;justify-content: space-between;">
          <h3>高级搜索</h3>
          <el-button v-if="show_advance" type="text" @click="show_advance=!show_advance">隐藏</el-button>
        </div>
      </template>
      <el-form label-width="7rem">
        <el-form-item label="按题干">
          <el-input v-model="inner_search.name" placeholder="高级搜索为 name:xxx;xxx;xxx" @change="generateResultByOption" />
        </el-form-item>
        <el-form-item label="按答案">
          <el-input v-model="inner_search.answer" placeholder="高级搜索为 answer:xxx;xxx;xxx" @change="generateResultByOption" />
        </el-form-item>
        <el-form-item label="按选项">
          <el-input v-model="inner_search.option" placeholder="高级搜索为 option:xxx;xxx;xxx" @change="generateResultByOption" />
        </el-form-item>
        <el-form-item label="按正确次数">
          <el-input-number v-model="inner_search.count_right" :disabled="true" :min="0" @change="generateResultByOption" />
        </el-form-item>
        <el-form-item label="按错误次数">
          <el-input-number v-model="inner_search.count_wrong" :disabled="true" :min="0" @change="generateResultByOption" />
        </el-form-item>
        <el-form-item label="按做题次数">
          <el-input-number v-model="inner_search.count_total" :disabled="true" :min="0" @change="generateResultByOption" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { generateResultByOption, generateOptionByResult } from './options'
export default {
  name: 'SearchOptions',
  model: {
    prop: 'search',
    event: 'change'
  },
  props: {
    search: { type: Object, default: null },
    advance: { type: Boolean, default: false }
  },
  data: () => ({
    show_advance: false
  }),
  computed: {
    inner_search: {
      get() {
        return this.search
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  methods: {
    handleSearch() {
      this.$emit('onSearch')
    },
    generateResultByOption() {
      generateResultByOption(this.inner_search)
      this.handleSearch()
    },
    generateOptionByResult() {
      generateOptionByResult(this.inner_search)
      this.handleSearch()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
