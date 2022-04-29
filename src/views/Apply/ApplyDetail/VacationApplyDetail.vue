<template>
  <div style="padding: 10px">
    <div v-if="detail && detail.id">
      <el-dialog :visible.sync="show_share" title="分享休假申请详情" append-to-body>
        <ClipboardShare default-content="我把我的休假申请发给你啦~复制本段${key}打开系统查看。或点击链接${url} 到浏览器。" />
      </el-dialog>
      <el-button v-if="route_id" type="text" icon="el-icon-share" @click="show_share=true">分享此休假详情</el-button>
      <el-button icon="el-icon-date" type="text" @click="showMyApplies = true">查看历史记录</el-button>
      <ActionExamine
        :entity-type="entityType"
        :row="detail"
        style="display: inline"
        @updated="updateDetail"
      />
      <ActionUser
        :entity-type="entityType"
        :row="detail"
        style="display: inline"
        @updated="updateDetail"
      />
    </div>
    <el-drawer :visible.sync="showMyApplies" append-to-body size="80rem" direction="rtl">
      <MyApply
        v-if="showMyApplies"
        :id="detail.base.id"
        :entity-type="entityType"
        :start="null"
        :auto-expand="false"
      />
    </el-drawer>
    <div style="padding-top: 0.5rem">
      <el-card v-loading="loading" shadow="hover" class="content-card">
        <h3 slot="header">本次休假</h3>
        <el-row v-if="detail && detail.id && detail.status !== 20" :gutter="20">
          <el-col :xl="8" :lg="10" :md="12" :sm="12" :xs="24">
            <el-form v-if="detail.id" label-width="8rem">
              <el-form-item label="基本">
                <el-tag
                  v-if="detail.request.vacationType"
                  effect="dark"
                  :type="detail.request.vacationType === '正休'? 'primary': 'danger'"
                >{{ detail.request.vacationType }}</el-tag>
                <el-tag v-if="detail.type.isPlan" color="#cccccc" class="white--text">计划</el-tag>
                <div v-if="staticData.vacationStart">
                  <el-tooltip effect="light">
                    <template slot="content">
                      <span>{{ staticData.vacationSpent }}/{{ staticData.vacationLength }}天</span>
                    </template>
                    <el-col v-if="staticData.vacationSpent >= 0" :lg="6" :md="12" :sm="24">
                      <el-progress :width="100" :percentage="staticData.vacationProgress" />
                    </el-col>

                    <span v-else>距离离队时间:{{ -staticData.vacationSpent }}天</span>
                  </el-tooltip>
                </div>
                <span v-else>
                  <el-tag
                    v-if="statusDic[detail.status]"
                    :color="statusDic[detail.status].color"
                    class="white--text"
                  >{{ statusDic[detail.status].desc }}</el-tag>
                </span>
              </el-form-item>
              <el-form-item label="原因">{{ detail.request.reason ? detail.request.reason : '未填写' }}</el-form-item>
              <el-form-item label="创建时间">{{ detail.create }}</el-form-item>
              <el-form-item label="假期天数">
                <span>{{ `净假期${detail.request.vacationLength}天 在途${detail.request.onTripLength}天` }}</span>
                <el-tooltip
                  v-for="a in detail.request.additialVacations"
                  :key="a.id"
                  :content="`开始于${parseTime(a.start)}的${a.length}天${a.name},${a.description}`"
                >
                  <el-tag style="margin-left: 10px">{{ `${a.length}天${a.name}` }}</el-tag>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="休假日期">
                <span>
                  {{ parseTime(detail.request.stampLeave) }} -
                  {{ parseTime(detail.request.stampReturn) }}
                </span>
              </el-form-item>
              <el-form-item label="休假地点">
                <span>{{ detail.request.vacationPlace && detail.request.vacationPlace.name }}</span>
                <span
                  v-if="detail.request.vacationPlaceName"
                >{{ `(${detail.request.vacationPlaceName})` }}</span>
              </el-form-item>
              <el-form-item label="交通工具">
                <TransportationType v-model="detail.request.byTransportation" />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :xl="8" :lg="8" hidden-md-only hidden-sm-only :xs="24">
            <el-form label-width="8rem">
              <SettleFormItem :form.sync="settle.self" disabled label="本人所在地" />
              <SettleFormItem :form.sync="settle.lover" disabled label="配偶所在地" />
              <SettleFormItem :form.sync="settle.parent" disabled label="父母所在地" />
              <SettleFormItem :form.sync="settle.loversParent" disabled label="配偶父母所在地" />
            </el-form>
          </el-col>
          <el-col :xl="8" :lg="6" :md="4" :sm="12" :xs="24">
            <UserFormItem
              :userid="detail.base.id"
              :direct-show-card="true"
              :can-load-avatar="true"
            />
          </el-col>
        </el-row>
      </el-card>
      <div class="content-card">
        <AuditStatus :loading="loading" :data="detail" />
      </div>
      <div v-if="showComment && detail && detail.id" class="content-card">
        <ApplyComments :id="detail.id" />
      </div>
    </div>
  </div>
</template>

<script>
import { detail } from '@/api/apply/query'
import { datedifference, parseTime } from '@/utils'
import { get_item_type } from '@/utils/vacation'
export default {
  name: 'ApplyDetail',
  components: {
    SettleFormItem: () => import('@/components/SettleFormItem'),
    ActionExamine: () => import('../QueryAndAuditApplies/ActionExamine'),
    ActionUser: () => import('../QueryAndAuditApplies/ActionUser'),
    AuditStatus: () => import('./components/AuditStatus'),
    MyApply: () => import('@/views/Apply/MyApply'),
    ClipboardShare: () =>
      import('@/views/common/ClipboardMonitor/ClipboardShare'),
    ApplyComments: () => import('@/components/BiliComment'),
    UserFormItem: () => import('@/components/User/UserFormItem'),
    TransportationType: () => import('@/components/Vacation/TransportationType')
  },
  props: {
    showUser: { type: Boolean, default: true },
    showComment: { type: Boolean, default: true },
    canShow: { type: Boolean, default: true },
    focusId: { type: String, default: null }
  },
  data: () => ({
    id: null,
    entityType: 'vacation',
    route_id: null,
    detail: {},
    show_share: false,
    loading: false,
    showMyApplies: false,
    staticData: {
      vacationLength: 0,
      vacationSpent: 0,
      vacationProgress: 0,
      vacationStart: false
    }
  }),
  computed: {
    statusDic() {
      return this.$store.state.vacation.statusDic
    },
    settle() {
      return this.detail.social.settle
    }
  },
  watch: {
    focusId: {
      handler(val) {
        console.log('modify focusId', val)
        this.id = val
      },
      immediate: true
    },
    route_id(val) {
      if (this.focusId !== null) return
      console.log('modify routeId', val)
      this.id = val
    },
    id: {
      handler(val) {
        this.updateDetail()
      },
      immediate: true
    },
    canShow: {
      handler(val) {
        this.updateDetail()
      }
    }
  },
  mounted() {
    if (!this.$route || !this.$route.query) return
    this.route_id = this.$route.query.id
  },
  methods: {
    parseTime(date) {
      return parseTime(new Date(date), '{y}年{m}月{d}日')
    },
    datedifference,
    updateDetail() {
      if (this.id && this.canShow) {
        this.loadDetail(this.id)
      }
    },
    initstaticDataData() {
      const now = new Date()
      const { request, status } = this.detail
      const start = request.stampLeave
      const end = request.stampReturn
      const vacationLength = datedifference(end, start) + 1
      const s = this.staticData
      s.vacationLength = vacationLength
      const vacationSpend = datedifference(now, start)
      s.vacationSpent =
        vacationSpend > vacationLength ? vacationLength : vacationSpend
      s.vacationStart = status === 100
      let progress = 0
      if (s.vacationSpent >= s.vacationLength) {
        progress = 100
      } else {
        progress = (s.vacationSpent / s.vacationLength) * 100
        if (progress < 0) progress = 0
        progress = Math.floor(progress)
      }
      s.vacationProgress = progress
    },
    loadDetail(id) {
      this.loading = true
      this.detail = null
      const entityType = this.entityType
      const loadDetail = detail({ id, entityType }).then(data => {
        data = data.model
        if (!data.requestInfo) data.requestInfo = {}
        data.request = data.requestInfo
        if (data.request) {
          data.stampReturn = new Date(data.request.stampReturn)
          data.stampLeave = new Date(data.request.stampLeave)
        }
        data.type = get_item_type(data)
        this.detail = data
        this.initstaticDataData()
      })
      loadDetail.finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content-card {
  padding-top: 20px;
}

.audit-process- {
  &card {
    background: white;
    margin-bottom: 12px;
    padding: 12px;
    border-radius: 4px;
    box-shadow: 0px 0px 2px 0px;
  }

  &status {
    font-size: 13px;
    padding: 4px 0;
  }

  &companyName {
    padding: 4px 0 4px;
  }
}

.pull-left {
  float: left !important;
}

.pull-right {
  float: right !important;
}
</style>
