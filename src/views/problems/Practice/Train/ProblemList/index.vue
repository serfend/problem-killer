<template>
  <div>
    <div v-for="(d,index) in data" :key="index">
      <Problem :data="d" :index="index" />
    </div>
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
