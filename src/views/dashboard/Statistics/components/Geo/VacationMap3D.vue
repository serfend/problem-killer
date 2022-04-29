<template>
  <div :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-gl'
import { geoProvince } from '../../js/variables'
import { debounce } from '@/utils'
import { apiOption } from '../Engine/dataDriverApiOption'
import { groupByFiled } from '@/utils/data-handle'
export default {
  name: 'VacationMap3D',
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
    speed: {
      type: Number,
      default: 1
    },
    color: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => { } // {#typeName#:{from,to,value}}省份对应的坐标
    }
  },
  data() {
    return {
      chart: null,
      series: []
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
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
      this.initChartSkeleton()
    },
    async refresh() {
      this.chart.showLoading()
      this.refreshData()
      this.chart.hideLoading()
    },
    updateData() {
      const list = Object.keys(this.data)
        .filter(i => i !== 'types' && apiOption[i].chartShow[2])
        .map(i => ({
          key: i,
          value: groupByFiled(this.data[i], 'type'),
          name: apiOption[i].name
        }))
      const groupList = []
      list.forEach((v, index_api) => {
        const { name } = v
        console.log(v)
        const keys = Object.keys(v.value)
        keys.forEach((k, index_type) => {
          const needReverseLoacation = name.indexOf('完成') > -1
          const l = {
            name: `${name}(${k})`,
            type: 'lines3D',
            coordinateSystem: 'geo3D',
            effect: {
              show: true,
              trailWidth: 2,
              trailOpacity: 0.5,
              trailLength: 0.2,
              constantSpeed: 5
            },
            blendMode: 'lighter',
            lineStyle: {
              width: 1,
              opacity: 0.5,
              color: this.color[
                (index_api * this.data.types.length + index_type) %
                this.color.length
              ]
            },
            data: v.value[k].map(line => {
              let from = geoProvince[line.from]
              let to = geoProvince[line.to]
              // 可能存在部分人填的是预料之外的值
              if (!from) from = geoProvince['11']
              if (!to) to = geoProvince['11']
              return needReverseLoacation
                ? [to.location, from.location]
                : [from.location, to.location]
            })
          }
          groupList.push(l)
        })
      })
      this.series = groupList
      this.refresh()
    },
    refreshData() {
      const series = this.series
      // console.log(series)
      this.chart.setOption({
        series: series
      })
    },
    initChartSkeleton() {
      const option = {
        geo3D: {
          map: 'china',
          environment: 'auto',
          shading: 'realistic',
          // silent: true, 显示各省
          postEffect: {
            enable: false
          },
          groundPlane: {
            show: false
          },
          light: {
            main: {
              intensity: 1,
              alpha: 30
            },
            ambient: {
              intensity: 0
            }
          },
          itemStyle: {
            color: '#339',
            borderWidth: 1,
            borderColor: '#33f',
            opacity: 0.8
          },
          viewControl: {
            // autoRotateDirection: this.rotateDirection,
            // autoRotate: this.speed > 0,
            // autoRotateSpeed: this.speed,
            damping: 0.8
          },
          regionHeight: 0.05
        },
        legend: {
          right: '5%',
          bottom: '20%',
          orient: 'vertical',
          textStyle: {
            color: '#fff'
          }
        },
        series: []
      }
      this.chart.setOption(option)
    }
  }
}
</script>
