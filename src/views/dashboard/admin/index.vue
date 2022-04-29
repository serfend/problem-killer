<template>
  <div class="dashboard-editor-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <vacation-complete-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="20">
      <el-col :lg="32" :md="32">
        <div class="chart-wrapper">
          <bar-chart
            ref="barchart"
            :data="data_focus"
            :now-companies="nowCompanies"
            @datazoom="handleZoom"
          />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :lg="{ span: 8 }" :md="{ span: 24 }" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :lg="{ span: 8 }" :md="{ span: 24 }" style="margin-bottom:30px;">
        <box-card :data="data_focus" :now-companies="nowCompanies" />
      </el-col>
      <el-col :lg="8" :sm="24" :xs="24">
        <div class="chart-wrapper">
          <pie-chart ref="piechart" :data="data_focus" :now-companies="nowCompanies" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VacationCompleteChart from './components/VacationCompleteChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'

import { details, summary } from '@/api/statistics'
import { companyChild } from '@/api/company'
export default {
  name: 'DashboardAdmin',
  components: {
    VacationCompleteChart,
    PieChart,
    BarChart,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lastScale: 0,
      lastUpdate: '',
      lineChartData: {
        onApplyingData: [0, 2000, 10000, 2000, 1000],
        beenAuditData: [0, 3000, 1000, 2000, 1000],
        beenDeniedData: [0, 4000, 1000, 2000, 1000],
        titles: ['暂无数据', '暂无数据', '暂无数据']
      },
      data_week: {}, // 周数据
      data_month: {}, // 月数据
      data_season: {}, // 季度数据
      data_year: {}, // 年度数据
      data_focus: {},
      focusType: '',
      statisticsDic: {},
      companyDic: {},
      nowCompanies: []
    }
  },
  watch: {
    focusType: {
      handler(val) {
        if (val) this.data_focus = this['data_' + val]
      },
      immediate: true
    },
    nowCompanies: {
      handler(val) {
        var lastUpdate = new Date()
        this.lastUpdate = lastUpdate
        setTimeout(() => {
          if (lastUpdate !== this.lastUpdate) return
          this.$refs.barchart.update()
          this.$refs.piechart.update()
        }, 1000)
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    companyChild().then(data => {
      if (data.list.length === 0) data.list = ['root']
      var actions = []
      for (var c in data.list) {
        actions.push(this.init(data.list[c].code))
      }
      this.focusType = 'week'
      Promise.all(actions).then(() => {
        var result = []
        for (var i in this.data_focus) {
          result.push(this.companyDic[i])
        }
        this.nowCompanies = result
      })
    })
  },
  methods: {
    init(companyCode) {
      return companyChild(companyCode).then(data => {
        if (data.list.length === 0) {
          return this.initCompanies([companyCode])
        }
        return this.initCompanies(data.list.map(i => i.code))
      })
    },
    initCompanies(companies) {
      var cmpStr = companies.join('##')
      return summary(cmpStr).then(data => {
        for (var s in data.list) {
          if (!this.statisticsDic[data.list[s].id]) {
            this.statisticsDic[data.list[s].id] = data.list[s]
          }
        }
        return details(
          companies,
          data.list.map(i => i.id)
        ).then(de => {
          this.initData(de)
        })
      })
    },
    initData(data) {
      const labelItem = ['year', 'season', 'month', 'week']
      for (var d in data.list) {
        var item = data.list[d]
        for (var label in labelItem) {
          if (item.statisticsId.toLowerCase().indexOf(labelItem[label]) > -1) {
            var key = `data_${labelItem[label]}`
            if (!this[key][item.company.code]) this[key][item.company.code] = {}
            this[key][item.company.code][item.statisticsId] = item
            this.companyDic[item.company.code] = item.company
            break
          }
        }
      }
    },
    // 返回是否需要重置
    handleZoom(e) {},
    handleSetLineChartData(
      onApplyingData,
      beenAuditData,
      beenDeniedData,
      titles
    ) {
      this.lineChartData = {
        onApplying: onApplyingData,
        beenAudit: beenAuditData,
        beenDenied: beenDeniedData
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
