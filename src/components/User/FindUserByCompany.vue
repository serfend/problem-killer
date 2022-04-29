<template>
  <div>
    <el-switch v-model="asManage" active-text="按编制单位" inactive-text="按管理单位" />
    <CompanySelector v-model="company" placeholder="选择单位" />
    <el-collapse
      v-model="nowCollapseSelectUserId"
      accordion
      @change="loadCollapseUserAvatarCompany"
    >
      <el-collapse-item v-for="u in usersByCompany" :key="u.id" :name="u.id">
        <template slot="title">
          <el-tag>{{ u.dutiesName }}</el-tag>
          {{ u.companyName }} {{ u.realName }}
        </template>
        <User :data="u" :can-load-avatar="u.canLoadAvatar" />
      </el-collapse-item>
      <el-button
        v-if="company && company.code && hasNextPage"
        v-infinite-scroll="nextPage"
        v-loading="loading"
        type="text"
        style="width:100%"
        @click="nextPage"
      >{{ loading?'加载中...':'点击加载更多记录' }}</el-button>
      <div v-else style="height:1px;background-color:#dcdfe6;margin:0.5rem 0.2rem" />
    </el-collapse>
  </div>
</template>

<script>
import CompanySelector from '@/components/Company/CompanySelector'
import User from '@/components/User'
import { getMembers } from '@/api/company'

export default {
  name: 'FindUserByCompany',
  components: { CompanySelector, User },
  data: () => ({
    loading: false,
    company: null,
    asManage: false,
    usersByCompany: [],
    hasNextPage: true,
    pages: {
      pageIndex: 0,
      pageSize: 20
    },
    nowCollapseSelectUserId: ''
  }),
  watch: {
    company: {
      handler(val) {
        if (!val) return
        this.pages.pageIndex = -1
        this.usersByCompany = []
        this.hasNextPage = true
        this.$nextTick(() => {
          this.nextPage()
        })
      },
      immediate: true
    }
  },
  methods: {
    nextPage() {
      const code = this.company && this.company.code
      const { asManage } = this
      if (this.loading || !code || !this.hasNextPage) return
      const item = { code, asManage }
      this.pages.pageIndex++
      const query = Object.assign(this.pages, item)
      this.loading = true
      getMembers(query)
        .then(data => {
          const list = data.list.map(li => {
            li.canLoadAvatar = false
            return li
          })
          this.usersByCompany = this.usersByCompany.concat(list)
          this.hasNextPage = data.totalCount > this.usersByCompany.length
        })
        .finally(() => {
          this.loading = false
        })
    },
    mapUser(li) {
      return {
        description: `${li.companyName}${li.dutiesName}`,
        id: li.id,
        value: li.id,
        realName: li.realName,
        avatar: li.avatar
      }
    },
    loadCollapseUserAvatarCompany(id) {
      return this.loadCollapseUserAvatar(this.usersByCompany, id)
    },
    loadCollapseUserAvatar(users, id) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === id) {
          users[i].canLoadAvatar = true
          break
        }
      }
    }
  }
}
</script>

<style>
</style>
