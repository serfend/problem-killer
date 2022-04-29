<template>
  <el-popover
    :show.sync="innerUserCardShow"
    placement="bottom-end"
    trigger="click"
    @show="userCardShowing(true)"
    @hide="userCardShowing(false)"
  >
    <div v-if="!hasLogin && loginFormHasShow">
      <el-dialog :visible.sync="innerUserCardShow" width="80%" append-to-body>
        <Login />
      </el-dialog>
    </div>
    <div v-else style="width: 250px">
      <UserSummary
        :showout="userCardIsShowing"
        :data="currentUser.data"
        :avatar="currentUser.avatar"
        :vacation="currentUser.vacation"
      />
      <div class="menu-divider" />
      <el-menu style="border-right: none">
        <el-menu-item index="1" @click="$router.push(`/user/profile`)">
          <SvgIcon icon-class="namecard" />
          <span>个人信息</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <SvgIcon icon-class="principal" />
            <span>账号</span>
          </template>
          <el-menu-item index="1" @click="$router.push(`/forget`)">
            <SvgIcon icon-class="namecard" />
            <span>找回账号/密码</span>
          </el-menu-item>
          <el-menu-item index="2" @click="isToShowPasswordModifier = true">
            <SvgIcon icon-class="scan_namecard" />
            <span>修改密码</span>
          </el-menu-item>
          <el-menu-item index="3" @click="handleReg(false)">
            <SvgIcon icon-class="newapplication_" />
            <span>用户列表</span>
          </el-menu-item>
          <el-menu-item index="4" @click="handleReg(true)">
            <SvgIcon icon-class="newapplication_" />
            <span>注册新账号</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item @click="switch_account">
          <SvgIcon icon-class="switch" />
          <span>切换账号</span>
        </el-menu-item>
        <el-menu-item @click="logout">
          <SvgIcon icon-class="dengchu" />
          <span>退出</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div
      slot="reference"
      class="avatar-container right-menu-item"
      @click="innerUserCardShow = !innerUserCardShow"
    >
      <el-image
        class="user-avatar"
        :style="{ transform: userCardIsShowing ? 'scale(0)' : ''}"
        :src="avatar"
      />
      <div class="right-menu-item" />
    </div>
    <el-dialog title="修改密码" :modal="false" :visible.sync="isToShowPasswordModifier" width="500px">
      <ResetPassword ref="resetPassword" />
    </el-dialog>
  </el-popover>
</template>

<script>
export default {
  name: 'UserPannel',
  components: {
    SvgIcon: () => import('@/components/SvgIcon'),
    UserSummary: () => import('@/layout/components/UserSummary'),
    Login: () => import('@/views/login'),
    ResetPassword: () => import('@/components/ResetPassword')
  },
  props: {
    userCardShow: { type: Boolean, default: false }
  },
  data: () => ({
    loginFormHasShow: false,
    userCardIsShowing: false,
    isToShowPasswordModifier: false
  }),
  computed: {
    innerUserCardShow: {
      get() {
        return this.userCardShow
      },
      set(val) {
        this.$emit('update:userCardShow', val)
      }
    },
    avatar() {
      return this.currentUser.avatar
    },
    hasLogin() {
      return !!this.currentUser.userid
    },
    isUserLogout() {
      return this.currentUser.isUserLogout
    },
    currentUser() {
      return this.$store.state.user
    }
  },
  watch: {
    hasLogin: {
      handler(val) {
        if (val) this.hdlLogin(true)
      }
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.hasLogin || this.isUserLogout) return
      this.innerUserCardShow = true
    }, 500)
  },
  methods: {
    async logout() {
      this.loading = true
      await this.$store.dispatch('user/logout')
      this.loading = false
      this.$nextTick(() => {
        this.innerUserCardShow = false
        this.userCardShowing(false)
      })
    },

    async switch_account() {
      await this.logout()
      this.userCardShowing(true)
    },
    userCardShowing(show) {
      const lastUpdateShow = new Date()
      this.lastUpdateShow = lastUpdateShow
      setTimeout(() => {
        if (lastUpdateShow !== this.lastUpdateShow) return
        if (show) this.innerUserCardShow = true
        this.userCardIsShowing = show
        this.loginFormHasShow = true
      }, 100)
    },
    hdlLogin(success) {
      console.log('login status', success)
      if (!success) return
      this.innerUserCardShow = false
      this.userCardIsShowing = false
    },
    handleReg(isToRegister) {
      this.$router.push({
        path: `/register/${isToRegister ? 'user' : 'approve'}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../menu-divider.scss';
@import '../nav-bar.scss';
</style>
