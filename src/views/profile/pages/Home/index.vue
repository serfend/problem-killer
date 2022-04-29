<template>
  <div>
    <Loading />
  </div>
</template>

<script>
export default {
  name: 'Home',
  label: '首页',
  icon: 'threeline_fill',
  index: 0,
  components: {
    Loading: () => import('@/views/Loading')
  },
  methods: {}
}
</script>
