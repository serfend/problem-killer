
<template>
  <ScorePair
    v-model="rawScore"
    :score-pair.sync="currentStandard.gradePairs"
    :score-pair-arr.sync="scorePair"
    :expression-when-full-grade="currentStandard.expressionWhenFullGrade"
    @change="handleScoreChange"
  />
</template>
<script>
import ScorePair from '../components/ScorePair'
import { debounce } from '@/utils'
export default {
  name: 'SinglePhySubject',
  components: { ScorePair },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: {
      type: Object,
      default: null
    },
    age: {
      type: Number,
      default: 0
    },
    rawValue: {
      type: String,
      default: null
    }
  },
  data: () => ({
    scorePair: null,
    rawScore: ''
  }),
  computed: {
    requireUpdateRawValue() {
      return debounce(() => {
        this.updateRawValue()
      }, 500)
    },
    currentStandard() {
      const age = this.age
      const standards = this.data.standards
      if (!standards) return null
      for (let i = 0; i < standards.length; i++) {
        const s = standards[i]
        if (s.maxAge >= age && s.minAge <= age) return s
      }
      return null
    },
    standardRawValue() {
      const c = this.currentStandard
      if (!c) return null
      const s = this.scorePair
      if (!s) return null
      const base = c.baseStandard.toString()
      const r = s.filter(i => i[1] && i[1] === base)
      if (r.length === 0) return s[0][0]
      return r[0][0]
    },
    requireUpdateBase() {
      return debounce(() => {
        this.updateBase()
      }, 1000)
    }
  },
  watch: {
    data: {
      handler(val) {
        this.requireUpdateBase()
      },
      immediate: true
    },
    rawValue: {
      handler(val) {
        this.requireUpdateRawValue()
      },
      immediate: true
    }
  },
  methods: {
    updateRawValue(val) {
      val = val === undefined ? this.rawValue : val
      this.rawScore = val
      this.$emit('update:data', Object.assign(this.data, { rawValue: val }))
      this.$nextTick(() => {
        this.$emit('gradechange', val)
      })
    },
    updateBase() {
      this.$emit('update:rawValue', this.standardRawValue)
    },
    handleScoreChange(val) {
      this.$emit('update:rawValue', val)
      this.updateRawValue(val)
    }
  }
}
</script>

<style>
</style>
