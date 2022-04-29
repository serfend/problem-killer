<template>
  <el-footer height="2rem" class="footer" :style="{opacity:show?1:0,position:show?'absolute':''}">
    <el-popover placement="top" trigger="hover" @show="contactMeHasShow = true">
      <ContactMe v-if="contactMeHasShow" content="https://u.wechat.com/MLhlZ338yxcIIvngbsHjn8Y" />
      <el-link slot="reference" type="primary">联系我们</el-link>
    </el-popover>
    <el-popover v-model="show_suggest" trigger="hover">
      <SvgIcon icon-class="community_line" />
      <span>意见反馈在这里</span>
      <el-popover slot="reference" placement="top" trigger="hover" @show="helpMeHasShow = true">
        <ContactMe
          v-if="helpMeHasShow"
          content="https://serfend.top/s/b4afa7"
          description="扫码反馈意见/问题"
        />
        <el-link slot="reference" type="primary" href="/#/settings/system/Comments/suggest/">意见反馈</el-link>
      </el-popover>
    </el-popover>
    <el-popover placement="top" trigger="hover" @show="policyHasShow = true">
      <ContactMe
        v-if="policyHasShow"
        content="https://serfend.top/s/policy_vacation.md"
        description="扫码查看相关政策"
      />
      <el-link slot="reference" type="primary" href="/#/markdown?filename=policy_vacation.md">相关政策</el-link>
    </el-popover>
    <div style="float:right;color:#bbb">
      <span>©2020 sf</span>
      <a v-if="ICP" href="http://beian.miit.gov.cn">{{ ICP }}</a>
      <span>{{ $store.state.settings.title }}</span>
      <el-popover trigger="hover">
        <p>{{ $store.state.settings.notice }}</p>
        <el-link slot="reference" href="#/about/version">{{ $store.state.settings.version }}</el-link>
      </el-popover>
    </div>
  </el-footer>
</template>

<script>
import ContactMe from '@/components/ContactMe'
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'Footer',
  components: { ContactMe, SvgIcon },
  props: {
    show: { type: Boolean, default: true },
  },
  data: () => ({
    contactMeHasShow: false,
    helpMeHasShow: false,
    policyHasShow: false,
    show_suggest: false
  }),
  computed: {
    ICP() {
      return process.env.VUE_APP_ICP
    }
  },
  mounted() {
    const user = this.$store.state.user.id
    const id = `current_account_last_show_suggest:${user}`
    const current_account_last_show_suggest = localStorage.getItem(id)
    if (new Date() - new Date(current_account_last_show_suggest) > 56e7) {
      localStorage.setItem(id, new Date())
      this.show_suggest = true
    }
  }
}
</script>
<style lang="scss" scoped>
.footer {
  // position: absolute;
  z-index: 10000;
  width: 100%;
  left: 0;
  bottom: 0;
  transition: all 0.5s;
  background: #f5f6f53f;
  border-top: 0.1rem solid #ebebeb9f;
  line-height: 1.5rem;
  font-size: 1rem;
  .el-link {
    font-size: 1rem;
    margin-left: 1rem;
  }
}
.footer:hover {
  background: #f5f6f5;
  border-top: 0.1rem solid #ebebeb;
}
</style>
