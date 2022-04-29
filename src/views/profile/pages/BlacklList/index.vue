<template>
  <div>
    <Loading />
  </div>
</template>

<script>
export default {
  name: 'BlackList',
  label: '黑名单管理',
  icon: 'warn_fill',
  index: 4,
  components: {
    Loading: () => import('@/views/Loading')
  },
  methods: {}
}
</script>
