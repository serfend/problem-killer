<template>
  <div
    class="sidebar-logo-container"
    :class="{ collapse: collapse }"
    :style="{background:variables.logoBg,color:variables.logoText}"
  >
    <div class="sidebar-logo-link">
      <el-image :src="logo" :preview-src-list="[logoMax]" class="sidebar-logo" />
      <transition name="sidebarLogoFade">
        <h1 v-show="!collapse" class="sidebar-title">{{ title }}</h1>
      </transition>
    </div>
  </div>
</template>

<script>
import variables from '@/styles/variables.scss'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: this.$store.state.settings.title,
      logo: '/favicon-64x64.ico',
      logoMax: '/favicon.ico'
    }
  },
  computed: {
    variables() {
      return variables
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
