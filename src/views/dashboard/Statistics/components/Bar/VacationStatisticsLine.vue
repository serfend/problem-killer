<template>
  <div
    :style="{height:height,width:width}"
    @mouseenter="userSelect = true"
    @mouseleave="userSelect = false"
  />
</template>

<script>
import * as echarts from 'echarts'
import { createLinerSeries } from '../../js/linerGradient'
import { groupByPredict } from '@/utils/data-handle'
import { debounce } from '@/utils'
export default {
  name: 'VacationStatisticsLine',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    fileLoad: {
      type: Function,
      default: null
    },
    color: {
      type: Array,
      default: () => []
    },
    companies: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null,
      refresher: null,
      nowIndex: 0,
      userSelect: false,
      series: [],
      legend: {
        dict: {}, // name-[index]
        isEventing: false
      }
    }
  },
  computed: {
    updatedData() {
      return debounce(() => {
        this.updateData()
      }, 1000)
    }
  },
  watch: {
    data: {
      handler(v) {
        this.$nextTick(() => {
          this.updatedData()
        })
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) return
    this.checkTimeOut()
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    checkTimeOut() {
      if (this.refresher) clearTimeout(this.refresher)
      this.refresher = null
    },
    async nextShowOfData() {
      if (!this.userSelect) {
        this.checkTimeOut()
        if (this.data && this.data.length > 1) {
          this.nowIndex++
          if (this.nowIndex >= this.data.length) {
            this.nowIndex = 0
          }
          this.refresh(true)
        }
      }
      this.refresher = setTimeout(this.nextShowOfData, 7500)
    },
    updateData() {
      const groups = this.data
      if (groups) {
        this.series = groups.map(nowGroup => {
          let series = nowGroup.series.map((s, i) => {
            const iColor = this.color[i % this.color.length]
            const { name, data } = s
            const groupByTypesData = groupByPredict(data, i => i.value[4]) // group by member type
            const result = []
            const keys = Object.keys(groupByTypesData)
            for (var group of keys) {
              const iName = keys.length <= 1 ? name : `${name}(${group})`
              const item = createLinerSeries(
                iName,
                iColor,
                groupByTypesData[group]
              )
              result.push(item)
            }
            return result
          })
          series = [].concat(...series)
          series.forEach(v => {
            const key = this.removeBrucket(v.name)
            if (key) {
              const arr = this.legend.dict[key]
              if (!arr) this.legend.dict[key] = []
              this.legend.dict[key].push(v.name)
            }
          })
          return { name: nowGroup.name, series }
        })
      }
    },
    refresh(directClear = true) {
      this.chart.showLoading()
      this.setOpt(directClear)
      this.chart.hideLoading()
    },
    setOpt(directClear) {
      if (!this.series) return
      const nowGroup = this.series[this.nowIndex]
      if (!nowGroup) return

      if (directClear || this.nowIndex === 0) this.clear()
      var option = {
        title: {
          text: `本单位趋势 - ${nowGroup.name}`,
          textStyle: {
            color: '#fff'
          },
          textAlign: 'center',
          left: '50%'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (series, ticket, callback) {
            const result = []
            result.push(series[0].value[2])
            result.push('<br/>')
            for (var s of series) {
              const per = s.value[3]
              const label = `${s.seriesName}:${s.value[1]}`
              result.push(s.marker)
              result.push(per ? `${label}(${per}%)` : label)
              result.push('<br/>')
            }
            return result.join('')
          }
        },
        series: nowGroup.series
      }
      this.chart.setOption(option)
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      this.chart.on('legendselectchanged', this.onLegendSelect)
      this.initChartSkeleton()
      this.nextShowOfData()
    },
    initChartSkeleton() {
      this.chart.setOption({
        legend: {
          type: 'scroll',
          bottom: 0,
          inactiveColor: '#aaa',
          color: '#fff'
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            start: 0,
            end: 100,
            bottom: '10%',
            height: '7%',
            textStyle: {
              color: '#fff'
            }
          },
          {
            type: 'inside',
            start: 94,
            end: 100
          }
        ],
        grid: [{ x: '13%', bottom: '30%', width: '80%', height: '60%' }],
        xAxis: [
          {
            type: 'time',
            boundaryGap: false,
            // x轴更换数据
            // data: date,
            // 文本颜色为rgba(255,255,255,.6)  文字大小为 12
            axisLabel: {
              color: 'rgba(255,255,255,.6)',
              fontSize: 12
            },
            // x轴线的颜色为   rgba(255,255,255,.2)
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.2)'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: function (value) {
              const v = value.min - 20
              return v < 0 ? 0 : v
            },
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            },
            axisLabel: {
              color: 'rgba(255,255,255,.6)',
              fontSize: 12
            },
            // 修改分割线的颜色
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            }
          }
        ]
      })
    },
    onLegendSelect(opt) {
      if (this.legend.isEventing) return
      const name = opt.name
      const rawName = this.removeBrucket(name)
      if (!rawName) return
      const arrToSwitch = this.legend.dict[rawName]
      if (!arrToSwitch) return
      this.legend.isEventing = true
      arrToSwitch.forEach(v => {
        if (v === name) return
        this.chart.dispatchAction({
          type: 'legendToggleSelect',
          name: v
        })
      })
      this.$nextTick(() => {
        this.legend.isEventing = false
      })
    },
    removeBrucket(name) {
      const firstBracket = name.indexOf('(')
      const hasFinalBracket = name.substr(name.length - 1, 1) === ')'
      const isMuti = firstBracket > 0 && hasFinalBracket
      if (!isMuti) return null
      const rawName = name.substring(0, firstBracket)
      return rawName
    },
    clear() {
      this.chart.clear()
      this.initChartSkeleton()
    }
  }
}

/*
      var base = +new Date(2020, 0, 0)
      var oneDay = 24 * 3600 * 1000
      var date = []
      var sTitle = ['已休假人数', '休假满60%人数', '休满假人数', '休假中人数']
      var sTlength = sTitle.length
      var totalMemberCount = 3221
      var data = [[0], [0], [0], [totalMemberCount / 12]]
      var highDay = [67, 168, 304] // 休假高峰
      var rand = 0.3
      for (let i = 1; i < 360; i++) {
        var now = new Date((base += oneDay))
        date.push(
          [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')
        )
        var k = highDay.reduce((prev, cur, index) => {
          return Math.min(Math.abs(cur - i), prev)
        })
        k = 365 - k
        for (var j = 0; j < sTlength; j++) {
          var t =
            (Math.random() * ((sTlength - j - 1) * 2 - rand * 2) + rand) / 100
          t = t * Math.pow(k / 365, 2)
          var leftMember = totalMemberCount - data[j][i - 1]
          if ((j === 1 || j === 2) && i < 30) t = t * (i / 30)
          data[j].push(t * leftMember + data[j][i - 1])
        }
      }
      */
</script>
