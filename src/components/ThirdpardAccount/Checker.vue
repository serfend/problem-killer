<template>
  <span>
    <el-input
      v-model="account_id"
      v-bind="$attrs"
      auto-complete="on"
      type="text"
      :style="{width:width}"
      @change="$emit('change',id)"
    />
    <div style="margin-top:0.5rem">
      <el-input
        v-model="check_code"
        placeholder="请输入验证码"
        :style="{width:width}"
        @change="handle_check"
      />
      <el-button v-loading="loading" :disabled="!can_send" @click="send_verify">{{ desc }}</el-button>
    </div>
  </span>
</template>

<script>
const Const_CanSend = '发送验证码'
import {
  sendThirdpardVerify,
  confirmThirdpardVerify,
} from '@/api/common/thirdpard_account'
export default {
  name: 'ThirdpardAccountChecker',
  model: {
    event: 'change',
    prop: 'id',
  },
  props: {
    sendInterval: {
      type: Number,
      default: 60,
    },
    width: {
      type: String,
      default: '14rem',
    },
    name: {
      type: String,
      default: null,
    },
    id: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    loading: false,
    last_sending: 0,
    counter: 0,
    desc: null,
    send_counter: 0,
    check_code: null,
    account_id: '',
  }),
  computed: {
    can_send() {
      return this.desc === Const_CanSend
    },
  },
  watch: {
    id: {
      handler(val) {
        this.account_id = val
      },
      immediate: true,
    },
  },
  mounted() {
    this.refresh_desc()
  },
  methods: {
    description() {
      const now = new Date()
      const interval = this.sendInterval
      const next_send = this.last_sending - 0 + interval * 10e2
      if (next_send < now) return Const_CanSend
      const t = Math.round((next_send - now) / 10e2)
      return `冷却中~${t}秒`
    },
    refresh_desc() {
      this.desc = this.description()
    },
    refresh_tick() {
      if (this.send_counter) clearTimeout(this.send_counter)
      this.refresh_desc()
      // console.log('tick', this.counter)
      this.counter++
      if (this.counter > 60) return
      this.send_counter = setTimeout(() => {
        this.refresh_tick()
      }, 1000)
    },
    send_verify() {
      this.last_sending = new Date()
      this.loading = true
      sendThirdpardVerify({ id: this.id, name: this.name })
        .then((data) => {
          this.counter = 0
          this.refresh_tick()
          this.$msgbox({
            title: '验证码已发送',
            message: `请登录${name}查看验证码并填入左侧输入框后点击确认`,
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    confirm_verify() {
      confirmThirdpardVerify().then(() => {})
    },
    handle_check() {
      console.log(this.check_code)
    },
  },
}
</script>

<style>
</style>
