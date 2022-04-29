<template>
  <div>
    <el-table
      v-if="vacationTypesDic"
      ref="singleTable"
      v-loading="loading"
      :data="formatedList"
      highlight-current-row
      stripe
      header-align="center"
      :span-method="arraySpanMethod"
      :cell-style="{padding:0}"
      @row-dblclick="showDetail"
    >
      <el-table-column type="selection" />
      <el-table-column label="基本" width="140rem">
        <template slot-scope="{ row }">
          <component :is="!rowCanShow(row) ? 'ElTooltip' : 'div'" effect="light">
            <div slot="content">
              <VacationType
                v-if="rowCanShow(row)"
                v-model="row.request.vacationType"
                :entity-type="entityType"
              />
              <el-link
                :href="`#/user/profile?id=${row.base.userId}`"
                target="_blank"
              >{{ row.base.realName }}</el-link>
            </div>
            <div
              v-if="!rowCanShow(row)"
              style="
                font-size: 1rem;
                color: #ccc;
                letter-spacing: 1rem;
                text-align: center;
              "
            >申请已被撤回</div>
          </component>
        </template>
      </el-table-column>
      <el-table-column header-align="center" label="部职别">
        <template slot-scope="{ row }">
          <ApplyCompany :data="row.base" />
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="创建时间" width="150rem">
        <template v-if="rowCanShow(row)" slot-scope="{ row }">
          <el-tooltip effect="light" :content="`创建于:${row.create}`">
            <span style="font-size:0.6rem">{{ formatTime(row.create) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="休假时间" width="220rem">
        <template v-if="rowCanShow(row)" slot-scope="{ row }">
          <span>
            <el-tooltip effect="light" :content="`离队时间:${parseTime(row.stampLeave)}`">
              <span style="font-size:0.6rem">{{ relativeDate(row.stampLeave,null,true) }}</span>
            </el-tooltip>
            <span>-</span>
            <el-tooltip effect="light" :content="`归队时间:${parseTime(row.stampReturn)}`">
              <span style="font-size:0.6rem">{{ relativeDate(row.stampReturn,null,true) }}</span>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="休假地点">
        <template v-if="rowCanShow(row)" slot-scope="{ row }">
          <el-tooltip effect="light">
            <div slot="content">
              <div v-if="row.request.vacationPlaceName">
                <b>详细地址</b>
                <span style="width:10rem">{{ row.request.vacationPlaceName }}</span>
              </div>
              <div v-if="row.request.reason">
                <b>休假原因</b>
                <span style="width:10rem">{{ row.request.reason }}</span>
              </div>
              <div>
                <b>出行方式</b>
                <TransportationType v-model="row.request.byTransportation" />
              </div>
              <div v-if="row.request.vacationDescription">
                <b>假期描述</b>
                <p style="width:10rem">{{ row.request.vacationDescription }}</p>
              </div>
            </div>
            <span>{{ row.request.vacationPlace ? row.request.vacationPlace.name : '未选择' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="休假总天数" width="120rem">
        <template v-if="rowCanShow(row)" slot-scope="{ row }">
          <el-dropdown>
            <span class="el-dropdown-link">
              <span
                :style="{
                  color:
                    row.request.additialVacations &&
                    row.request.additialVacations.length > 0
                      ? '#3a3'
                      : '#333',
                }"
              >{{ datedifference( row.request.stampReturn, row.request.stampLeave ) + 1 }}天</span>
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="row.request.vacationLength > 0">
                {{ vacationTypesDic[row.request.vacationType].alias
                }}{{ row.request.vacationLength }}天
              </el-dropdown-item>
              <el-dropdown-item
                v-if="row.request.onTripLength > 0"
              >路途{{ row.request.onTripLength }}天</el-dropdown-item>
              <el-dropdown-item
                v-for="(v, i) in row.request.additialVacations"
                v-show="row.request.additialVacations.length > 0"
                :key="i"
              >
                <el-tooltip
                  :content="
                    v.description == '法定节假日'
                      ? v.description
                      : `用户个人创建(非法定节假日)，原因:${v.description}`
                  "
                  placement="left"
                >
                  <el-tag
                    :type="
                      v.description == '法定节假日' ? 'primary' : 'warning'
                    "
                  >{{ v.name }} {{ v.length }}天</el-tag>
                </el-tooltip>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="80rem">
        <template v-if="rowCanShow(row)" slot-scope="{ row }">
          <ApplyAuditStreamPreviewLoader
            v-if="row.statusDesc"
            :id="row.id"
            :entity-type="entityType"
          >
            <el-tag
              slot="content"
              :color="row.statusColor"
              class="white--text"
              size="mini"
              style="cursor:pointer;margin-left:0.5rem"
            >{{ row.statusDesc }}</el-tag>
          </ApplyAuditStreamPreviewLoader>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template v-if="rowCanShow(row)" slot-scope="{ row }">
          <span>
            <el-tooltip content="此申请可能为休假结束后创建">
              <el-tag
                v-if="row.checkIfIsReplentApply"
                size="mini"
                color="#ff0000"
                class="white--text"
              >补充申请</el-tag>
            </el-tooltip>
            <el-tag v-if="row.type.isPlan" size="mini" color="#cccccc" class="white--text">计划</el-tag>
            <slot :row="row" name="action" />
          </span>
        </template>
      </el-table-column>
    </el-table>
    <AuditApplyMutilDialog
      :show.sync="multiAuditFormShow"
      :responselist="multiAuditFormSelection"
      :entity-type="entityType"
      @updated="requireUpdate(multiAuditFormSelection)"
    />
    <el-button
      v-show="!multiAuditFormShow && list.length > 1"
      style="width: 100%; font-size: 1rem; letter-spacing: 1.5rem"
      type="success"
      @click="showMutilAudit"
    >审批当前选中项</el-button>
    <Pagination
      :pagesetting.sync="pagesetting"
      :total-count="pagesTotalCount"
      :hidden="formatedList.length === 0"
    />
    <el-dialog :visible.sync="apply_detail_focus" width="80%">
      <h1 slot="title" style="text-align:center">详细信息</h1>
      <component :is="`${entityType}ApplyDetail`" :focus-id="apply_detail_focus_id" />
    </el-dialog>
    <div style="height:3rem" />
  </div>
</template>

<script>
import { formatTime, relativeDate, parseTime, datedifference } from '@/utils'
import { get_item_type } from '@/utils/vacation'
export default {
  name: 'ApplicationList',
  components: {
    AuditApplyMutilDialog: () => import('../AuditApplyMutilDialog'),
    Pagination: () => import('@/components/Pagination'),
    ApplyAuditStreamPreviewLoader: () =>
      import('@/components/ApplicationApply/ApplyAuditStreamPreviewLoader'),
    VacationType: () => import('@/components/Vacation/VacationType'),
    vacationApplyDetail: () =>
      import('@/views/Apply/ApplyDetail/VacationApplyDetail'),
    indayApplyDetail: () =>
      import('@/views/Apply/ApplyDetail/IndayApplyDetail'),
    TransportationType: () => import('@/components/Vacation/TransportationType'),
    ApplyCompany: () => import('../../CommonComponents/ApplyCompany')
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    loading: { type: Boolean, default: false },
    pages: {
      type: Object,
      default() {
        return {}
      }
    },
    pagesTotalCount: { type: Number, default: 0 },
    entityType: { type: String, default: 'vacation' }
  },
  data: () => ({
    multiAuditFormShow: false,
    multiAuditFormSelection: [],
    apply_detail_focus_id: null,
    formatedList: [] // 经过格式化过的主列表
  }),
  computed: {
    vacationTypesDic() {
      return this.$store.state.vacation.vacationTypes
    },
    pagesetting: {
      get() {
        return this.pages
      },
      set(val) {
        this.$emit('update:pages', val)
      }
    },
    myUserid() {
      return this.$store.state.user.userid
    },
    statusOptions() {
      return this.$store.state.vacation.statusDic
    },
    apply_detail_focus: {
      set(val) {
        if (!val) {
          this.apply_detail_focus_id = null // only set if null
        }
      },
      get() {
        return this.apply_detail_focus_id !== null
      }
    }
  },
  watch: {
    list: {
      handler(val) {
        this.formatedList = val.map(li => this.formatApplyItem(li))
      },
      deep: true
    }
  },
  methods: {
    formatTime,
    parseTime,
    relativeDate,
    datedifference,
    requireUpdate(selections) {
      this.$emit('updated', selections)
    },
    handleUpdated(selections) {
      const dict = {}
      selections.map(i => (dict[i.id] = true))
      this.formatedList
        .filter(i => dict[i.id])
        .map(i => {
          i.statusDesc = null
        })
    },
    rowCanShow(row) {
      return row.status !== 20 // 状态：撤回
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!this.rowCanShow(row)) {
        if (columnIndex === 1) {
          return [1, 9]
        } else {
          return [0, 0]
        }
      }
    },
    getCDdes(row, prevRow) {
      const cn = row.companyName
      const prevCn = prevRow.companyName
      const dn = row.dutiesName
      const prevDn = prevRow.dutiesName
      const result = [cn, dn]
      if (cn !== prevCn || dn !== prevDn) {
        result.push('(')
        result.push(prevCn)
        result.push(prevDn)
        result.push(')')
      }
      return result.join(' ')
    },
    formatApplyItem(li) {
      const statusObj = this.statusOptions[li.status]
      li.statusDesc = statusObj ? statusObj.desc : '未知状态'
      li.statusColor = statusObj ? statusObj.color : 'gray'
      li.acessable = statusObj ? statusObj.acessable : []
      if (!this.rowCanShow(li)) return li
      const stampLeave = new Date(li.request.stampLeave)
      const stampReturn = new Date(li.request.stampReturn)
      li.stampLeave = stampLeave
      li.stampReturn = stampReturn
      li.checkIfIsReplentApply = stampLeave <= new Date(li.create)
      li.type = get_item_type(li)
      return li
    },
    countOtherTime(row) {
      return (
        datedifference(row.stampReturn, row.stampLeave) -
        row.onTripLength -
        row.vacationLength
      )
    },
    showMutilAudit() {
      this.multiAuditFormSelection = this.$refs.singleTable.selection
      this.multiAuditFormShow = true
    },
    showDetail(row, column, event) {
      if (column.label === '操作') return
      this.apply_detail_focus_id = row.id
      // this.$router.push(`/vacation/applyDetail?id=${row.id}`)
    }
  }
}
</script>

<style lang='scss'>
</style>
