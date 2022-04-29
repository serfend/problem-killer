<template>
  <div>
    <el-card>
      <el-button type="primary" icon="el-icon-upload" @click="upload_dialog_show = true">评级上传</el-button>
      <el-dialog :visible.sync="upload_dialog_show" append-to-body>
        <Upload v-if="upload_dialog_show" />
      </el-dialog>
    </el-card>
    <el-card>
      <template #header>
        <div style="display:flex">
          <h2>周考月评</h2>
          <el-tooltip style="color:#2c80c5;cursor: pointer;" content="查看帮助">
            <i class="el-icon-question" @click="show_help" />
          </el-tooltip>
        </div>
      </template>
      <el-form inline>
        <el-form-item id="companySelector" label="单位">
          <CompanySelector ref="companySelector" :code.sync="search.company" />
        </el-form-item>
        <el-form-item label="被考评人">
          <UserSelector :code.sync="search.user" />
        </el-form-item>
        <el-form-item label="类别">
          <RatingTypeSelector v-model="search.ratingType" :item.sync="search.ratingTypeItem" />
        </el-form-item>
        <el-form-item v-if="search.ratingType" label="评比期数">
          <RatingCycleSelector
            v-model="search.ratingCycleCount"
            :rating-type="search.ratingType"
            :date-name.sync="search.ratingCycleDesc"
          />
        </el-form-item>
        <el-form-item id="onlySelfSelector" label="只看自己">
          <el-switch v-model="search.onlySelf" />
        </el-form-item>
      </el-form>
      <el-button
        v-loading="loading_export"
        type="primary"
        style="width:100%"
        icon="el-icon-download"
        @click="export_current"
      >导出当前筛选查询</el-button>
    </el-card>
    <el-card v-loading="loading" style="margin-top:1rem">
      <el-table :data="list">
        <el-table-column label="期数" width="100rem">
          <template #default="scope">
            <RatingTypeTag
              :rating-type="scope.row.ratingType"
              :rating-cycle-count="scope.row.ratingCycleCount"
            />
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="120rem">
          <template #default="scope">
            <UserFormItem :userid="scope.row.userId" />
          </template>
        </el-table-column>
        <el-table-column label="单位" width="200rem">
          <template #default="scope">
            <CompanyFormItem :id="scope.row.companyCode" />
          </template>
        </el-table-column>
        <el-table-column label="职务" width="150rem">
          <template #default="scope">
            <div v-if="scope.row.user">
              <div>{{ scope.row.user.dutiesName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="职级" width="120rem">
          <template #default="scope">
            <div v-if="scope.row.user">
              <div>{{ scope.row.user.userTitle }}</div>
              <div>{{ formatTime(scope.row.user.userTitleDate) }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="50rem">
          <template #default="scope">{{ scope.row.rank }}</template>
        </el-table-column>
        <el-table-column label="评级" width="70rem">
          <template #default="scope">
            <MemberRateStatusTag v-model="scope.row.level" />
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template #default="scope">{{ scope.row.remark }}</template>
        </el-table-column>
      </el-table>
      <Pagination :pagesetting.sync="page" :total-count="totalCount" />
    </el-card>
    <el-dialog :visible.sync="help_dialog_show">
      <template #title>
        <h2>周考月评</h2>
      </template>
      <Help />
    </el-dialog>
  </div>
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import { FormRecorder } from '@/utils/form'
import { ratingTypeDict } from './setting'
import { get_rates } from '@/api/memberRate/query'
import { formatTime } from '@/utils'
import { templateToStandard } from './TemplateBuilder/standard'
export default {
  name: 'MemberRate',
  components: {
    CompanySelector: () => import('@/components/Company/CompanySelector'),
    UserSelector: () => import('@/components/User/UserSelector'),
    CompanyFormItem: () => import('@/components/Company/CompanyFormItem'),
    UserFormItem: () => import('@/components/User/UserFormItem'),
    Help: () => import('./Help'),
    RatingCycleSelector: () => import('./RatingTypeOption/RatingCycleSelector'),
    RatingTypeSelector: () => import('./RatingTypeOption/RatingTypeSelector'),
    MemberRateStatusTag: () => import('./MemberRateStatusTag'),
    Upload: () => import('./Upload'),
    RatingTypeTag: () => import('./RatingTypeOption/RatingTypeTag'),
    Pagination: () => import('@/components/Pagination')
  },
  data: () => ({
    loading: false,
    loading_export: false,
    ratingType: ratingTypeDict,
    searchForm: null,
    search: {
      company: null,
      user: null,
      ratingType: 4,
      ratingTypeItem: null,
      ratingCycleCount: 0,
      ratingCycleDesc: null,
      onlySelf: false
    },
    page: {
      pageIndex: 0,
      pageSize: 50
    },
    totalCount: 0,
    list: [],
    help_dialog_show: false,
    upload_dialog_show: false,
    driver: null
  }),
  computed: {
    currentUser() {
      return this.$store.state.user.userid
    }
  },
  watch: {
    page: {
      deep: true,
      handler(val) {
        this.refresh()
      }
    },
    search: {
      handler(val) {
        this.page.pageIndex = 0
        this.refresh()
      },
      deep: true
    }
  },
  mounted() {
    this.searchForm = new FormRecorder('memberRate.summary', this.search)
    setTimeout(() => {
      this.search = this.searchForm.getRecord()
    }, 100)
    this.driver = new Driver({
      closeBtnText: '我知道了'
    })
  },
  methods: {
    formatTime(d) {
      return formatTime(d, '{y}.{m}')
    },
    show_help() {
      this.help_dialog_show = true
    },
    export_current() {
      // TODO Build Component:<TemplateSelector/>
      this.loading_export = true
      const cb = model_data => {
        const { data, prefix } = templateToStandard(
          model_data,
          this.search.ratingCycleDesc,
          this.search.ratingTypeItem
        )
        const filename = '周考月评'
        this.$store
          .dispatch('template/download_xlsx', {
            templateName: `${filename}模板.xlsx`,
            data,
            filename: `${prefix}${filename}.xlsx`
          })
          .finally(() => {
            this.loading_export = false
          })
      }
      this.refresh(cb, { pageIndex: 0, pageSize: 1e4 }).catch(() => {
        this.loading_export = false
      })
    },
    refresh(cb, page) {
      if (this.loading) return
      this.searchForm.setRecord(this.search)
      this.loading = true
      const s = Object.assign({}, this.search)
      if (s.onlySelf) s.user = this.currentUser
      let finallycb = () => {}
      const promise = {
        then: thencb => (cb = thencb),
        catch: fcb => (finallycb = fcb)
      }
      if (!cb) {
        cb = d => {
          this.list = d.list
          this.totalCount = d.totalCount
        }
      }
      page = page || this.page
      get_rates(Object.assign(s, { page }))
        .then(cb)
        .catch(e => {
          if (e.status === 12100) {
            setTimeout(() => {
              const steps = [
                {
                  element: '#companySelector',
                  popover: {
                    title: '查看指定单位',
                    description:
                      '本单位或上级单位管理人员有权限查看本单位的评比情况'
                  }
                },
                {
                  element: '#onlySelfSelector',
                  popover: {
                    title: '仅查看自己',
                    description: '任何人都有权限查看关于【自己】的评比情况'
                  }
                }
              ]
              this.driver.defineSteps(steps)
              this.driver.start()
              this.$refs.companySelector.$el.click()
            }, 500)
          }
        })
        .finally(() => {
          finallycb()
          this.loading = false
        })
      return promise
    }
  }
}
</script>

<style lang="scss"  scoped>
</style>
