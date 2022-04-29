<template>
  <div>
    <div v-if="currentUser&&currentUser.id">
      <el-card>
        <el-card>
          <el-form>
            <el-form-item label="选择成员">
              <UserSelector :code.sync="nowSelectRealName" default-info="未选择" style="display: inline; margin: 0 1rem 0 0" @change="handleCurrentChange" />
            </el-form-item>
            <el-form-item label="选择单位">
              <CompanySelector v-model="nowSelectCompany" placeholder="选择需要检查的单位" style="width: 40%" />
            </el-form-item>
            <el-button type="primary" :loading="loading" @click="requireLoadWaitToAuthRegisterUsers">刷新</el-button>
            <CompanyTypeSelector v-model="MembersQuery.userCompanyType" />
          </el-form>
        </el-card>
        <BatchOperation
          v-if="currentFocusUsers.length"
          ref="BatchOperation"
          v-model="currentFocusUsers"
          class="right-hover-panel flashing-layout-right"
          @requireUpdate="requireLoadWaitToAuthRegisterUsers"
        />
        <el-table
          v-loading="loading"
          :data="waitToAuthRegisterUsers"
          highlight-current-row
          style="width: 100%"
          @row-dblclick="handleCurrentChange"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="姓名" width="100">
            <template slot-scope="scope">
              <el-popover placement="right-start" trigger="hover" @show="scope.row.userHasShow = true">
                <User :data="scope.row" :can-load-avatar="scope.row.userHasShow" />
                <span slot="reference">{{ scope.row.realName }}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="dutiesName" label="职务" width="150" />
          <el-table-column label="全年假" width="70">
            <template slot-scope="scope">{{ scope.row.vacation.yearlyLength }}天</template>
          </el-table-column>
          <el-table-column label="路途" width="50">
            <template slot-scope="scope">{{ scope.row.vacation.maxTripTimes }}次</template>
          </el-table-column>
          <el-table-column prop="accountAuthStatus" label="状态" width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.accountAuthStatus == 1?'success': scope.row.accountAuthStatus == 0?'info':'danger'">
                {{ scope.row.accountAuthStatus == 1 ? '已认证' : scope.row.accountAuthStatus == 0 ? '待认证' : '已退回' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="vacation.description" label="休假详情描述">
            <template slot-scope="scope">
              <span slot="reference">{{ scope.row.vacation.description }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="vacation.description" label="休假率">
            <template slot-scope="scope">
              <VacationDescription :users-vacation="scope.row.vacation" />
            </template>
          </el-table-column>
        </el-table>
        <Pagination :pagesetting.sync="MembersQuery.page" :total-count="MembersQueryTotalCount" />
      </el-card>
    </div>

    <Login v-else />
    <el-dialog :visible.sync="approve_show">
      <el-tabs v-model="detail_pane">
        <el-tab-pane label="基本信息">
          <Register
            v-if="detail_pane=='0'"
            :user-info="current_select_id"
            @requireUpdate="requireLoadWaitToAuthRegisterUsers"
            @requireHide="approve_show = false"
          />
        </el-tab-pane>
        <el-tab-pane label="权限管理">
          <UserPermission v-if="detail_pane=='1'" :user-id="current_select_id&&current_select_id.id" />
        </el-tab-pane>
        <el-tab-pane label="操作日志">
          <div v-if="detail_pane=='2'">
            <Loading />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { getMembers } from '@/api/company'
import { getUsersVacationLimit, getUserAvatar } from '@/api/user/userinfo'
import { checkUserValid } from '@/utils/validate'
import { debounce } from '@/utils'
import { companyTypes } from '../components/dictionary'
export default {
  name: 'Approve',
  components: {
    UserSelector: () => import('@/components/User/UserSelector'),
    CompanySelector: () => import('@/components/Company/CompanySelector'),
    VacationDescription: () => import('@/components/Vacation/VacationDescription'),
    Pagination: () => import('@/components/Pagination'),
    Login: () => import('@/views/login'),
    User: () => import('@/components/User'),
    Register: () => import('../register/RegForm'),
    UserPermission: () => import('./UserPermission'),
    Loading: () => import('@/views/Loading'),
    BatchOperation: () => import('./BatchOperation'),
    CompanyTypeSelector: () => import('../components/CompanyTypeSelector')
  },
  data: () => ({
    MembersQuery: {
      userCompanyType: 0,
      page: {
        pageIndex: 0,
        pageSize: 10
      }
    },
    companyTypes,
    nowSelectRealName: '', // 通过姓名选择器选中的人员
    MembersQueryTotalCount: 0,
    waitToAuthRegisterUsers: [],
    current_select_id: null,
    nowSelectCompany: null,
    loading: false,
    detail_pane: '',
    currentFocusUsers: []
  }),
  computed: {
    currentUser () {
      return this.$store.state.user.data
    },
    currentCmp () {
      return this.$store.state.user.companyid
    },
    requireLoadWaitToAuthRegisterUsers () {
      return debounce(() => {
        this.loadWaitToAuthRegisterUsers()
      }, 500)
    },
    approve_show: {
      get () {
        return this.current_select_id !== null
      },
      set (val) {
        if (!val) {
          this.current_select_id = null
        }
      }
    }
  },
  watch: {
    currentCmp: {
      handler (val) {
        this.nowSelectCompany = {
          code: val
        }
        this.not_login_show = !val
      },
      immediate: true
    },
    nowSelectCompany: {
      handler (val) {
        if (val) {
          this.MembersQuery.page.pageIndex = 0
          this.requireLoadWaitToAuthRegisterUsers()
        }
      },
      immediate: true
    },
    MembersQuery: {
      handler (val) {
        if (val) {
          this.requireLoadWaitToAuthRegisterUsers()
        }
      },
      deep: true
    }
  },
  methods: {
    handleSelectionChange (v) {
      this.currentFocusUsers = v
    },
    handleCurrentChange (val) {
      // console.log('approve user change to', val)
      if (!val) return
      this.current_select_id = val
    },
    async loadSingleUser () {
      const fn = []
      for (let i = 0; i < this.waitToAuthRegisterUsers.length; i++) {
        fn.push(
          new Promise((resolve, reject) => {
            const item = this.waitToAuthRegisterUsers[i]
            return Promise.all([
              getUserAvatar(item.id),
              getUsersVacationLimit({ userid: item.id })
            ])
              .then(([avatar, vacation]) => {
                item.avatar = avatar.url
                item.vacation = vacation
                resolve()
              })
              .catch(err => reject(err))
          })
        )
      }
      await Promise.all(fn)
    },
    loadUserList (list) {
      const result = list.map(item => {
        const obj = {
          userHasShow: false,
          avatar: '',
          vacation: {},
          accountAuthStatus: checkUserValid(item.inviteBy)
        }
        return Object.assign(item, obj)
      })
      return result
    },
    // 刷新待认证人员列表
    async loadWaitToAuthRegisterUsers () {
      this.loading = true
      const code = this.nowSelectCompany.code
      const { MembersQuery } = this
      const { page } = MembersQuery
      let q = Object.assign({ code }, this.MembersQuery)
      q = Object.assign(q, page)
      getMembers(q)
        .then(async data => {
          this.MembersQueryTotalCount = data.totalCount
          this.waitToAuthRegisterUsers = this.loadUserList(data.list)
          await this.loadSingleUser()
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/animation.scss';
</style>
