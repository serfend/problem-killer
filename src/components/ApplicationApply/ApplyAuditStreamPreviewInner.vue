<template>
  <div v-loading="loading">
    <div v-if="solutionName&&!validateInfoInner">
      <el-steps
        :active="nowStep>=0?nowStep:(streams?streams.length:0)"
        :finish-status="nowStep>=0?'success':'finish'"
        align-center
      >
        <el-step v-for="s in streams" :key="s.index">
          <template #title>
            <div style="white-space:nowrap">{{ s.name }}</div>
            <el-tooltip placement="right" effect="light">
              <template #content>
                <h3>{{ title }}</h3>
                <div style="font-size:18px;color:#ccc">{{ s.name }}</div>
                <div
                  style="font-size:14px"
                >{{ `需要[${s.firstMemberCompanyName}]${getNeedAudit(s.requireMembersAcceptCount)}进行审批` }}</div>
              </template>
              <div
                style="white-space:nowrap"
              >{{ s.firstMemberCompanyName }}({{ getNeedAudit(s.requireMembersAcceptCount) }})</div>
            </el-tooltip>
          </template>
          <template slot="description">
            <div v-for="u in s.membersFitToAudit" :key="u">
              <span v-if="user_should_show(u,s)">
                <UserFormItem :userid="u" :type="userStatus[s.index][u]" style="margin-top:0.5rem" />
              </span>
            </div>
            <div
              v-for="u in s.membersAcceptToAudit.filter(i=>!s.membersFitToAudit.find(j=>j==i))"
              :key="u"
            >
              <UserFormItem :userid="u" :type="userStatus[s.index][u]" style="margin-top:0.5rem" />
            </div>
          </template>
        </el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
import { getUserCompany } from '@/api/user/userinfo'
import { auditStream } from '@/api/audit/handle'
import { companiesManagers } from '@/api/company'
import UserFormItem from '@/components/User/UserFormItem'
export default {
  name: 'ApplyAuditStreamPreviewInner',
  components: { UserFormItem },
  props: {
    userid: { type: String, default: null },
    auditStatus: { type: Array, default: null },
    nowStep: { type: Number, default: -1 },
    entityType: { type: String, default: 'vacation' },
    entityTypeDesc: { type: String, default: null },
    title: { type: String, default: null },
    validateInfo: { type: String, default: null }
  },
  data: () => ({
    loading: false,
    solutionName: null,
    streams: [],
    managers: {},
    userStatus: []
  }),
  computed: {
    validateInfoInner: {
      get() { return this.validateInfo },
      set(v) {
        this.$emit('update:validateInfo', v)
      }
    }
  },
  watch: {
    auditStatus: {
      handler(val) {
        this.streams = val
        this.solutionName = '审批流'
      },
      deep: true,
      immediate: true
    },
    userid: {
      handler(val) {
        if (val) {
          this.refresh()
        }
      },
      immediate: true
    },
    entityTypeDesc: {
      handler(val) {
        this.refresh()
      }
    },
    solutionName: {
      handler(val) {
        this.$emit('update:solutionName', val)
      },
      immediate: true
    },
    streams: {
      handler(val) {
        if (val) this.streamModify()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    refresh() {
      this.loading = true
      this.solutionName = null
      auditStream(this.userid, this.entityTypeDesc || this.entityType).then(
        data => {
          this.solutionName = data.solutionName
          this.streams = data.steps
          this.validateInfoInner = null
        }
      ).catch(e => {
        this.validateInfoInner = (e && e.message) || '未知原因'
      }).finally(() => {
        this.loading = false
      })
    },
    user_should_show(u, s) {
      const managers = this.managers
      const userStatus = this.userStatus
      const env_init = managers[s.firstMemberCompanyCode] && userStatus[s.index]
      if (!env_init) return false
      const is_manager = managers[s.firstMemberCompanyCode].indexOf(u) > -1
      const status = userStatus[s.index][u]
      const is_handled = status === 'success' || status === 'danger'
      return !is_manager || is_handled
    },
    getNeedAudit(requireAuditMemberCount) {
      if (requireAuditMemberCount < 0) return '无需'
      if (requireAuditMemberCount === 0) return '所有人'
      return `${requireAuditMemberCount}人`
    },
    streamModify() {
      this.loading = true
      this.initUserStatus()
      this.initCompanyManager()
    },
    initUserStatus() {
      this.userStatus = []
      const streams = this.streams
      for (let i = 0; i < streams.length; i++) {
        const index = streams[i].index
        if (!this.userStatus[index]) this.userStatus[index] = {}
        const dic = this.userStatus[index]
        Object.keys(streams[i].membersFitToAudit).map(u => {
          dic[u] = 'primary'
        })
        Object.keys(streams[i].membersAcceptToAudit).map(u => {
          dic[u] = 'success'
        })
      }
    },
    initCompanyManagerDirect() {
      const waitToLoad = []
      const streams = this.streams
      for (let i = 0; i < streams.length; i++) {
        const mCode = streams[i].firstMemberCompanyCode
        if (waitToLoad.indexOf(mCode) === -1) waitToLoad.push(mCode)
      }
      companiesManagers(waitToLoad).then(data => {
        Object.keys(data.companies).map(c => {
          if (!data.companies[c].list) {
            this.managers[c] = {}
            return
          }
          this.managers[c] = data
            .companies[c]
            .list
            .map(item => item.id)
        })
      }).finally(() => {
        this.loading = false
      })
    },
    async initCompanyManager() {
      const streams = this.streams
      const loadUserCompanyCodeActions = []
      const loadUserCompanyCodeActionsIndex = []
      for (let i = 0; i < streams.length; i++) {
        const s = streams[i]
        if (!s.firstMemberCompanyCode && s.membersFitToAudit.length > 0) {
          loadUserCompanyCodeActions.push(
            getUserCompany(s.membersFitToAudit[0], true)
          )
          loadUserCompanyCodeActionsIndex.push(i)
        }
      }
      if (loadUserCompanyCodeActions.length > 0) {
        const datas = await Promise.all(loadUserCompanyCodeActions)
        for (let i = 0; i < datas.length; i++) {
          streams[loadUserCompanyCodeActionsIndex[i]].firstMemberCompanyCode =
            datas[i].company.code
        }
      } else {
        this.initCompanyManagerDirect()
      }
    }
  }
}
</script>

<style>
</style>
