<template>
  <div>
    <el-input
      v-model="nowSelectRealName"
      style="width: 100%"
      placeholder="按姓名查找"
      @input="handleUserSelectByRealnameChange"
    />
    <div v-infinite-scroll="loadNextPage" v-loading="loading">
      <el-collapse v-model="nowCollapseSelectUserId" accordion @change="selectUserChange">
        <el-collapse-item v-for="(u,index) in usersByRealName" :key="u.id" :name="u.id">
          <template slot="title">
            <el-tag>{{ u.dutiesName }}</el-tag>
            {{ u.companyName }} {{ u.realName }}
          </template>
          <User
            :data="u"
            :can-load-avatar="u.canLoadAvatar"
            :avatar.sync="usersByRealName[index].avatar"
            @avatar-load="avatarLoad(index)"
          />
        </el-collapse-item>
      </el-collapse>
      <el-button
        v-if="hasNextPage"
        v-loading="loading"
        type="text"
        style="width:100%"
        @click="loadNextPage"
      >{{ loading?'加载中...':'点击加载更多记录' }}</el-button>
      <div v-else style="height:1px;background-color:#dcdfe6;margin:0.5rem 0.2rem" />
    </div>
  </div>
</template>

<script>
import User from '@/components/User'
import { getUserIdByRealName } from '@/api/user/userinfo'
export default {
  name: 'FindUserByRealName',
  components: { User },
  model: {
    prop: 'code',
    event: 'change'
  }, // TODO support auto load user from father-component
  props: {
    code: { type: String, default: null }
  },
  data: () => ({
    loading: false,
    nowSelectRealName: '',
    nowIndex: 0,
    usersByRealName: [],
    userDict: {},
    nowCollapseSelectUserId: '',
    hasNextPage: false
  }),
  watch: {
    usersByRealName: {
      handler(val) {
        if (!val) return
        this.userDict = {}
        const vLen = val.length
        for (let i = 0; i < vLen; i++) {
          this.userDict[val[i].id] = val[i]
        }
      }
    }
  },
  methods: {
    avatarLoad(index) {
      this.$nextTick(() => {
        this.$emit('update:avatar', this.usersByRealName[index].avatar)
      })
    },
    selectUserChange(id) {
      if (!id) return
      this.loadCollapseUserAvatarRealName(id)
    },
    loadCollapseUserAvatarRealName(id) {
      const u = this.userDict[id]
      this.$emit('change', u)
      if (u.avatar) this.$emit('update:avatar', u.avatar)
      else u.canLoadAvatar = true
      this.$message.success(`已选择:${u.realName}(${u.id})`)
    },
    handleUserSelectByRealnameChange() {
      this.usersByRealName = []
      if (!this.nowSelectRealName) return
      this.hasNextPage = true
      this.nowIndex = 0
      this.loadNextPage()
    },
    loadNextPage() {
      const realName = this.nowSelectRealName
      if (this.loading || !realName || !this.hasNextPage) return
      this.loading = true
      const item = {
        realName,
        pageIndex: this.nowIndex++,
        pageSize: 10,
        fuzz: true
      }
      getUserIdByRealName(item)
        .then(data => {
          this.usersByRealName = this.usersByRealName.concat(
            data.list.map(li => {
              li.canLoadAvatar = false
              li.avatar = null
              return li
            })
          )
          this.hasNextPage = data.totalCount > this.usersByRealName.length
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style>
</style>
