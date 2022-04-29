<template>
  <div v-loading="loading">
    <el-form style="margin-bottom:1rem">
      <AuthCode v-model="auth" select-name="用户权限编辑" />
    </el-form>
    <el-card style="margin-top:1rem">
      <span slot="header">单位管理</span>
      <CompanyManager :user-id="userId" :auth="auth" />
    </el-card>
    <el-card style="margin-top:1rem">
      <span slot="header">角色管理</span>
      <RoleManager :user-id="userId" :auth="auth" />
    </el-card>
    <el-card style="margin-top:1rem">
      <span slot="header">权限管理</span>
      <PermissionManager :user-id="userId" :auth="auth" />
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserPermission',
  components: {
    AuthCode: () => import('@/components/AuthCode'),
    PermissionManager: () => import('./PermissionManager'),
    RoleManager: () => import('./RoleManager'),
    CompanyManager: () => import('./CompanyManager')
  },
  props: {
    userId: {
      type: String,
      default: null
    }
  },
  data: () => ({
    loading: false,
    auth: {
      authByUserId: '',
      code: ''
    }
  })
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
