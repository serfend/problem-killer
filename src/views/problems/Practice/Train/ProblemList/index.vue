<template>
  <div>
    <Problem v-for="(d,index) in data" :key="index" :data="d" />
  </div>
</template>

<script>
export default {
  name: 'ProblemList',
  components: {
    Problem: () => import('@/views/problems/Problem')
  },
  props: {
    data: { type: Array, default: () => [] }
  }
}
</script>
