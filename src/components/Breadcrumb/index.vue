<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span
          v-if="item.redirect==='noRedirect'||index==levelList.length-1"
          class="no-redirect"
        >{{ item.meta.ctitle||generateTitle(item.meta) }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ generateTitle(item.meta) }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { generateTitle } from '@/utils/get-page-title'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    generateTitle,
    getBreadcrumb() {
      // only show routes with meta.title
      var matched = this.$route.matched.filter(
        item => item.meta && (item.meta.title || item.meta.ctitle)
      )
      // it seems not wise to push dashboard on the first
      // const first = matched[0]

      // if (!this.isDashboard(first)) {
      //   matched = [
      //     {
      //       path: '/dashboard',
      //       meta: { title: 'dashboard' }
      //     }
      //   ].concat(matched)
      // }

      this.levelList = matched.filter(
        item =>
          item.meta &&
          (item.meta.title || item.meta.ctitle) &&
          item.meta.breadcrumb !== false
      )
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    handleLink(item) {
      console.log(item)
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
