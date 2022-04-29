<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
import { debounce } from '@/utils'
require('echarts/theme/macarons') // echarts theme
export default {
  name: 'VacationCompleteChart',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '600px'
    },
    form: {
      type: Object, // 各单位数据
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null,
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: this.initYearlyxAxis(),
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '单位：人次',
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '单位：%',
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '休假人次',
            type: 'bar',
            stack: 'anycompany',
            data: [3, 8, 14, 15, 18, 20]
          },
          {
            name: '休假人次2',
            type: 'bar',
            stack: 'anycompany',
            data: [13, 8, 24, 15, 8, 2]
          },
          {
            name: '休假率',
            type: 'line',
            yAxisIndex: 1,
            data: [0, 10, 20, 30, 40, 35, 30, 25, 20],
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: '#eb64fb'
                    },
                    {
                      offset: 1,
                      color: '#3fbbff0d'
                    }
                  ],
                  false
                )
              }
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initYearlyxAxis() {
      var list = []
      for (var i = 0; i < 12; i++) {
        list.push(`${i + 1}月`)
      }
      return list
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption(this.option)
    }
  }
}
</script>

<style>
</style>
