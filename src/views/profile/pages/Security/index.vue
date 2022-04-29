<template>
  <div>
    <Loading />
  </div>
</template>

<script>
export default {
  name: 'Security',
  label: '账号安全',
  icon: 'safety_fill',
  index: 3,
  components: {
    Loading: () => import('@/views/Loading')
  },
  methods: {}
}
</script>
