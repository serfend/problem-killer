<template>
  <div v-loading="loading">
    <Loading />
  </div>
</template>

<script>
export default {
  name: 'CompanyManager',
  components: {
    Loading: () => import('@/views/Loading')
  },
  data: () => ({
    loading: false
  })
}
</script>
