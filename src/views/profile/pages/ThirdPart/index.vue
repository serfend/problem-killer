<template>
  <div>
    <Loading />
  </div>
</template>

<script>
export default {
  name: 'ThirdPart',
  label: '绑定第三方',
  icon: 'wechat',
  index: 5,
  components: {
    Loading: () => import('@/views/Loading')
  },
  methods: {}
}
</script>
