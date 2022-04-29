<template>
  <div>
    <el-form-item prop="userName" label="用户名">
      <el-input
        v-model="innerForm.userName"
        :style="{ width: '14rem' }"
        placeholder="用户名为唯一凭证，不可修改"
        auto-complete="on"
        type="text"
        @change="checkuserName"
      />
      <el-tooltip :content="invalid.userName.des">
        <i v-if="invalid.userName.status" class="el-icon-error" style="color:#F56C6C" />
        <i v-else class="el-icon-success" style="color:#67C23A" />
      </el-tooltip>
    </el-form-item>
    <el-tooltip v-model="capsTooltip" content="Caps lock is On" manual placement="right">
      <el-form-item prop="password" label="密码" class="normal-form-item">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="innerForm.password"
          :placeholder="$t('login.password')"
          :type="passwordType"
          auto-complete="on"
          name="password"
          tabindex="2"
          @blur="capsTooltip = false"
          @keyup.native="checkCapslock"
        >
          <template slot="append">
            <span @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </template>
        </el-input>
      </el-form-item>
    </el-tooltip>
    <el-form-item prop="confirmPassword" label="确认密码" class="normal-form-item">
      <el-input
        :key="passwordType"
        ref="confirmPassword"
        v-model="innerForm.confirmPassword"
        placeholder="确认密码"
        :type="passwordType"
        auto-complete="on"
        name="password"
        tabindex="2"
        @blur="capsTooltip = false"
        @keyup.native="checkCapslock"
      >
        <template slot="append">
          <span @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item v-if="!isRegister">
      <el-button type="danger" style="width:14rem" @click="modifyPassword">修改密码</el-button>
    </el-form-item>
    <el-form-item v-show="false" prop="email" label="邮箱">
      <el-input
        v-model="innerForm.email"
        :style="{ width: '14rem' }"
        :placeholder="$t('register.checkemail')"
        auto-complete="on"
        type="text"
      />
    </el-form-item>
    <el-form-item v-show="false" prop="linkdood" label="豆豆账号">
      <ThirdpardChecker
        :id.sync="innerForm.linkdood"
        name="豆豆"
        placeholder="填写以第一时间收到休假信息"
        style="width:14rem"
      />
    </el-form-item>
  </div>
</template>

<script>
import { getUserSummary } from '@/api/user/userinfo'
import { accountPassword } from '@/api/account'
import ThirdpardChecker from '@/components/ThirdpardAccount/Checker'
export default {
  name: 'Application',
  components: { ThirdpardChecker },
  props: {
    isRegister: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default() {
        return this.innerForm
      }
    }
  },
  data() {
    return {
      innerForm: {
        userName: '',
        password: '',
        confirmPassword: '',
        email: ''
      },
      invalid: {
        userName: {
          status: false,
          des: ''
        }
      },
      capsTooltip: false,
      passwordType: 'password'
    }
  },
  watch: {
    form: {
      handler(val) {
        if (val.userName !== null) {
          this.innerForm = val
          if (this.innerForm.id) delete this.innerForm.id
        } else {
          console.warn('Applicaiton接收到无效的Model')
        }
      },
      deep: true,
      immediate: true
    },
    innerForm: {
      handler(val) {
        this.$emit('update:form', val)
      },
      deep: true
    }
  },
  methods: {
    modifyPassword() {
      this.$confirm('确认修改密码吗', { type: 'warning' }).then(() => {
        const f = this.innerForm
        accountPassword({
          id: f.userName,
          newPassword: f.password,
          confirmNewPassword: f.confirmPassword
        }).then(data => {
          this.$message.success('密码已修改')
        })
      })
    },
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
    checkuserName() {
      const userName = this.innerForm.userName
      if (!userName || userName.length < 7) {
        this.invalid.userName.status = true
        this.invalid.userName.des = '账号长度过短'
        return
      }
      this.invalid.userName.des = '验证成功'
      getUserSummary(userName, true)
        .then(data => {
          this.invalid.userName.status = true
          this.invalid.userName.des =
            '此账号已被' + data.companyName + data.realName + '使用'
        })
        .catch(() => {
          this.invalid.userName.status = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../common';
</style>
