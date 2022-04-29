<template>
  <div :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
import { createSingleItem } from '../js/geoMapBuilder'
import { geoCoordMap } from '../js/variables'
export default {
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
      default: '300px'
    },
    fileLoad: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      chart: null,
      series: [],
      startPlace: ['海淀', '昌平', '石家庄', '襄阳'],
      color: ['#b5bf4f', '#71b3f0', '#f9b230'],
      refresher: null
    }
  },
  mounted() {
    this.initChart()
    this.refresh()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
    if (this.refresher) clearInterval(this.refresher)
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
    },
    async refresh() {
      this.chart.showLoading()
      this.loadNewData(3)
      console.log('refresh map')
      if (this.refresher) clearInterval(this.refresher)
      this.refresher = setInterval(() => {
        this.loadNewData(1)
      }, 15000)
      this.chart.hideLoading()
    },
    loadNewData(dataCount) {
      if (!dataCount) dataCount = 1
      var keys = Object.keys(geoCoordMap)
      var targetRandom = keys.length
      var shallOut = dataCount
      while (this.series.length > 9 && shallOut > 0) {
        shallOut--
        this.series.splice(0, 9)
      }
      for (var i = 0; i < this.startPlace.length; i++) {
        var startPlace = this.startPlace[i]
        for (var j = 0; j < dataCount; j++) {
          var itemIndex = Math.floor(Math.random() * targetRandom)
          var item = [
            startPlace,
            [
              [
                { name: startPlace },
                {
                  name: keys[itemIndex],
                  value: Math.floor(30 * Math.random())
                }
              ]
            ]
          ]
          this.series.push(...createSingleItem(item, this.color[i]))
        }
      }
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: function(params, ticket, callback) {
            if (params.seriesType === 'effectScatter') {
              return '线路：' + params.data.name + '' + params.data.value[2]
            } else if (params.seriesType === 'lines') {
              return (
                params.data.fromName +
                '>>' +
                params.data.toName +
                '<br />' +
                params.data.value
              )
            } else {
              return params.name
            }
          }
        },
        geo: {
          map: 'china',
          label: {
            emphasis: {
              show: true,
              color: '#fff'
            }
          },
          // 把中国地图放大了1.2倍
          zoom: 1.2,
          roam: true,
          itemStyle: {
            normal: {
              // 地图省份的背景颜色
              areaColor: 'rgba(20, 41, 87,0.6)',
              borderColor: '#195BB9',
              borderWidth: 1
            },
            emphasis: {
              areaColor: '#2B91B7'
            }
          }
        },
        series: this.series
      }
      this.chart.setOption(option)
    }
  }
}
</script>
