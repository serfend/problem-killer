<template>
  <div v-loading="loading">
    <el-input v-if="showInput" v-model="rawScore" placeholder="输入成绩" @input="handleScoreChange" />
    <el-slider
      v-if="iScorePair"
      v-model="nowIndex"
      :min="0"
      :max="(iScorePair.length-1)<0?0:(iScorePair.length-1)"
      :format-tooltip="format"
    />
    <div v-if="showEditor">
      <el-row v-for="(p,i) in iScorePair" :key="i">
        <el-input v-model="p[0]" placeholder="成绩" style="width:5rem" />
        <el-input v-model="p[1]" placeholder="得分" style="width:5rem" />
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScorePair',
  model: {
    prop: 'rawValue',
    event: 'change'
  },
  props: {
    showInput: {
      type: Boolean,
      default: true
    },
    showEditor: {
      type: Boolean,
      default: false
    },
    scorePair: {
      type: String,
      default: null
    },
    scorePairArr: {
      type: Array,
      default: null
    },
    expressionWhenFullGrade: {
      type: String,
      default: null
    },
    rawValue: {
      type: String,
      default: null
    }
  },
  data: () => ({
    loading: false,
    nowIndex: 0,
    rawScore: '',
    iScorePair: []
  }),
  computed: {
    listScorePair() {
      const s = this.scorePair
      if (!s) return []
      const list = s
        .split('|')
        .map(i => i.split(':'))
        .sort((a, b) => a[1] - b[1])
      list.push(['满分后', this.expressionWhenFullGrade])
      return list
    },
    stringScorePair() {
      const val = this.iScorePair
      let result
      if (!val) result = ''
      else {
        result = val
          .filter((v, i) => i < val.length - 1)
          .map(i => i.join(':'))
          .join('|')
      }
      return result
    }
  },
  watch: {
    scorePair: {
      handler(val) {
        this.loading = true
        setTimeout(() => {
          this.iScorePair = this.listScorePair
          this.$emit('update:scorePairArr', this.iScorePair)
          this.loading = false
        }, 500)
      },
      immediate: true
    },
    iScorePair: {
      handler(val) {
        setTimeout(() => {
          const s = this.stringScorePair
          this.$emit('update:scorePair', s)
        }, 500)
      },
      immediate: true,
      deep: true
    },
    rawValue: {
      handler(val) {
        this.rawScore = val
      },
      immediate: true
    }
  },
  methods: {
    format(val) {
      const item = this.iScorePair[val]
      if (!item) return `无${val}的标准`
      return `标准:${item[0]} 得分:${item[1]}`
    },
    handleScoreChange(val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style>
</style>

