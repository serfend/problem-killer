<template>
  <el-card>
    <template #header>
      <h2>权限管理</h2>
    </template>
    <el-tabs v-model="tab" type="border-card">
      <el-tab-pane v-for="p in pages" :key="p.name" :name="p.name" :label="p.label">
        <component :is="p" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import importAll from '@/utils/common/importAll'
const modules = importAll(
  require.context('.', true, /\.vue$/),
  (keys, item) => {
    if (keys.length > 2 || (!item || !item.label)) return null
    return keys
      .join('.')
      .replace('.index', '')
      .replace('.vue', '')
  }
)
export default {
  name: 'UserPermission',
  components: {
    ...modules
  },
  data: () => ({
    tab: null,
    pages: null
  }),
  mounted() {
    this.$store.dispatch('permission/initPermissionDict')
    this.pages = Object.values(modules)
    this.tab = this.pages[0].name
  }
}
</script>
