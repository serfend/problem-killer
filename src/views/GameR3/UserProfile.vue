<template>
  <el-form v-loading="userinfoLoading" label-width="80px">
    <el-form-item label="忍忍id">
      <el-input v-model="innerUserInfo.gameid" />
    </el-form-item>
    <el-form-item label="昵称">
      <el-input v-model="innerUserInfo.nickName" disabled />
    </el-form-item>
    <el-form-item label="头衔">
      <el-input v-model="innerUserInfo.level" disabled />
    </el-form-item>
    <el-form-item label="上次领取">
      <el-tag>{{ formatDate(innerUserInfo.lastHandleStamp) }}</el-tag>
    </el-form-item>
    <el-form-item label="上次登录">
      <el-tag>{{ formatDate(innerUserInfo.lastLogin) }}</el-tag>
      <el-button :type="innerUserInfo.isLoginToday ? 'info' : 'success'" @click="login">{{
        innerUserInfo.isLoginToday ? '今日已签到啦' : '点击签到'
      }}</el-button>
    </el-form-item>
    <el-form-item label="预计领取">
      <el-tag>{{
        formatDate(innerUserInfo.lastHandleStamp + innerUserInfo.handleInterval)
      }}</el-tag>
    </el-form-item>
  </el-form>
</template>

<script>
import { userinfo, updateHandleInterval } from '@/api/game'
import { signIn } from '@/api/account'
import { formatTime } from '@/utils'
import { parseTime } from '@/utils'
export default {
  name: 'UserProfile',
  props: {
    userinfo: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      innerUserInfo: {},
      userinfoLoading: false,
    }
  },
  watch: {
    userinfo: {
      handler(val) {
        this.innerUserInfo = val
      },
      deep: true,
    },
    innerUserInfo: {
      handler(val) {
        this.$emit('update:userinfo', val)
      },
      deep: true,
    },
    'innerUserInfo.gameid'() {
      this.updateGameR3User()
    },
  },
  mounted() {
    const userinfo = this.userinfo
    userinfo.gameid = localStorage.getItem('lastUser')
    if (userinfo.gameid === 'null') userinfo.gameid = ''
    this.updateGameR3User()
  },
  methods: {
    formatDate(val) {
      if (val === 0) return '未领取过'
      var date = new Date(val)
      return formatTime(date)
    },
    login() {
      signIn(this.userinfo.gameid).then((d) => {
        updateHandleInterval(this.userinfo.gameid).then((f) => {
          this.updateGameR3User()
        })
      })
    },
    updateGameR3User() {
      if (this.userinfoLoading) return
      localStorage.setItem('lastUser', this.userinfo.gameid)
      if (this.userinfo.gameid.length === 9) {
        this.userinfoLoading = true
        userinfo(this.userinfo.gameid).then((data) => {
          const d = data.user
          if (d.nickName === null) {
            this.$message.error('没有查到这个忍忍哦~')
          }
          const last = new Date(this.userinfo.lastLogin)
          const now = new Date()
          const userinfo = {
            nickname: d.nickName,
            level: d.level,
            lastHandleStamp: parseTime(d.user.lastHandleStamp),
            handleInterval: parseTime(d.user.handleInterval),
            enable: d.user.enable,
            lastLogin: d.user.lastLogin,
            isLoginToday:
              (now - last) / 86400000 <= 1 && now.getDate() === last.getDate(),
          }
          this.userinfoLoading = false
          this.$emit('update:userinfo', userinfo)
        })
      }
    },
  },
}
</script>
