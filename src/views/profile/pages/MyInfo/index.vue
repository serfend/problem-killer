<template>
  <RegFormItems
    ref="reg"
    v-model="registerForm"
    :loading.sync="loading"
    :user="currentUser"
    :is-register="false"
    :ignore-panels="['Application','Diy','Auth']"
  />
</template>

<script>
export default {
  name: 'MyInfo',
  label: '我的信息',
  icon: 'namecard',
  index: 1,
  components: {
    RegFormItems: () => import('@/views/register/register/RegFormItems')
  },
  data: () => ({
    loading: false,
    registerForm: null
  }),
  computed: {
    currentUser() {
      const query = this.$route.query.id
      return query || this.$store.state.user.userid
    }
  },
  methods: {}
}
</script>
