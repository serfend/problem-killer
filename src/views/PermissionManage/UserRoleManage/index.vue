<template>
  <el-tabs v-model="tab">
    <el-tab-pane v-for="page in pages" :key="page.name" :name="page.name" :label="page.label">
      <component :is="page.name" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import importAll from '@/utils/common/importAll'
const modules = importAll(
  require.context('.', true, /\.vue$/),
  (keys, item) => {
    if (!keys || (!item || !item.label)) return null
    return keys
      .join('.')
      .replace('.index', '')
      .replace('.vue', '')
  }
)
export default {
  name: 'UserRoleManage',
  label: '用户角色/权限管理',
  components: {
    ...modules
  },
  data: () => ({
    tab: null,
    pages: []
  }),
  mounted() {
    this.pages = Object.values(modules).map(i => ({
      name: i.name,
      label: i.label
    }))
    this.tab = this.pages[0].name
  },
  methods: {}
}
</script>
