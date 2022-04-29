<template>
  <div>
    <BiliComment
      v-if="currentUser&&currentUser.id"
      id="7927df03-bb1e-4a2a-b8cb-04a1039c3d23"
      ref="comment"
    />
    <Login v-else />
  </div>
</template>

<script>
export default {
  name: 'Suggest',
  components: {
    BiliComment: () => import('@/components/BiliComment'),
    Login: () => import('@/views/login')
  },
  data: () => ({
    comment: '',
    options: {
      placeholder: '意见反馈,图像上传格式【![名称](网址链接)】'
    },
    loading: false
  }),
  computed: {
    currentUser() {
      return this.$store.state.user.data
    }
  },
  methods: {
    send_comment() {
      this.loading = true
      const comment = this.$refs.editor.get_content()
      const comp = this.$refs.comment
      const cp = comp.comp()[0]
      cp.send_content(comment, () => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.cmd-bar {
  margin-top: 2rem;
  float: right;
  .cmd-btn {
    min-width: 8rem;
  }
}
</style>
