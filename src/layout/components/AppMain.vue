<template>
  <section v-if="isAlive" class="app-main">
    <transition name="fade-transform">
      <keep-alive :include="cachedViews">
        <router-view :key="key" style="margin:1rem" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data: () => ({
    isAlive: true
  }),
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  },
  methods: {
    reload() {
      this.isAlive = false
      this.$nextTick(() => {
        this.isAlive = true
        this.$store.dispatch('user/initUserInfo')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 50px;
  }
}
</style>

