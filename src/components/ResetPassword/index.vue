<template>
  <el-form ref="editPwd" :model="editPwd" :rules="rulePwd" label-width="100px">
    <el-form-item label="修改账号" prop="username">
      <el-input v-model="editPwd.username" type="input" style="width:215px" />
    </el-form-item>
    <el-form-item v-if="oldPswInput" label="旧密码" prop="oldPassword">
      <el-input v-model="editPwd.oldPassword" type="password" style="width:215px" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="editPwd.newPassword" type="password" style="width:215px" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmNewPassword">
      <el-input v-model="editPwd.confirmNewPassword" type="password" style="width:215px" />
    </el-form-item>
    <AuthCode :form.sync="editPwd.auth" select-name="重置密码" />
    <el-button
      type="success"
      style="width:100%"
      :disabled="!(editPwd.username&&editPwd.newPassword&&editPwd.confirmNewPassword===editPwd.newPassword)"
      @click="savePwd"
    >修改</el-button>
  </el-form>
</template>

<script>
import AuthCode from '@/components/AuthCode'
import { accountPassword } from '@/api/account'
export default {
  name: 'ResetPassword',
  components: { AuthCode },
  props: {
    oldPswInput: {
      type: Boolean,
      default: true
    }
  },
  data() {
    var validatenewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value === this.editPwd.oldPassword) {
        callback(new Error('新密码不能和旧密码相同'))
      } else if (value.length > 16 || value.length < 8) {
        callback(new Error('新密码必须8-16位数字与字母的组合'))
      } else {
        if (this.editPwd.validatenewPassword !== '') {
          this.$refs.editPwd.validateField('validatenewPassword')
        }
        callback()
      }
    }
    var validateconfirmNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.editPwd.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isToShowPasswordModefier: false, // 是否显示修改密码
      editPwd: {
        username: this.$store.state.user.userid,
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        auth: {
          authByUserID: '',
          code: ''
        }
      },
      rulePwd: {
        username: [{ required: true, message: '请输入账号' }],
        newPassword: [
          { required: true, validator: validatenewPassword, trigger: 'blur' }
        ],
        confirmNewPassword: [
          {
            required: true,
            validator: validateconfirmNewPassword,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    savePwd() {
      this.$refs['editPwd'].validate(valid => {
        if (valid) {
          const submitId = (this.editPwd.username === ''
            ? this.$store.state.user.userid
            : this.editPwd.username
          ).toString()
          const submitPwd = {
            id: submitId,
            auth: this.editPwd.auth,
            oldPassword: this.editPwd.oldPassword,
            newPassword: this.editPwd.newPassword,
            confirmNewPassword: this.editPwd.confirmNewPassword
          }
          accountPassword(submitPwd).then(() => {
            this.$message.success('修改密码成功')
            this.isToShowPasswordModefier = false
          })
        }
      })
    }
  }
}
</script>

<style>
</style>
