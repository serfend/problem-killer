<template>
  <div>
    <h2>此页面仍在开发中，请勿使用。</h2>
    <div class="banner" />
    <el-card class="content">
      <div class="content-title">
        <div class="left-content">个人中心</div>
        <div v-if="modules[activeTab]" class="right-content">
          <span class="right-content-tip">.</span>
          <span>{{ modules[activeTab].label }}</span>
        </div>
      </div>
      <el-tabs
        v-model="activeTab"
        tab-position="left"
        type="border-card"
        stretch
        class="panel-tabs"
      >
        <el-tab-pane
          v-for="page in pages"
          :ref="page.name"
          :key="page.name"
          :name="page.name"
          lazy
          class="panel-content"
        >
          <template #label>
            <div class="label-item">
              <SvgIcon :icon-class="page.icon" />
              <span>{{ page.label }}</span>
            </div>
          </template>
          <component :is="page" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import importAll from '@/utils/common/importAll'
const modules = importAll(
  require.context('./pages', true, /\.vue$/),
  (keys, item) => {
    if (keys.length > 2 || (!item || !item.label)) return null
    return keys
      .join('.')
      .replace('.index', '')
      .replace('.vue', '')
  }
)
export default {
  name: 'Profile',
  components: {
    SvgIcon: () => import('@/components/SvgIcon'),
    ...modules
  },
  data: () => ({
    activeTab: null,
    pages: null,
    modules
  }),
  computed: {
    nowuser() {
      return this.$store.state.user.data
    }
  },
  mounted() {
    this.pages = Object.values(modules).sort((a, b) => a.index - b.index)
    this.activeTab = this.pages[0].name
  },
  methods: {}
}
</script>
<style lang="scss" >
@import '@/styles/element-variables';
.content {
  width: 60rem;
  margin: 2rem auto;
}
.content-title {
  border-top: 1px solid $--border-color-light;
  border-left: 1px solid $--border-color-light;
  border-right: 1px solid $--border-color-light;
  display: flex;
  align-items: center;
  .left-content {
    width: 8rem;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    color: $--border-color-light;
    cursor: default;
    border-right: 1px solid $--border-color-light;
  }
  .right-content {
    .right-content-tip {
      width: 4px;
      height: 16px;
      margin-top: 18px;
      background-color: $--color-primary;
      border-radius: 4px;
    }
    margin: 0 0 0 1rem;
    color: $--color-primary;
  }
}
.current-panel-title {
  width: 100%;
  border-left: 0.5rem solid $--color-primary;
  color: $--color-primary;
}
.panel-content {
  min-height: 50rem;
}
.panel-tabs {
  .el-tabs__item {
    height: 60px !important;
    line-height: 60px;
  }
}
.banner {
  background-color: $--color-primary;
  height: 6rem;
  margin: -1rem;
  opacity: 0.7;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
}
.label-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
