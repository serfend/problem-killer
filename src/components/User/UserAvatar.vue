<template>
  <div class="user-avatar-container">
    <el-image
      v-loading="loading"
      v-bind="$attrs"
      :src="data.src"
      class="user-avatar"
      :style="Object.assign(styleNormal||{},{width:size,height:size})"
    >
      <slot slot="placeholder" name="placeholder" />
    </el-image>
  </div>
</template>

<script>
import { getUserAvatar } from '@/api/user/userinfo'
import defaultAvatar from '@/assets/plain/defaultAvatar.js'
export default {
  name: 'UserAvatar',
  props: {
    user: { type: String, default: null },
    avatar: { type: String, default: null },
    styleNormal: { type: Object, default: null },
    size: { type: String, default: '40px' }
  },
  data: () => ({
    loading: false,
    data: {
      src: defaultAvatar
    }
  }),
  watch: {
    user: {
      handler(val) {
        this.refresh()
      },
      immediate: true
    },
    avatar: {
      handler(val) {
        this.refresh()
      },
      immediate: true
    }
  },
  methods: {
    refresh() {
      this.loading = true
      getUserAvatar(this.user, this.avatar, true)
        .then(d => {
          this.data.src = d.url
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.user-avatar-container {
  margin: 0 1rem 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .user-avatar {
    border-radius: 50%;
  }
}
</style>
