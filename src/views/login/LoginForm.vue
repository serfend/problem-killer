<template>
  <el-form
    ref="loginForm"
    v-loading="loading"
    :model="loginForm"
    :rules="loginRules"
    auto-complete="off"
    class="login-form"
  >
    <div class="title-container">
      <h3 class="title">{{ $t('login.defaultTitle') }}</h3>
      <lang-select class="set-language" />
    </div>
    <el-divider />
    <el-form-item prop="username">
      <el-input
        ref="username"
        v-model="loginForm.username"
        placeholder="用户名或身份证号"
        auto-complete="on"
        name="username"
        tabindex="1"
        type="text"
      />
    </el-form-item>
    <el-tooltip v-model="capsTooltip" content="大写已开启" manual placement="right">
      <el-form-item prop="password">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          placeholder="密码"
          :type="passwordType"
          auto-complete="off"
          name="password"
          tabindex="2"
          @blur="capsTooltip = false"
          @keyup.enter.native="handleLogin"
          @keyup.native="checkCapslock"
        >
          <template slot="append">
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </template>
        </el-input>
      </el-form-item>
    </el-tooltip>

    <el-row type="flex" justify="space-around" style="margin-top:1rem">
      <el-button
        type="primary"
        style="width:100%"
        @click.native.prevent="handleLogin"
      >{{ $t('login.title') }}</el-button>
    </el-row>

    <el-divider />
    <el-card style="margin-bottom:0.5em;">
      <div>
        <el-checkbox v-model="loginForm.RememberUserPassword" label="记住密码" />
        <el-tooltip content="每次打开网站时将自动登录">
          <el-checkbox v-model="loginForm.RememberMe" label="记住我" />
        </el-tooltip>
      </div>
      <div>
        <el-link type="info" href="/#/forget">忘记账号/密码？</el-link>
      </div>

      <el-row type="flex" justify="space-around" style="margin-top:1rem">
        <el-tooltip effect="light">
          <NotLoginRegisterNotice slot="content" />
          <el-button type="text" style="width:100%">{{ $t('register.title') }}</el-button>
        </el-tooltip>
      </el-row>
    </el-card>
  </el-form>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { passwordCache, setLoginSetting, getLoginSetting } from '@/api/account'
import LangSelect from '@/components/LangSelect'
import { Message } from 'element-ui'
import NotLoginRegisterNotice from '@/views/register/NotLoginRegisterNotice'
export default {
  name: 'LoginForm',
  components: { LangSelect, NotLoginRegisterNotice },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value && value.length < 8) {
        callback(new Error('密码不少于8位'))
      } else {
        callback()
      }
    }
    return {
      wrongTime: 0,
      loginForm: {
        username: '',
        password: '',
        RememberUserPassword: false,
        RememberMe: false,
        verify: 201700816
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    },
    currentUser() {
      return this.$store.state.user.realName
    },
    hasLogin() {
      return this.$store.state.user.userid
    }
  },
  watch: {
    hasLogin: {
      handler(val) {
        if (val) {
          Message({
            message: `欢迎您，${this.currentUser}！`,
            type: 'success',
            duration: 8000
          })
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.loadLoginSetting()
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= 'a' && key <= 'z') ||
          (!shiftKey && key >= 'A' && key <= 'Z')
        ) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    loadLoginSetting() {
      var loginSetting = getLoginSetting()
      this.loginForm.RememberUserPassword = loginSetting.RememberUserPassword
      this.loginForm.RememberMe = loginSetting.RememberMe

      this.loginForm.username = loginSetting.username
      if (this.loginForm.RememberUserPassword) {
        this.loginForm.password = passwordCache(loginSetting.username)
      }
      if (this.loginForm.RememberMe && !this.$store.state.user.isUserLogout) {
        this.loading = true
        setTimeout(() => {
          if (!this.loginForm.RememberMe) {
            this.loading = false
            return this.$message.warning('自动登录被终止')
          } else if (this.$store.state.user.isUserLogout || this.hasLogin) {
            this.$emit('login', true)
            this.loading = false
            return
          }
          this.handleLogin()
        }, 2000)
      }
    },
    saveLoginSetting() {
      var setting = Object.assign({}, this.loginForm)
      setLoginSetting(setting)
    },
    handleLogin() {
      this.loading = true
      this.$store
        .dispatch('user/login', this.loginForm)
        .then(data => {
          Message({
            message: '登录成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.$emit('login', true)
          this.$store.dispatch('user/initUserInfo')
        })
        .catch(e => {
          this.showLoginFailTip(e)
          this.$emit('login', false)
        })
        .finally(() => {
          this.saveLoginSetting()
          this.loading = false
        })
    },
    showLoginFailTip(e) {
      var msg = ''
      var title = ''
      switch (e.status) {
        case 12440: {
          title = '账号审批未通过且有紧急情况需报假?'
          msg = '可联系上一级领导、管理员或业务科，授权完成账号的审批'
          break
        }
        case 12450: {
          title = '账号审批被退回?'
          msg = `进入<a style="color:${this.theme}" href="/#/register/user">注册页面</a> 选中【切换到审批模式】、搜索本人姓名找到本人账号、修改正确信息并重新提交`
          break
        }
        case 11500: {
          this.wrongTime++
          if (this.wrongTime % 3 === 0 || this.wrongTime > 10) {
            title = '不记得密码了?'
            msg = `尝试<a style="color:${this.theme}" href="/#/forget">找回密码</a>`
          }
          break
        }
        case 21000: {
          this.wrongTime++
          if (this.wrongTime % 3 === 0 || this.wrongTime > 10) {
            title = '不记得账号了?'
            msg = `尝试<a style="color:${this.theme}" href="/#/forget">找回账号</a>`
          }
          break
        }
      }
      const opt = {
        message: `<h3>${title}</h3><div style="margin-top:0.5em">${msg}</div>`,
        dangerouslyUseHTMLString: true,
        type: 'info',
        duration: 10000
      }
      if (msg) {
        this.$message(opt)
      }
    }
  }
}
</script>

<style lang="scss">
@import './login-form.scss';
</style>
