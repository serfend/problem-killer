<template>
  <el-tag>{{ dict[data] || dict[0] }}</el-tag>
</template>

<script>
import api from '@/api/problems'
export default {
  name: 'ProblemType',
  props: {
    data: { type: Number, default: 0 }
  },
  computed: {
    dict() {
      return api.ProblemAliasReverse
    }
  }
}
</script>
