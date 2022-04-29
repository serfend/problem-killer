import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import {
  queryList,
  queryListId,
  queryMyAudit,
  createQueryApplyModel
} from '@/api/apply/query'
import { locationChildren } from '@/api/common/static'
import { debounce } from '@/utils'
import { FormRecorder } from '@/utils/form'
export default {
  Name: 'ApplySearchCommon',
  components: {
    Flip: () => import('vue-flip'),
    CascaderSelector: () => import('@/components/CascaderSelector'),
    CompaniesSelector: () => import('@/components/Company/CompaniesSelector'),
    CompanyTagSelector: () => import('@/components/Company/CompanyTagSelector'),
    AuthCode: () => import('@/components/AuthCode'),
    UserSelector: () => import('@/components/User/UserSelector'),
    DutiesSelector: () => import('@/components/Duty/DutiesSelector')
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    pages: {
      type: Object,
      default() {
        return this.innerPages
      }
    },
    entityType: { type: String, default: 'vacation' }
  },
  data: () => ({
    myAuditActionDic: [
      { code: 'Received', desc: '等待我审核的' },
      { code: '', desc: '所有申请' },
      { code: 'UnReceive', desc: '未轮到我审核的' },
      { code: 'Accept', desc: '同意的' },
      { code: 'Deny', desc: '驳回的' }
    ],
    onLoading: false,
    onFormModifying: false,
    queryForm: null,
    queryFormRecord: null,
    settings: {
      _version: 1,
      manual_close_pannel: false
    },
    settingsRecord: null,
    innerPages: {
      pageIndex: 0,
      pageSize: 20
    },
    adminQuery: false, // 管理人员查询，默认将仅查询本人可审批的人
    isFlip: false,
    panel_right: '0',
    panel_should_out: false,
    checker: null,
    active_pane: '0',
    driver: null,
    classItem: 'float-panel flashing',
    btnExitTransform: null
  }),
  computed: {
    nowCountsMax() {
      const v = (this.queryForm.requestCounts[1] * 1.2 + 1) / 5
      return Math.ceil(v) * 5
    },
    onFilterAccept() {
      return this.queryForm.status.indexOf(100) > -1
    },
    requireSearchData() {
      return debounce(() => {
        this.searchData()
      }, 200)
    },
    executeStatus() {
      return this.$store.state.vacation.executeStatus
    },
    statusOptions() {
      return this.$store.state.vacation.statusDic
    },
    currentUserId() {
      return this.$store.state.user.userid
    },
    currentUserCmp() {
      return this.$store.state.user.companyid
    },
    hasRequestType() {
      return this.entityType === 'vacation'
    }
  },
  watch: {
    adminQuery(val) {
      this.requireFlip()
      if (!val) {
        this.active_pane = '0'
      }
    },
    onLoading(val) {
      this.$emit('update:loading', val)
    },
    currentUserCmp(val) {
      const s = this.queryForm
      if (!s.CreateCompanyItem || s.CreateCompanyItem.length === 0) {
        s.CreateCompanyItem = [{ code: val }]
      }
    },
    settings: {
      handler(val) {
        this.settingsRecord.setRecord(this.settings)
      },
      deep: true
    },
    queryForm: {
      handler(val) {
        this.innerPages.pageIndex = 0 // reset page if form modify
        const item = this.queryForm.CreateCompanyItem || []
        const codes = item.map(i => i.code)
        if (
          JSON.stringify(codes) !== JSON.stringify(this.queryForm.createCompany)
        ) {
          this.queryForm.createCompany = codes
        }
        this.queryFormRecord.setRecord(this.queryForm)
        this.requireSearchData()
      },
      deep: true
    },
    pages: {
      handler(val) {
        if (val) {
          this.innerPages = val
          this.requireSearchData()
        } else this.$emit('update:pages', this.innerPages)
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.queryFormRecord = new FormRecorder(
      'applySearchCommon.lastQuery',
      this.createQueryForm()
    )
    const tmp = this.queryFormRecord.getRecord()
    if (tmp) {
      tmp.actionStatus = 'Received' // 默认查询待我审核的
      this.queryForm = tmp
    }
    if (!this.queryForm) this.clearForm()
    this.queryFormStartRecord = true
    this.settingsRecord = new FormRecorder('applySearchCommon.settings', this.settings)
    this.settings = this.settingsRecord.getRecord()
    this.driver = new Driver({
      closeBtnText: '我知道了'
    })
  },
  methods: {
    locationChildren,
    // TODO 实现原生的动画
    checkPanelStatus() {
      if (this.panel_should_out) {
        this.panel_right = '0'
        this.btnExitTransform = ''
        return
      }
      this.panel_right = '-30rem'
      this.btnExitTransform = 'translateY(2rem) scale(0.5)'
    },
    panel_out(out, delay) {
      this.panel_should_out = !!out
      if (!delay) return this.checkPanelStatus()
      if (!out && this.settings.manual_close_pannel) return
      if (this.checker) clearTimeout(this.checker)
      this.checker = setTimeout(() => {
        this.checkPanelStatus()
      }, delay)
    },
    requireFlip() {
      this.isFlip = true
      this.panel_out(true)
      this.panel_out(false, 10e3)
      setTimeout(() => {
        this.isFlip = false
      }, 5e3)
    },
    panelMouseLeave() {
      this.panel_out(false, 2e3)
    },
    panelMouseEnter() {
      this.removeFlashing()
      this.panel_out(true)
    },
    removeFlashing() {
      this.classItem = this.classItem.replace(' flashing', '')
    },
    exportAppliesNowFilter() {
      this.$emit('exportApplies')
    },
    clearForm() {
      this.queryForm = this.createQueryForm()
    },
    handleSearchedData(data) {
      const list = data.list || []
      this.$emit('update:list', list)
      // this.$emit('update:pages', f.pages)
      this.$emit('update:pagesTotalCount', data.totalCount)
    },
    createQueryForm() {
      return {
        _version: 5,
        createTime: null,
        stampLeaveTime: null,
        stampReturnTime: null,
        status: [], // 状态
        mainStatus: -1,
        actionStatus: 'Received', // 我的状态
        auditBy: null,
        nowAuditBy: null,
        createFor: null,
        CreateCompanyItem: null,
        createCompany: [], // 申请单位
        dutiesType: null,
        companyType: null,
        vacationAdminDivision: null,
        requestCounts: [0, 0], // 指定时间范围内次数
        requestCountsDate: null,
        auth: {
          authByUserId: '',
          code: ''
        }
      }
    },
    searchData(userAct, callback, pages, only_id) {
      // if (!userAct && this.onFormModifying) {
      //   this.$message.error('操作太快啦,歇歇吧~')
      //   return
      // }
      const data = this.queryForm
      if (!data.isMarried) data.isApart = false
      if (!this.onFilterAccept && data.executeStatus != null) {
        data.executeStatus = null
        return
      }
      callback = callback || this.handleSearchedData
      this.onFormModifying = true
      this.onLoading = true
      pages = pages || this.innerPages
      const entityType = this.entityType
      const f = createQueryApplyModel({
        data,
        entityType,
        pages,
        auth: data.auth
      })
      // 仅管理员进行自定义查询，其余时候仅加载当前用户可审批人
      const { status, actionStatus, executeStatus } = data
      let action
      if (this.adminQuery) {
        action = only_id ? queryListId(f) : queryList(f)
      } else {
        action = queryMyAudit({
          pages: f.pages,
          status,
          actionStatus,
          executeStatus,
          entityType: this.entityType
        })
      }
      action
        .then(data => {
          callback(data)
        })
        .catch(e => {
          if (e.status === 12100) {
            this.active_pane = '2'
            this.$refs.companiesSelector.$el.click()
            setTimeout(() => {
              const steps = [
                {
                  element: '#companiesSelector',
                  popover: {
                    title: '选取单位',
                    description:
                      '此处显示的单位仅为用户单位树可见项，不代表有权限项。如需访问请联系管理人员授权。'
                  }
                }
              ]
              this.driver.defineSteps(steps)
              this.driver.start()
            }, 500)
          }
        })
        .finally(() => {
          this.onLoading = false
          setTimeout(() => {
            this.onFormModifying = false
          }, 1000)
        })
    }
  }
}
