<template>
  <div style="padding: 10px">
    <div v-if="detail && detail.id">
      <el-dialog :visible.sync="show_share" title="分享请假申请详情" append-to-body>
        <ClipboardShare default-content="我把我的请假申请发给你啦~复制本段${key}打开系统查看。或点击链接${url} 到浏览器。" />
      </el-dialog>
      <el-button v-if="route_id" type="text" icon="el-icon-share" @click="show_share=true">分享此请假详情</el-button>
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
      <el-card v-loading="loading" class="content-card" shadow="hover">
        <h3 slot="header">本次请假</h3>
        <el-row v-if="detail && detail.id && detail.status !== 20" :gutter="20">
          <el-col :xl="18" :lg="16" :md="14" :sm="12" :xs="24">
            <el-form label-width="8rem">
              <el-form-item label="基本">
                <el-tag
                  v-if="detail.request.requestType"
                  effect="dark"
                  type="danger"
                >{{ detail.request.requestType }}</el-tag>
                <el-tag
                  v-if="statusDic[detail.status]"
                  :color="statusDic[detail.status].color"
                  class="white--text"
                >{{ statusDic[detail.status].desc }}</el-tag>
                <IndayApplyProgress
                  :execute-id="detail.executeStatusId"
                  :stamp-leave="detail.request && detail.request.stampLeave"
                  :stamp-return="detail.request && detail.request.stampReturn"
                />
              </el-form-item>
              <el-form-item label="原因">{{ detail.request.reason ? detail.request.reason : '未填写' }}</el-form-item>
              <el-form-item label="创建时间">{{ detail.create }}</el-form-item>
              <el-form-item label="外出时间">
                <span>
                  {{ parseTime(detail.request.stampLeave) }} -
                  {{ parseTime(detail.request.stampReturn) }}
                </span>
              </el-form-item>
              <el-form-item label="外出去向">
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

          <el-col :xl="6" :lg="8" :md="10" :sm="12" :xs="24">
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
    ActionExamine: () => import('../QueryAndAuditApplies/ActionExamine'),
    ActionUser: () => import('../QueryAndAuditApplies/ActionUser'),
    AuditStatus: () => import('./components/AuditStatus'),
    MyApply: () => import('@/views/Apply/MyApply'),
    ClipboardShare: () =>
      import('@/views/common/ClipboardMonitor/ClipboardShare'),
    ApplyComments: () => import('@/components/BiliComment'),
    UserFormItem: () => import('@/components/User/UserFormItem'),
    TransportationType: () =>
      import('@/components/Vacation/TransportationType'),
    IndayApplyProgress: () =>
      import('@/views/Apply/MyApply/components/ApplyCard/IndayApplyProgress')
  },
  props: {
    showUser: { type: Boolean, default: true },
    showComment: { type: Boolean, default: true },
    canShow: { type: Boolean, default: true },
    focusId: { type: String, default: null }
  },
  data: () => ({
    entityType: 'inday',
    id: null,
    route_id: null,
    detail: {},
    show_share: false,
    loading: false,
    showMyApplies: false
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
      return parseTime(new Date(date))
    },
    datedifference,
    updateDetail() {
      if (this.id && this.canShow) {
        this.loadDetail(this.id)
      }
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
