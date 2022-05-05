<template>
  <el-popover placement="top" trigger="click">
    <div>
      <div>授权码是用于敏感操作认证的密钥</div>
      <div>
        <el-popover placement="top" trigger="click" @show="downloadAutherHasShow = true">
          <div style="font-weight:600;align-text:center">
            使用微信扫码获取小程序
            <div>小程序名称：二次验证码</div>
            <div style="color:#f00">非官方软件，请勿充值</div>
            <el-image :src="totpImg" />
          </div>
          <el-link slot="reference" type="primary">获取身份验证器</el-link>
        </el-popover>
      </div>
      <div v-if="authKeyUrl">
        <el-popover placement="top" trigger="click" @show="authKeyUrlHasShow = true">
          <ContactMe
            v-if="authKeyUrlHasShow"
            :content="authKeyUrl"
            description="请使用身份验证器扫描此码（仅首次需要）"
          />
          <el-button
            type="info"
            icon="el-icon-document-copy"
            @click="clipBoard(authKeyUrl,$event)"
          >复制密钥链接</el-button>
          <el-link slot="reference" type="primary">获取当前账号授权码</el-link>
        </el-popover>
      </div>
      <div v-if="!$store.state.user.name||!authKeyUrl">
        <el-alert title="当前未登录,登录后显示授权码" type="error" center />
      </div>
    </div>
    <el-tag slot="reference" type="info" style="margin:0 0 0 20px">
      <span>什么是授权码</span>
      <i class="el-icon-info blue--text" />
    </el-tag>
  </el-popover>
</template>

<script>
import clipBoard from '@/utils/clipboard'
import { getAuthKey } from '@/api/account'
import ContactMe from '@/components/ContactMe'
import totp from '@/assets/jpg/app/totp.jpg'
export default {
  name: 'AuthCodeAbout',
  components: { ContactMe },
  data: () => ({
    downloadAutherHasShow: false,
    authKeyUrlHasShow: false,
    authKeyUrl: null,
    totpImg: ''
  }),
  mounted() {
    this.getAuthKeyImg()
    this.totpImg = totp
  },
  methods: {
    clipBoard,
    getAuthKeyImg() {
      getAuthKey(true).then(r => {
        if (r.url) this.authKeyUrl = r.url
        if (
          !this.$store.state.user.data.isInitPassword &&
          this.$store.state.user.userid !== ''
        ) {
          this.$message.error('注册以来密码从未被修改')
          setTimeout(() => {
            this.$message.error('为了您账号安全，建议尽快更换')
          }, 1000)
        }
      })
    }
  }
}
</script>

<style>
</style>
