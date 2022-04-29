<template>
  <div>
    <el-form>
      <el-form-item label="接收人">
        <el-input v-model="f.to" />
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="f.content" />
      </el-form-item>
    </el-form>
    <el-button @click="send">发送</el-button>
  </div>
</template>

<script>
import * as signalR from '@microsoft/signalr'

export default {
  name: 'AndTest',
  data: () => ({
    connection: null,
    f: {
      to: null,
      content: null
    }
  }),
  mounted() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/ws/message')
      .build()

    this.connection.on('messageReceived', (username, message) => {})
    this.connection.on('new-app-message', username => {
      debugger
    })
    this.connection.on('Send', username => {
      debugger
    })
    this.connection.start().catch(err => console.error(err))
  },
  methods: {
    send() {
      this.connection.send('send', this.f).then(() => {})
    }
  }
}
</script>
