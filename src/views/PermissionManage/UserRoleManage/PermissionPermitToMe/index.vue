<template>
  <span style="display:flex;flex-wrap:wrap">
    <PermissionItem v-for="(p) in mypermission" :key="(p.key)" :value="p" />
  </span>
</template>

<script>
export default {
  name: 'PermissionPermitToMe',
  label: '我拥有的权限',
  components: {
    PermissionItem: () => import('./PermissionItem')
  },
  props: {
    id: { type: String, default: null }
  },
  data: () => ({}),
  computed: {
    allPermissions() {
      return this.$store.state.permission.allPermissions
    },
    mypermission: {
      get() {
        const p = this.$store.state.permission
        const up = p.user_permission
        const permissions = up && up.permissions
        const dict = {}
        if (!permissions) return dict
        permissions.map(i => {
          if (!dict[i.permission]) {
            dict[i.permission] = {
              key: i.permission,
              list: []
            }
          }
          dict[i.permission].list.push({ region: i.region, type: i.type })
        })
        return Object.values(dict)
      }
    }
  }
}
</script>
