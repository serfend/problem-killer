<template>
  <div>1</div>
</template>

<script>
export default {
  name: 'BBSMessageBox',
  data: () => ({
    message: null
  }),
  computed: {},
  watch: {
    'message.state': {
      handler(val) {
        const sg = this.$store.state.message.signalR
        if (val !== sg.HubConnectionState.Connected) {
          return
        }
        this.OnConnected()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    onDetail(p) {
      debugger
    },
    onMessage(p) {
      const params = JSON.parse(p).split(':')
      const actions = {
        read: ['已读']
      }
      actions.recv = [
        '新消息',
        user => {
          this.message.send('GetDetail', user, null)
        }
      ]
      const act = actions[params[0]]
      this.$notify.success(`${params[1]}:${act && act[0]}`)

      if (act && act[1]) act[1](params[1])
    },
    init() {
      this.message = this.$store
        .dispatch('message/registerWs', { path: '/ws/message' })
        .then(data => {
          this.message = data
          this.$store.dispatch('message/registerCallback', {
            connection: this.message,
            event: 'new-app-message',
            handler: this.onMessage
          })
          this.$store.dispatch('message/registerCallback', {
            connection: this.message,
            event: 'getDetail',
            handler: this.onDetail
          })
        })
    },
    OnConnected() {
      this.message.send('test', '23')
    }
  }
}
</script>
