<template>
  <el-card class="item">
    <div>{{ description }}</div>
    <div style="color:#ccc;font-size:0.7rem">{{ value.key }}</div>
    <div class="menu-divider" style="margin:0.3rem 0 0.3rem 0" />
    <div>
      <el-tooltip v-for="i in value.list" :key="i.region" :content="getRegionType(i).d">
        <el-tag size="mini" :type="getRegionType(i).v" style="margin-right:0.5rem">{{ i.region }}</el-tag>
      </el-tooltip>
    </div>
    <el-button :disabled="!hasChild" style="float:right" type="text">展开子权限</el-button>
  </el-card>
</template>

<script>
export default {
  name: 'PermissionItem',
  model: { event: 'change', prop: 'value' },
  props: {
    value: { type: Object, default: () => null }
  },
  computed: {
    hasChild() {
      return false
    },
    description() {
      const key = this.value && this.value.key
      if (!key) return null
      return this.$store.state.permission.allPermissionsDict[key]
    }
  },
  methods: {
    getRegionType(v) {
      switch (v.type) {
        case 0:
          return { v: 'danger', d: '不可操作' }
        case 1:
          return { v: 'info', d: '仅可查看' }
        case 2:
          return { v: 'primary', d: '仅可修改' }
        case 3:
          return { v: 'success', d: '可查看和修改' }
      }
    }
  }
}
</script>
<style lang="scss" >
.item {
  .el-card__body {
    padding: 0.7rem !important;
  }
  width: 15rem;
  margin-left: 0.5rem;
  margin-bottom: 1rem;
}
@import '@/layout/components/menu-divider.scss';
</style>
