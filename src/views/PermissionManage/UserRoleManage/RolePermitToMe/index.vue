<template>
  <div>1</div>
</template>

<script>
export default {
  name: 'RolePermitToMe',
  label: '赋予我的角色',
  data: () => ({}),
  computed: {
    allPermissions() {
      return this.$store.permission.allPermissions
    },
    userPermission() {
      const p = this.$store.state.permission
      const up = p.user_permission
      return up && up.roles
    }
  },
  mounted() {
    this.$store.dispatch('permission/initUserPermission')
  }
}
</script>
