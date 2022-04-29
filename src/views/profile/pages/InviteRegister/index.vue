<template>
  <div>
    <Loading />
  </div>
</template>

<script>
export default {
  name: 'InviteRegister',
  label: '邀请注册',
  icon: 'invite_fill',
  index: 6,
  components: {
    Loading: () => import('@/views/Loading')
  },
  methods: {}
}
</script>
