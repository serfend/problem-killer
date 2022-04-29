<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div v-loading="loading" class="right-menu">
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="right-menu-item" />
        <error-log class="errLog-container right-menu-item hover-effect" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>
      <UserPannel ref="userPannel" :user-card-show.sync="userCardShow" />
      <div v-if="currentUser.data" class="right-menu-2-item" style="color:#000">
        <div>{{ currentUser.name }}</div>
        <div>{{ currentUser.data.dutiesName }}</div>
      </div>
      <div v-if="!hasLogin" class="right-menu-item">
        <el-link @click="$refs.userPannel.userCardShowing(true)">登录</el-link>
        <el-link @click="$refs.userPannel.handleReg(true)">注册</el-link>
      </div>
      <div v-else class="right-menu-item">
        <el-popover trigger="hover">
          <BBSMessageBox />
          <el-link slot="reference">消息</el-link>
        </el-popover>
        <el-popover trigger="hover">
          <Loading />
          <el-link slot="reference">收藏</el-link>
        </el-popover>
      </div>
      <div v-if="device !== 'mobile'&&currentTime" class="right-menu-2-item">
        <div>{{ currentTime.split('\n')[0] }}</div>
        <div>{{ currentTime.split('\n')[1] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { datedifference, parseTime } from '@/utils'
export default {
  components: {
    Breadcrumb: () => import('@/components/Breadcrumb'),
    Hamburger: () => import('@/components/Hamburger'),
    ErrorLog: () => import('@/components/ErrorLog'),
    Screenfull: () => import('@/components/Screenfull'),
    Search: () => import('@/components/HeaderSearch'),
    Loading: () => import('@/views/Loading'),
    BBSMessageBox: () => import('@/views/BBSMessage/BBSMessageBox'),
    UserPannel: () => import('./UserPannel')
  },
  data: () => ({
    checker: null,
    lastUpdateShow: new Date(),
    isToShowPasswordModefier: false,
    loading: false,
    check: {
      check_sync_time: 0,
      check_user_login: 0
    },
    currentTime: null,
    userCardShow: false
  }),
  computed: {
    currentUser() {
      return this.$store.state.user
    },
    hasLogin() {
      return this.currentUser.userid
    },
    device() {
      return this.$store.state.app.device
    },
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },
  mounted() {
    this.checker = setInterval(() => {
      this.check_sync_time()
      this.check_user_login()
      const s = this.$store.state.settings.currentTime_left_status
      if (s) {
        this.currentTime = `时间同步\n${s}`
      } else {
        const d = new Date(
          new Date() - 0 + this.$store.state.settings.currentTimeDelta_left
        )
        this.currentTime = parseTime(d, '{y}年{m}月{d}日\n{h}时{i}分{s}秒')
      }
    }, 1000)
    this.check_sync_time(true)
  },
  destroyed() {
    if (this.checker) clearInterval(this.checker)
  },
  methods: {
    check_sync_time(direct_load = false) {
      const d = datedifference(new Date(), this.check.check_sync_time, 'minute')
      if (d < 30 && !direct_load) return // 30分钟同步一次
      // console.log('check sync time after ' + d + ' minute(s)')
      this.check.check_sync_time = new Date()
      this.$store.dispatch('settings/sync_time')
    },
    check_user_login() {
      const d = datedifference(
        new Date(),
        this.check.check_user_login,
        'minute'
      )
      if (d < 10) return
      // console.log('check login status')
      this.check.check_user_login = new Date()
      this.$store.dispatch('user/check_login')
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
@import './menu-divider.scss';
@import './nav-bar.scss';
</style>
