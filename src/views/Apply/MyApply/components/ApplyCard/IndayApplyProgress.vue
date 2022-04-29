<template>
  <span>
    <el-tooltip v-if="!executeItem" :content="description">
      <el-progress
        :percentage="percent===0?30:percent"
        :status="percent>=100?'exception':'success'"
        :text-inside="textInside"
      />
    </el-tooltip>
    <el-tag v-else :type="onTime?'success':'danger'">
      <el-tooltip :content="`实际归队时间${executeItem.returnStamp} - ${onTime?'正常销假':'已超假'}`">
        <span>{{ formatTime(executeItem.returnStamp) }}</span>
      </el-tooltip>
      <span>已归队</span>
      <span v-if="executeItem.reason">({{ executeItem.reason }})</span>
    </el-tag>
  </span>
</template>

<script>
import { datedifference, parseTime, formatTime, getTimeDesc } from '@/utils'
import { getExecuteStatus } from '@/api/apply/recall'
export default {
  name: 'IndayApplyProgress',
  props: {
    stampLeave: { type: [Date, String], default: null },
    stampReturn: { type: [Date, String], default: null },
    executeId: { type: String, default: null },
    show: { type: Boolean, default: true },
    textInside: { type: Boolean, default: false }
  },
  data: () => ({
    entityType: 'inday',
    executeItem: null,
    refresher: null,
    percent: 0,
    spent: 0,
    total: 0
  }),
  computed: {
    onTime() {
      const item = this.executeItem
      if (!item) return false
      const final_return = new Date(item.returnStamp)
      const expect_return = new Date(this.stampReturn)
      return expect_return >= final_return
    },
    description() {
      return this.formatPercent(this.percent)
    }
  },
  watch: {
    executeId: {
      handler(val) {
        if (!val) this.executeItem = null
        else this.updateExecuteItem()
      },
      immediate: true
    }
  },
  mounted() {
    this.refresher = setInterval(() => {
      this.update()
    }, 1000)
  },
  destroyed() {
    clearInterval(this.refresher)
  },
  methods: {
    formatTime,
    updateExecuteItem() {
      getExecuteStatus({
        id: this.executeId,
        entityType: this.entityType
      }).then(data => {
        this.executeItem = data
      })
    },
    update() {
      if (!this.show) return
      this.percent = this.get_percent()
    },
    get_total() {
      if (!this.stampReturn) return 1
      return 1 + datedifference(this.stampReturn, this.stampLeave, 'second')
    },
    get_spent() {
      if (!this.stampReturn) return 0
      return 1 + datedifference(new Date(), this.stampLeave, 'second')
    },
    get_percent() {
      this.total = this.get_total()
      const total = this.total
      const spent = (this.spent = this.get_spent())
      if (total === 0) return 10
      if (spent < 0) return 0
      if (spent > total) return 100
      return Math.round((spent / total) * 1e4) / 1e2
    },
    formatPercent(val) {
      if (this.spent <= 0) {
        const start = -this.spent
        const left_desc = getTimeDesc(start)
        return `${left_desc} 未开始`
      }
      if (val >= 100) {
        const expect_return = new Date(this.stampReturn)
        return `${formatTime(expect_return)}已超假（${parseTime(
          expect_return
        )}）`
      }
      const left = (this.total - this.spent)
      const left_desc = getTimeDesc(left)
      const percent = `${Math.round((this.spent / this.total) * 10000) / 100}%`
      return `${left_desc} ${percent}`
    }
  }
}
</script>
