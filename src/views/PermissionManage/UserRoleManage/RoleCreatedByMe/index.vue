<template>
  <div>1</div>
</template>

<script>
import { getPermission, getPermissionBy } from '@/api/permission'
export default {
  name: 'RoleCreatedByMe',
  label: '我创建的角色',
  data: () => ({}),
  computed: {
    allPermissions() {
      return this.$store.permission.allPermissions
    },
    userPermissionBy() {
      return this.$store.permission.user_permission_by
    }
  },
  mounted() {
    this.$store.dispatch('permission/initUserPermissionBy')
  },
  methods: {
    getPermission,
    getPermissionBy
  }
}
</script>
