<template>
  <div>
    <el-card v-if="currentUser&&currentUser.id||!init_page_over" style="max-width:60rem">
      <div v-if="is_register" class="reg-header">
        <h2>欢迎注册</h2>
        <p>
          已有账号
          <el-button type="text" @click="switch_login">登录</el-button>
        </p>
      </div>
      <RegFormItems
        ref="reg"
        v-model="registerForm"
        :loading.sync="loading"
        :user="current_select_id"
        :is-register="is_register"
        :select-is-invalid-account.sync="selectIsInvalidAccount"
      />
      <el-card v-if="!is_register" style="margin-top:1rem">
        <el-form>
          <el-form-item label="认证状态">
            <el-tag :type="selectIsInvalidAccountType">{{ selectIsInvalidAccountDescription }}</el-tag>
          </el-form-item>
          <el-form-item label="账号操作" style="margin-top:1rem">
            <el-button type="warning" plain :loading="loading" @click="submitRegister(false)">修改信息</el-button>
            <el-button type="danger" plain :loading="loading" @click="removeAccount">删除账号</el-button>
          </el-form-item>
          <el-form-item
            v-if="selectIsInvalidAccountType!=='success'"
            label="账号认证"
            style="margin-top:1rem"
          >
            <el-button
              :disabled="selectIsInvalidAccount!==0"
              type="success"
              plain
              :loading="loading"
              @click="submitValidAccount(true)"
            >注册信息合格</el-button>
            <el-button
              :disabled="selectIsInvalidAccount!==0"
              type="danger"
              plain
              :loading="loading"
              @click="submitValidAccount(false)"
            >注册信息不合格</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-button
        v-else-if="showSubmitButton"
        type="success"
        plain
        :loading="loading"
        style="width:100%;margin-top:1rem"
        @click="submitRegister(true)"
      >提交注册</el-button>
    </el-card>
    <el-dialog :visible.sync="card_should_show" append-to-body>
      <NotLoginRegisterNotice />
    </el-dialog>
    <el-dialog :visible.sync="remove_account.show" append-to-body>
      <h2 slot="title">删除账号 - 敏感操作授权</h2>
      <div v-if="remove_account.show">
        <div style="color:#c00">
          <h3>您确定要删除用户吗</h3>
          <h3>{{ registerForm.Base.realName }} ({{ current_select_id }})</h3>
        </div>
        <el-input
          v-model="remove_account.reason"
          rows="6"
          type="textarea"
          :placeholder="`填写删除${registerForm.Base.realName}的原因`"
        />
        <el-form style="margin-top:1rem">
          <AuthCode v-model="remove_account.auth" select-name="注册账户" />
        </el-form>
      </div>
      <template slot="footer">
        <el-button type="text" style="color:#d77" @click="remove_account_confirm">确认</el-button>
        <el-button type="success" @click="remove_account.show=false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  regnew,
  modifyUser,
  removeAccount,
  authUserRegister
} from '@/api/account'
import { Const_DisabledVacation } from './config'
export default {
  name: 'RegForm',
  components: {
    NotLoginRegisterNotice: () => import('../NotLoginRegisterNotice'),
    RegFormItems: () => import('./RegFormItems'),
    AuthCode: () => import('@/components/AuthCode')
  },
  props: {
    showSubmitButton: {
      type: Boolean,
      default: true
    },
    userInfo: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    loading: false,
    selectIsInvalidAccount: false,
    current_select_id: null,
    not_login_show: false,
    init_page_over: false,
    card_should_show: false,
    remove_account: {
      auth: null,
      show: false,
      reason: ''
    },
    registerForm: null
  }),
  computed: {
    is_register() {
      return this.userInfo === null
    },
    currentUser() {
      return this.$store.state.user.data
    },
    is_login() {
      return this.currentUser && this.currentUser.id
    },
    selectIsInvalidAccountType() {
      const s = this.selectIsInvalidAccount
      return s === 0 ? 'info' : s === 1 ? 'success' : 'danger'
    },
    selectIsInvalidAccountDescription() {
      const status = this.selectIsInvalidAccount
      const s = status && status.toString()
      const c = '用户信息认证'
      const dict = {
        '-1': '已驳回',
        '0': '待审批',
        '1': '已通过'
      }
      return `${c} ${dict[s] || '未知状态'}`
    }
  },
  watch: {
    init_page_over(val) {
      this.card_should_show = val && !this.is_login
    },
    is_login(val) {
      this.card_should_show = !val && this.init_page_over
    },
    userInfo: {
      handler(val) {
        if (!val) return
        this.current_select_id = val.id
      },
      immediate: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.init_page_over = true
    }, 5000)
  },
  methods: {
    modifyUser,
    regnew,
    // 授权当前账号
    submitValidAccount(valid) {
      if (this.current_select_id === '') {
        return this.$message.error('未选中用户')
      }
      const actionName = valid ? '认证' : '退回'
      const tip_auth = `即将对用户${this.registerForm.Base.realName}(${
        this.current_select_id
      })的注册进行【${actionName}】操作`
      this.$confirm(tip_auth, `${actionName}提示`, { type: 'warning' }).then(
        () => {
          const username = this.current_select_id
          this.loading = true
          authUserRegister(username, valid)
            .then(() => {
              const msg = valid
                ? '授权成功，可通知登录'
                : '驳回成功，可通知重新注册'
              this.$message.success(msg)
              this.$emit('requireUpdate')
            })
            .finally(() => {
              this.loading = false
            })
        }
      )
    },
    set_account_status_disable_vacation(f) {
      const app = f.Application
      // reset status to normal
      if (!app.accountStatus) app.accountStatus = 0
      if ((app.accountStatus & Const_DisabledVacation) > 0) {
        app.accountStatus -= Const_DisabledVacation
      }
      // syn status to disabled vacation
      if (f.Company.disabledVacation > 0) {
        app.accountStatus += Const_DisabledVacation
      }
    },
    set_account_status(f) {
      this.set_account_status_disable_vacation(f)
    },
    next_step(step) {
      return this.$refs.reg.next_step(step)
    },
    async submitRegister(regOrModify) {
      await this.$confirm('确定要提交吗？')
      if (!regOrModify && this.selectIsInvalidAccountType !== 'success') {
        const s =
          '注意：当前用户状态为【待认证】，修改信息将使得其通过认证，认证人为信息修改者。是否继续？'
        await this.$confirm(s)
      }
      this.loading = true
      const f = this.registerForm
      const app = f.Application
      f.password = app.password
      f.confirmPassword = app.confirmPassword
      this.set_account_status(f)
      const submitForm = {
        Data: f,
        verify: {
          code: '201700816'
        },
        Auth: f.Auth
      }
      const submitMethod = regOrModify ? regnew : modifyUser
      submitMethod(submitForm)
        .then(data => {
          this.$message.success(regOrModify ? '注册成功' : '修改成功')
          this.$emit('requireUpdate')
          if (regOrModify) {
            this.$router.push('/')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    removeAccount() {
      this.$confirm('确定要删除此账号吗？', '警告', {
        type: 'error'
      }).then(() => {
        this.remove_account.show = true
      })
    },
    remove_account_confirm() {
      this.loading = true
      removeAccount({
        data: {
          id: this.current_select_id,
          reason: this.remove_account.reason
        },
        auth: this.remove_account.auth
      })
        .then(() => {
          this.$emit('requireUpdate')
          this.$emit('requireHide')
          this.$message.success('已删除账号')
        })
        .finally(() => {
          this.loading = false
          this.remove_account.show = false
        })
    },
    switch_login() {
      this.$store.dispatch('user/logout')
      this.$router.push({ path: '/apply/vacation/myApply/' })
    }
  }
}
</script>

<style lang="scss" scoped>
.top-enter,
.top-leave-to {
  transform: translate3d(0, -100%, 0);
}

.top-leave,
.top-enter-to {
  transform: translate3d(0, 0, 0);
}

.top-enter-active,
.top-leave-active {
  transition: all 0.2s;
}
</style>
