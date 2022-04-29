<template>
  <el-collapse style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
    <el-collapse-item title="授权人">
      <template slot="title">
        <AuthCodeAbout />
        <div v-if="$store.state.user.name" style="margin-left:1rem">
          <el-tooltip>
            <template slot="content">当前默认授权人</template>
            <el-tag type="success">{{ $store.state.user.name }}</el-tag>
          </el-tooltip>
        </div>
        <span v-else style="color:#ff8f8f">未登录,请使用授权码</span>
      </template>
      <el-form>
        <el-form-item label="授权人">
          <UserSelector
            :code.sync="innerForm.authByUserId"
            :default-info="defaultUser"
            :select-name="selectName"
          />
        </el-form-item>
        <el-form-item label="授权码">
          <CodeInput
            :listen-user-input.sync="collaspseIsOpen"
            :check-code-method="checkCode"
            :code.sync="innerForm.code"
          />
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { checkAuthCode } from '@/api/account'
export default {
  name: 'AuthCode',
  components: {
    CodeInput: () => import('./CodeInput'),
    AuthCodeAbout: () => import('./AuthCodeAbout'),
    UserSelector: () => import('@/components/User/UserSelector')
  },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: { type: Object, default: null },
    authCheckMethod: { type: Function, default: checkAuthCode },
    selectName: { type: String, default: null }
  },
  data: () => ({
    collaspseIsOpen: false,
    innerForm: {
      authByUserId: null,
      code: null
    },
    defaultUser: null
  }),
  computed: {
    currentUser() {
      return this.$store.state.user.userid
    }
  },
  watch: {
    currentUser: {
      handler(val) {
        this.innerForm.authByUserId = val
        this.defaultUser = `${this.$store.state.user.name}(${val})`
      },
      immediate: true
    },
    innerForm: {
      handler(val) {
        if (val.code === '') val.code = null
        if (!val.authByUserId) {
          val.authByUserId = null
        } else {
          this.updateForm(val)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    updateForm(val) {
      this.$emit('update:form', val)
      this.$emit('change', val)
    },
    checkCode() {
      return new Promise((res, rej) => {
        if (!this.innerForm.authByUserId) {
          this.$message.error('请输入id')
          return rej('id未输入')
        }
        const fn = this.authCheckMethod
        fn(this.innerForm.authByUserId, this.innerForm.code)
          .then(() => {
            this.$emit('update:status', true)
            res()
          })
          .catch(err => {
            this.$emit('update:status', false)
            rej(err)
          })
      })
    }
  }
}
</script>
