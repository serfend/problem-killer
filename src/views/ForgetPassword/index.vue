<template>
  <div>
    <el-card>
      <template #header>
        <h2>找回账号</h2>
      </template>
      <div class="page-container">
        <el-collapse v-model="activePannel" accordion>
          <el-collapse-item name="0" title="说明">
            <div class="warning">
              <p>此页面用于恢复账号或找回用户名密码</p>
              <p>1. 密码丢失可以通过本人或上级的授权码找回</p>
              <p>2. 遗忘了用户名可以通过两种方式找回:1.依据姓名找回 2.依据单位找回</p>
              <p>3. 账号被删除后可通过管理员在此处操作恢复</p>
            </div>
          </el-collapse-item>
          <el-collapse-item name="1" title="用户查找">
            <el-row :gutter="20">
              <el-col :lg="8" :md="12" :sm="24">
                <el-card header="找回账号 - 通过姓名">
                  <FindUserByRealName />
                </el-card>
              </el-col>
              <el-col :lg="8" :md="12" :sm="24">
                <el-card header="找回账号 - 通过单位">
                  <FindUserByCompany />
                </el-card>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="2" title="账号恢复和找回密码">
            <el-row :gutter="20">
              <el-col :lg="8" :md="12" :sm="24">
                <el-card header="找回密码">
                  <ResetPassword :old-psw-input="false" />
                </el-card>
              </el-col>
              <el-col :lg="8" :md="12" :sm="24">
                <el-card>
                  <div slot="header">
                    <span style="font-size:1.5rem;font-weight:600">恢复账号提交</span>
                    <el-popover trigger="hover">
                      <div style="width:12rem">
                        <p>新恢复的账号将出现在其原所属单位，并恢复其原来的信息。</p>
                        <p>被删除的休假记录也会一并被恢复，如需继续删除休假记录，需手动操作。</p>
                      </div>
                      <i slot="reference" class="el-icon-info blue--text" />
                    </el-popover>
                  </div>
                  <el-form label-width="5rem">
                    <el-alert
                      v-if="account.id && account.id.length>5"
                      :type="is_removed?'success':'error'"
                      style="margin-bottom:1rem"
                    >{{ errorinfo }}</el-alert>
                    <el-form-item label="账号">
                      <el-input v-model="account.id" placeholder="输入已被删除的账号" />
                    </el-form-item>
                    <el-form-item label="恢复原因">
                      <el-input v-model="account.reason" type="textarea" rows="5" />
                    </el-form-item>
                    <AuthCode v-model="account.auth" select-name="忘记密码" />
                    <el-button
                      v-loading="loading"
                      :disabled="!is_removed"
                      type="success"
                      style="margin-top:1rem;width:100%"
                      @click="restore_account"
                    >恢复</el-button>
                  </el-form>
                </el-card>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script>
import { restoreAccount } from '@/api/account'
import { getUserBase } from '@/api/user/userinfo'
import { debounce } from '@/utils'
import ResetPassword from '@/components/ResetPassword'
import FindUserByRealName from '@/components/User/FindUserByRealName'
import FindUserByCompany from '@/components/User/FindUserByCompany'
export default {
  name: 'ForgetPassword',
  components: {
    ResetPassword,
    FindUserByRealName,
    FindUserByCompany,
    AuthCode: () => import('@/components/AuthCode')
  },
  data: () => ({
    activePannel: '0',
    account: {
      auth: {},
      id: '',
      reason: ''
    },
    loading: false,
    is_removed: true
  }),
  computed: {
    errorinfo() {
      return this.is_removed
        ? '当前账号处于不存在状态，可尝试恢复。'
        : '当前账号存在，不可恢复'
    },
    requireCheck() {
      return debounce(() => {
        this.check()
      }, 300)
    }
  },
  watch: {
    'account.id': {
      handler(val) {
        this.$nextTick(() => {
          this.check()
        })
      }
    }
  },
  methods: {
    restoreAccount,
    check() {
      this.loading = true
      getUserBase(this.account.id, true)
        .then(data => {
          this.is_removed = !data || !data.base || !data.base.cid
        })
        .catch(e => {
          this.is_removed = true
        })
        .finally(() => {
          this.loading = false
        })
    },
    restore_account() {
      this.loading = true
      const data = Object.assign({}, this.account)
      delete data.auth
      const auth = this.account.auth
      restoreAccount({ auth, data })
        .then(() => {
          this.$message.success('已成功恢复')
        })
        .finally(() => {
          this.loading = false
          this.check()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.container,
.page-container {
  padding: 0;
}

.page-container h2 {
  font-size: 28px;
  color: #1f2d3d;
  margin: 0;
}

.page-container h3 {
  font-size: 22px;
}

.page-container h2,
.page-container h3,
.page-container h4,
.page-container h5 {
  font-weight: 400;
  color: #1f2f3d;
}

.page-container h2:hover a,
.page-container h3:hover a,
.page-container h4:hover a,
.page-container h5:hover a {
  opacity: 0.4;
}

.page-container h2 a,
.page-container h3 a,
.page-container h4 a,
.page-container h5 a {
  float: left;
  margin-left: -20px;
  opacity: 0;
  cursor: pointer;
}

.page-container h2 a:hover,
.page-container h3 a:hover,
.page-container h4 a:hover,
.page-container h5 a:hover {
  opacity: 0.4;
}

.page-container p {
  font-size: 14px;
  color: #5e6d82;
  line-height: 1.5em;
}

.page-container .tip {
  padding: 8px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin: 20px 0;
}

.page-container .tip code {
  background-color: hsla(0, 0%, 100%, 0.7);
  color: #445368;
}

.page-container .warning {
  padding: 8px 16px;
  background-color: #fff6f7;
  border-radius: 4px;
  border-left: 5px solid #fe6c6f;
  margin: 20px 0;
}

.page-container .warning code {
  background-color: hsla(0, 0%, 100%, 0.7);
  color: #445368;
}
</style>
