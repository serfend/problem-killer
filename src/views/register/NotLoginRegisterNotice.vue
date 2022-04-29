<template>
  <div>
    <SvgIcon
      icon-class="Message_error"
      style-normal="width:6rem;height:6rem;margin: auto;color:rgb(243, 126, 125)"
      class-name="item-put-center"
    />
    <div class="item-put-center" style="margin: 3rem 0 2rem 0; font-size: 2rem">进入注册页面失败</div>
    <div class="item-put-center" style="margin: 3rem 0 2rem 0; font-size: 1rem">为保证您的账号安全</div>

    <div class="item-put-center" style="margin: 3rem 0 2rem 0; font-size: 1.2rem">
      <span>请</span>
      <el-link type="danger" @click="handle_show_login_page">登录任何一名其他成员的账号</el-link>
      <span>执行注册操作</span>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  components: { SvgIcon },
  methods: {
    handle_show_login_page() {
      this.$router.push({ path: '/vacation/myApply' })
    },
  },
}
</script>

<style lang="scss" scoped>
.item-put-center {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}
</style>
