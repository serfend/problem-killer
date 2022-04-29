<template>
  <div id="container" class="container">
    <div v-loading="loading" class="container-bg">
      <div v-if="company" class="statistics-title">
        <h1 class="content">{{ company.name }}休假情况</h1>
        <TimeCenter :time-sync-method="timeZone" />
      </div>
      <section v-if="company" class="mainbox">
        <div class="column">
          <Square>
            <VacationStatisticsBar
              slot="chart"
              ref="vacationApplyStatistics"
              height="100%"
              :color="color_main"
              :companies="companies"
              :data="accumulateData"
            />
          </Square>
          <Square>
            <div
              v-if="$refs.vacationMemberStatisticsPie"
              slot="title"
              style="color:#aaa;margin-left:0.25rem;font-size:0.25rem"
            >{{ $refs.vacationMemberStatisticsPie._data.isRate?'比率':'数值' }}</div>
            <VacationStatisticsLine
              slot="chart"
              ref="vacationMemberStatisticsPie"
              height="100%"
              :color="color_main"
              :companies="companies"
              :data="trendData"
            />
          </Square>
        </div>
        <div class="column">
          <MembersCounter v-if="setting.dateRange" :setting="memberCardSetting" />
          <div class="map">
            <div class="map1" />
            <div class="map2" />
            <div class="map3" />
            <VacationMap3D
              v-if="echartGeoComplete&&memberCardSetting"
              ref="vacationMap"
              height="100%"
              :file-load="requestFile"
              :color="color_card"
              :data="memberCardSetting.data"
            />
          </div>
        </div>
      </section>
      <div style="display:flex;position:fixed;bottom:0;">
        <StatisticsDataDriver
          ref="dataDriver"
          :loading.sync="loading"
          :company="company?company.code:null"
          :companies="companies?companies:null"
          :data.sync="data"
          :date-range="dateRange"
          :company-data.sync="companyData"
          :companies-data.sync="companiesData"
        />
        <EchartGeoLoader
          ref="echartGeoDriver"
          :file-load="requestFile"
          :complete.sync="echartGeoComplete"
        />
        <SettingEngine ref="setting" :setting.sync="setting" @closed="settingUpdated" />
      </div>
    </div>
  </div>
</template>

<script>
import Flexible from './js/flexible'
import Square from './components/Square'

import TimeCenter from './components/NumberCounter/TimeCenter'
import { timeZone } from '@/api/common/static'
import StatisticsDataDriver from './components/Engine/StatisticsDataDriver'
import EchartGeoLoader from './components/Engine/EchartGeoLoader'
import SettingEngine from './components/Engine/SettingEngine'
import { getProp, modify } from '@/utils/data-handle'

import MembersCounter from './components/NumberCounter/MembersCounter'
import VacationMap3D from './components/Geo/VacationMap3D'

import VacationStatisticsBar from './components/Bar/VacationStatisticsBar'
import VacationStatisticsLine from './components/Bar/VacationStatisticsLine'
import { requestFile, download } from '@/api/common/file'
import { getUserCompany } from '@/api/user/userinfo'
import { companyChild } from '@/api/company'
import { apiOption } from './components/Engine/dataDriverApiOption'
import { groupByFiled } from '@/utils/data-handle'
import { debounce } from '@/utils'
export default {
  name: 'Statistics',
  components: {
    Square,
    TimeCenter,
    EchartGeoLoader,
    StatisticsDataDriver,
    SettingEngine,
    MembersCounter,
    VacationMap3D,
    VacationStatisticsBar,
    VacationStatisticsLine
  },
  data: () => ({
    flexible: new Flexible(window, document),
    loading: false,
    echartGeoComplete: false,
    initStatus: 'wait init',
    data: null,
    companyData: null,
    companiesData: null,
    lastUpdate: new Date()
  }),
  computed: {
    updatedSetting() {
      return debounce(() => {
        this.settingUpdated()
      }, 1000)
    },
    setting: {
      get() {
        return this.$store.state.dashboard.setting
      },
      set(n) {
        this.$store.state.dashboard.setting = n
      }
    },
    company() {
      return getProp(this.setting, ['company', 'main'])
    },
    memberType() {
      return getProp(this.setting, ['memberType'])
    },
    companies() {
      return getProp(this.setting, ['company', 'compare'])
    },
    color_card() {
      return getProp(this.setting, ['color', 'memberCard'])
    },
    color_main() {
      return getProp(this.setting, ['color', 'barChart'])
    },
    dateRange() {
      return {
        start: getProp(this.setting, ['dateRange', 'start']),
        end: getProp(this.setting, ['dateRange', 'end'])
      }
    },
    // 子单位累积数据，展示柱状图
    accumulateData() {
      const companiesData = this.companiesData
      if (!companiesData || companiesData.length === 0) return []
      const collectionNames = Object.keys(companiesData[0]).filter(
        i => i !== 'types' && apiOption[i].chartShow[0]
      )
      const allTypes = companiesData[0].types
      const comparer = (a, b) => new Date(b.target) - new Date(a.target)
      const rawData = collectionNames.map(collect => {
        const { props, accumulate } = apiOption[collect]
        const mutiScreenProps = groupByFiled(props, 'screen')
        const screenPropsKeys = Object.keys(mutiScreenProps)
        const spkLen = screenPropsKeys.length
        const screens = screenPropsKeys.map(screenPropsKey => {
          const screenProps = mutiScreenProps[screenPropsKey]
          const series = allTypes.map(t => {
            // get series where `type` equal to `t`
            const typeSeries = screenProps.map(prop => {
              const { key, name } = prop
              const reducer = (prev, cur, curIndec, arr) => prev + cur[key]
              const data = companiesData.map(cmp => {
                const cmpCollect = cmp[collect].filter(i => i.type === t)
                if (!cmpCollect || cmpCollect.length === 0) return 0
                if (accumulate) return cmpCollect.reduce(reducer, 0)
                else {
                  // get lastest data
                  cmpCollect.sort(comparer)
                  const r = cmpCollect[0][key]
                  return r
                }
              })
              return { name: `${name}(${t})`, data }
            })
            const cn = apiOption[collect].name
            const name = spkLen === 1 ? cn : `${cn}(${screenPropsKey})`
            return { name, typeSeries }
          })
          // TODO flat only support in ES6 which require chrome 69+
          const sr = []
          for (let i = 0; i < series.length; i++) {
            const s = series[i]
            const st = s.typeSeries
            for (let j = 0; j < st.length; j++) {
              sr.push(st[j])
            }
          }
          return { name: series[0].name, series: sr }
        })
        return screens
      })
      return [].concat(...rawData)
    },
    // 主单位趋势数据，展示折线图
    trendData() {
      const companyData = this.companyData
      if (!companyData) return []
      const collectionNames = Object.keys(companyData).filter(
        i => i !== 'types' && apiOption[i].chartShow[1]
      )
      const screens = collectionNames.map(collect => {
        const { props, accumulate } = apiOption[collect]
        const companyCollect = companyData[collect]
        const mutiScreenProps = groupByFiled(props, 'screen')
        const screenPropsKeys = Object.keys(mutiScreenProps)
        const spkLen = screenPropsKeys.length
        const screensByPropScreen = screenPropsKeys.map(screenPropsKey => {
          const screenProps = mutiScreenProps[screenPropsKey]
          const seriesDict = {}
          const series = screenProps.map((prop, index) => {
            const { name, key, rateBy } = prop
            let prevData = 0
            const datas = companyCollect.map((data, index) => {
              // 如果需要累积
              if (accumulate) prevData = prevData + data[key]
              else prevData = data[key]
              const dateStr = new Date(data.target).toLocaleDateString()
              const v = [data.target, prevData, dateStr]
              v.push(null) // 占位，用于填充百分比
              v.push(data.type) // 按不同类别进行分类
              return { name: data.target, value: v }
            })
            seriesDict[key] = index
            return { name, data: datas, key, rateBy }
          })
          series.forEach(s => {
            const { rateBy } = s
            if (!rateBy) return
            const cmpDatas = series[seriesDict[rateBy]].data
            s.data.forEach((d, index) => {
              d.value[3] =
                Math.round((10000 * d.value[1]) / cmpDatas[index].value[1]) /
                100
            })
          })
          const cn = apiOption[collect].name
          const name = spkLen === 1 ? cn : `${cn}(${screenPropsKey})`
          return { name, series }
        })
        return screensByPropScreen
      })
      return [].concat(...screens)
    },
    memberCardSetting() {
      return {
        setting: getProp(this.setting, ['memberCard']),
        data: this.companyData
      }
    }
  },
  watch: {
    initStatus: {
      handler(val) {
        if (val === 'inited') {
          this.$nextTick(() => {
            this.updatedSetting()
          })
        }
      }
    },
    companyData: {
      handler(val) {
        if (val) {
          modify(this.setting.memberType, item => {
            item.__setting.props.option = val.types.map(i => {
              return {
                label: i,
                value: i
              }
            })
          })
        }
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.init()
    }, 2000)
  },
  created() {
    this.flexible.init()
  },
  beforeDestroy() {
    this.flexible.terminate()
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    timeZone,
    requestFile(file) {
      return requestFile({ filePath: '/dataview', fileName: file }).then(
        data => {
          const item = data.model || data.file
          const id = item.id
          return download(id)
        }
      )
    },
    async init() {
      this.$nextTick(() => {
        if (this.initStatus !== 'wait init') return
        this.initStatus = 'initing'
        console.log('init main')
        this.loading = '初始化'
        window.addEventListener('resize', this.resize)
        this.$refs.echartGeoDriver.refresh()
        this.reloadUserCompany(this.$route.query.companyCode).then(() => {
          this.reloadChildCompanies().then(() => {
            this.initStatus = 'inited'
          })
        })
      })
    },
    reloadChildCompanies() {
      return companyChild(this.company.code).then(child => {
        modify(this.setting.company.value.compare, m => {
          m = Object.assign(m, {
            value: child.list
          })
        })
      })
    },
    reloadUserCompany(companyCode) {
      return new Promise((res, rej) => {
        const hdlCompany = company => {
          this.setting.company.value.main.value = company
          this.$nextTick(() => res(company))
        }
        if (!companyCode) {
          getUserCompany(null)
            .then(data => {
              hdlCompany(data.company)
            })
            .catch(e => {
              if (e.status === 12120) {
                setTimeout(() => {
                  location.href = '/'
                }, 2000)
              }
              rej(e)
            })
        } else {
          // get current company entity
          const qCompany =
            companyCode.substr(0, companyCode.length - 1) || 'root'
          companyChild(qCompany).then(data => {
            const company = data.list.filter(i => i.code === companyCode)[0]
            hdlCompany(company)
          })
        }
      })
    },
    settingUpdated() {
      console.log('update setting')
      const dataDriver = this.$refs.dataDriver
      if (dataDriver) {
        dataDriver.refresh().then(() => {
          this.refresh(true)
        })
      }
    },
    refresh() {
      this.chartsDoAction(c => {
        if (c._data && c._data.chart && c.refresh) {
          c.refresh()
        }
      })
    },
    resize() {
      this.chartsDoAction(c => {
        var data = c._data
        if (data.chart) data.chart.resize()
      })
    },
    chartsDoAction(method) {
      const lastUpdate = new Date()
      this.lastUpdate = lastUpdate
      setTimeout(() => {
        if (this.lastUpdate !== lastUpdate) return
        for (var component of Object.keys(this.$refs)) {
          const c = this.$refs[component]
          method(c)
        }
      }, 500)
    }
  }
}
</script>

<style lang="scss" >
@import './style/index.scss';
</style>
