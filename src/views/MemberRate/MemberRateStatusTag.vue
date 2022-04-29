<template>
  <el-tooltip v-if="i" :content="i.description" :disabled="!i.description">
    <el-tag>{{ i.alias }}</el-tag>
  </el-tooltip>
</template>

<script>
export default {
  name: 'MemberRateStatusTag',
  model: {
    prop: 'score',
    event: 'change'
  },
  props: {
    score: { type: Number, default: -1 }
  },
  data: () => ({}),
  computed: {
    statusDict() {
      return this.$store.state.memberRate.levelAssignStatusDict
    },
    i() {
      const s = this.statusDict
      if (!s) return null
      const i = Object.values(s)
        .sort((a, b) => a.value - b.value)
        .find(i => i.value >= this.score)
      return i
    }
  },
  mounted() {
    this.$store.dispatch('memberRate/initLevelAssignStatusDict').then(() => {})
  }
}
</script>
