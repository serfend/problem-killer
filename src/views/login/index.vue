<template>
  <el-card v-loading="loading" style="text-align:center">
    <el-row :gutter="20">
      <el-col v-loading="!bg" :span="14">
        <el-image v-if="bg" :src="bg" fit="contain" class="full-img" />
      </el-col>
      <el-col :span="10">
        <LoginForm @login="handleLogin" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import bg from '@/assets/jpg/app/jianghe_logo.jpg'
import LoginForm from './LoginForm'
export default {
  name: 'Login',
  components: { LoginForm },
  data: () => ({
    bg: bg,
    loading: false
  }),
  methods: {
    handleLogin(v) {
      this.loading = true
      console.log('login success,load user info')
      this.$store
        .dispatch('user/initUserInfo')
        .then(d => {
          console.log('complete user info load')
          this.$emit('login', v)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.full-img {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.4);
}
</style>
