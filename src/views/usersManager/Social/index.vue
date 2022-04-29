<template>
  <div>
    <el-card header="选取和授权" class="margin-card">
      <el-form>
        <el-form-item label="用户">
          <UserSelector :code.sync="userid" :default-info="currentUser.realName" />
        </el-form-item>
        <el-form-item label="授权">
          <AuthCode :form.sync="auth" select-name="家庭情况编辑" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-show="social" v-loading="loading_social" class="margin-card">
      <template slot="header">
        <span>用户当前</span>
        <el-button :disabled="!socialModefied" type="success" @click="submitNewSettle">保存修改</el-button>
        <el-button type="info" @click="refreshSocial">取消</el-button>
      </template>
      <el-form>
        <UserSocial :form="social" />
        <VacationDescriptionContent :users-vacation="vacation" style="margin-top:1rem" />
      </el-form>
    </el-card>

    <el-card v-show="userid" v-loading="loading_record" class="margin-card">
      <template slot="header">
        <span>家庭变更记录</span>
        <el-button type="success" icon="el-icon-refresh" circle @click="refreshRecord" />
      </template>
      <el-table :data="records">
        <el-table-column label="ID" width="50rem">
          <template slot-scope="scope">{{ scope.row.code }}</template>
        </el-table-column>
        <el-table-column label="说明">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.description&&scope.row.description.length>30"
              trigger="hover"
            >
              <el-input v-model="scope.row.description" type="textarea" autosize />
              <el-link slot="reference" type="primary">查看详情</el-link>
            </el-popover>
            <el-input v-else v-model="scope.row.description" type="textarea" />
          </template>
        </el-table-column>
        <el-table-column label="计算长度/天">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.length" type="Number" style="width:100%" />
          </template>
        </el-table-column>
        <el-table-column label="作用节点" min-width="140rem">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.updateDate"
              value-format="yyyy-MM-dd"
              style="width:100%"
            />
          </template>
        </el-table-column>
        <el-table-column label="作为年度初始化">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isNewYearInitData" />
          </template>
        </el-table-column>
        <el-table-column label="作为年度初始化">
          <template slot-scope="scope">
            <el-button
              type="success"
              :disabled="prevList[scope.row.code]==JSON.stringify(scope.row)"
              @click="edit(scope.row)"
            >保存</el-button>
            <el-button type="danger" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {
  modifySingle,
  getUserSocialRecord,
  modifySettle
} from '@/api/user/usersocial'
import { getUserSocial, getUsersVacationLimit } from '@/api/user/userinfo'
import AuthCode from '@/components/AuthCode'
import UserSelector from '@/components/User/UserSelector'
import UserSocial from '@/views/register/components/Social'
import VacationDescriptionContent from '@/components/Vacation/VacationDescriptionContent'
export default {
  name: 'Social',
  components: {
    AuthCode,
    UserSelector,
    UserSocial,
    VacationDescriptionContent
  },
  data: () => ({
    userid: '',
    loading_record: false,
    loading_social: false,
    records: [],
    prevList: {},
    auth: {
      authByUserId: '',
      code: ''
    },
    social: null,
    socialModefied: false,
    vacation: null
  }),
  computed: {
    currentUser() {
      return this.$store.state.user.data
    }
  },
  watch: {
    userid: {
      handler(val) {
        if (val) {
          this.refresh()
          this.refreshSocial()
        }
      }
    },
    social: {
      handler(val) {
        this.socialModefied = true
      },
      deep: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.userid = this.currentUser.id
    }, 1000)
  },
  methods: {
    edit(item) {
      modifySingle(item, this.auth).then(() => {
        this.$message.success('操作成功')
        this.refresh()
      })
    },
    remove(item) {
      item.isRemoved = true
      return this.edit(item)
    },
    refresh() {
      this.refreshRecord()
      this.refreshSocial()
      this.refreshVacation()
    },
    submitNewSettle() {
      this.loading_social = true
      modifySettle(this.userid, this.social.settle, this.auth)
        .then(data => {
          this.$message.success('家庭情况已修改')
          this.refreshVacation()
          this.refreshSocial()
        })
        .finally(() => {
          this.loading_social = false
        })
    },
    refreshRecord() {
      this.loading_record = true
      getUserSocialRecord(this.userid)
        .then(data => {
          this.prevList = {}
          var list = data.records.map(i => {
            i.length = Math.round(i.length * 100) / 100
            return i
          })
          for (var i = 0; i < list.length; i++) {
            var item = list[i]
            this.prevList[item.code] = JSON.stringify(item)
          }
          this.records = list
        })
        .finally(() => {
          this.loading_record = false
        })
    },
    refreshSocial() {
      this.loading_social = true
      getUserSocial(this.userid, true)
        .then(data => {
          this.social = data
          this.$nextTick(() => {
            this.socialModefied = false
          })
        })
        .finally(() => {
          this.loading_social = false
        })
    },
    refreshVacation() {
      const { userid } = this
      getUsersVacationLimit({ userid }).then(data => {
        this.vacation = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.margin-card {
  margin-bottom: 3rem;
}
</style>
