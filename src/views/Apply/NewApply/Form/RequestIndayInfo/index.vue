<template>
  <div :style="{transition:'all 0.5s'}" @mouseenter="isHover=true" @mouseleave="leaveCard">
    <el-card
      v-loading="loading"
      header="请假信息"
      class="flashing-alert"
      style="position:relative;z-index:2;"
    >
      <el-container v-if="formApply">
        <el-main :style="{filter:hideDetail?'blur(0.2rem)':''}">
          <CardTooltipAlert :accept="submitId" :accepting="anyChanged">
            <template slot="content">注意根据个人需求选择合适的请假类型</template>
          </CardTooltipAlert>
          <el-alert v-if="formApply.isArchitect" center type="error">补充申请 申请将会被标记为【补充记录】</el-alert>
          <el-form ref="formApply" :model="formApply" label-width="6rem">
            <el-form-item label="请假类型">
              <VacationTypeSelector
                ref="typeSelector"
                v-model="formApply.requestType"
                :entity-type="entityType"
                :types.sync="requestTypes"
                :left-length="0"
                :hide="false"
                @change="updateMaxLen"
              />
            </el-form-item>
            <el-form-item label="请假原因">
              <el-input
                v-model="formApply.reason"
                type="textarea"
                maxlength="30"
                show-word-limit
                style="width:30rem"
              />
            </el-form-item>
            <el-form-item label="离队时间" prop="StampLeave" :rules="[{required:true,trigger:'blur'}]">
              <DatetimePicker
                v-model="formApply.StampLeave"
                type="datetime"
                :color="theme"
                format="YYYY-MM-DD HH:mm:ss"
                locale="zh-cn"
                :locale-config="localeConfig"
              />
            </el-form-item>
            <el-form-item label="归队时间" prop="StampReturn" :rules="[{required:true,trigger:'blur'}]">
              <DatetimePicker
                v-model="formApply.StampReturn"
                type="datetime"
                :color="theme"
                format="YYYY-MM-DD HH:mm:ss"
                locale="zh-cn"
                :locale-config="localeConfig"
              />
            </el-form-item>
            <el-form-item label="目的地" :rules="[{required:true,trigger:'blur'}]">
              <CascaderSelector
                v-model="formApply.vacationPlace"
                :child-getter-method="locationChildren"
                :value-name="'code'"
                :label-name="'name'"
                :placeholder="vacationPlaceDefault"
                style="width:30rem"
              />
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="formApply.vacationPlaceName" style="width:30rem" />
            </el-form-item>
            <el-form-item label="交通工具">
              <el-select v-model="formApply.ByTransportation">
                <el-option
                  v-for="i in Object.keys(transportationTypes).filter(t=>t!=='default')"
                  :key="i"
                  :label="transportationTypes[i][1]"
                  :value="i"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-main>
        <el-aside
          width="0.1%"
          style="padding:0;margin:0;text-align:center;background: rgb(255, 255, 255)"
        >
          <div
            class="mask"
            :style="{filter:hideDetail?'':'blur(30px)',background:hideDetail?'#ffffff8f':''}"
          >
            <svg-icon
              :style="{transition:'all 0.5s',opacity:hideDetail?1:0,transform:hideDetail?'rotate(-360deg)':''}"
              icon-class="certification_f"
              style-normal="width:5em;height:5em;fill:#67C23A;color:#67C23A"
            />
          </div>
        </el-aside>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import { postRequestInfo } from '@/api/apply/create'
import { parseTime } from '@/utils'
import localeConfig from '@/lang/locale-config'
import { locationChildren } from '@/api/common/static'
import transportationTypes from '@/components/Vacation/TransportationType/types'
export default {
  name: 'IndayRequestInfo',
  components: {
    CardTooltipAlert: () => import('../FormHelper/CardTooltipAlert'),
    CascaderSelector: () => import('@/components/CascaderSelector'),
    VacationTypeSelector: () =>
      import('@/components/Vacation/VacationTypeSelector'),
    DatetimePicker: () => import('vue-persian-datetime-picker')
  },
  props: {
    userid: { type: String, default: null },
    selfSettle: { type: Object, default: null },
    entityType: { type: String, default: 'inday' }
  },
  data: () => ({
    transportationTypes,
    localeConfig,
    datePickerOption: {
      disabledDate(time) {
        return false
      },
      shortcuts: [
        {
          text: '大前天',
          onClick: p => p.$emit('pick', new Date(new Date() - 3 * 86400e3))
        },
        {
          text: '前天',
          onClick: p => p.$emit('pick', new Date(new Date() - 2 * 86400e3))
        },
        {
          text: '昨天',
          onClick: p => p.$emit('pick', new Date(new Date() - 86400e3))
        },
        {
          text: '今天',
          onClick: p => p.$emit('pick', new Date())
        },
        {
          text: '明天',
          onClick: p => p.$emit('pick', new Date(+new Date() + 86400e3))
        },
        {
          text: '后天',
          onClick: p => p.$emit('pick', new Date(+new Date() + 2 * 86400e3))
        },
        {
          text: '大后天',
          onClick: p => p.$emit('pick', new Date(+new Date() + 3 * 86400e3))
        }
      ]
    },
    loading: false,
    formApply: null,
    requestTypes: null,
    vacationPlaceDefault: null,
    submitId: null,
    isHover: false,
    anyChanged: false,
    defaultDateRangeCallBack: null
  }),
  computed: {
    theme() {
      return this.$store.state.settings.theme
    },
    hideDetail() {
      return this.submitId && !this.isHover
    },
    nowYear() {
      var date = new Date()
      return date.getFullYear()
    },
    currentUser() {
      return this.$store.state.user.data
    }
  },
  watch: {
    formApply: {
      handler(val) {
        if (val && !this.loading) {
          this.$nextTick(() => {
            this.updatedApply()
          })
        }
      },
      deep: true
    },
    selfSettle: {
      handler(val) {
        this.resetSettle(val)
      },
      deep: true
    },
    'formApply.requestType': {
      handler(val) {
        this.$emit('requestTypeUpdate', val)
        this.resetDefaultDate()
        if (this.defaultDateRangeCallBack) {
          const t = this.defaultDateRangeCallBack(new Date(), parseTime)
          const f = this.formApply
          if (f) {
            f.StampLeave = t.start
            f.StampReturn = t.end
          }
        }
      }
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    resetDefaultDate() {
      const type = this.$refs.typeSelector
      const t = type && type.nowVacationType
      if (!t) return
      let callback = t.defaultDateRange
      if (callback) {
        let sci_callback
        do {
          sci_callback = callback
          callback = callback.replace(/new/g, '')
        } while (sci_callback !== callback)
        this.defaultDateRangeCallBack = new Function('v', 'parseTime', callback)
      } else {
        this.defaultDateRangeCallBack = v => {
          const start = parseTime(+v + 86400e3, '{y}-{m}-{d} 08:00:00')
          const end = parseTime(+v + 86400e3, '{y}-{m}-{d} 18:00:00')
          return { start, end }
        }
      }
    },
    resetSettle(val) {
      if (val && val.self && val.self.address) {
        const self = val.self.address
        if (self) {
          const likely = Object.assign({}, self)
          this.formApply.vacationPlace = likely
          likely.name = `${likely.name}(默认请假地点)`
          this.vacationPlaceDefault = likely.name
        }
      }
    },
    createNewRequest() {
      const types = this.requestTypes
      return {
        StampLeave: null,
        StampReturn: null,
        vacationPlace: {},
        vacationPlaceName: '',
        reason: '',
        ByTransportation: '2',
        requestType: types ? types[0].name : ''
      }
    },
    locationChildren,
    updateMaxLen() {
      // 更新请假限制
    },
    updatedApply() {
      this.anyChanged = true
      this.submitId = null
      this.$emit('update:submitId', null)
    },
    leaveCard() {
      this.isHover = false
      this.submitRequestInfo()
    },
    // call by base info ,DO NOT REMOVE
    refreshVacation() {},
    reset() {
      this.formApply = this.createNewRequest()
      this.resetLoading()
    },
    resetLoading() {
      this.loading = false
      this.anyChanged = false
      this.updatedApply()
    },
    checkParamValid(params) {
      const id = !params.id
      const place =
        !params.vacationPlace ||
        !params.vacationPlace.code ||
        params.vacationPlace.code.length < 6
      const stamp =
        !params.StampLeave || new Date(params.StampLeave) < new Date('2000-1-1')
      const result = []
      if (id) result.push('基础信息未成功提交')
      if (place) {
        result.push(
          `地点须精确到区县，当前:${(params.vacationPlace &&
            params.vacationPlace.code) ||
            '未填写'}`
        )
      }
      if (stamp) result.push('离队时间有误')
      return result
    },
    /**
     * 提交请求信息
     */
    submitRequestInfo() {
      if (this.loading || !this.anyChanged) return
      this.submitId = null
      this.$emit('update:submitId', null)

      let s = Object.assign({ id: this.userid }, this.formApply)
      s.StampLeave = parseTime(s.StampLeave)
      s.StampReturn = parseTime(s.StampReturn)
      const items = this.checkParamValid(s)
      if (items.length > 0) {
        this.anyChanged = false
        this.$message.error(items.join(' '))
        return
      }
      s.vacationPlace = s.vacationPlace.code
      this.loading = true
      s = Object.assign({ lawVacationSet: this.lawVacations }, s)
      postRequestInfo(s, this.entityType)
        .then(data => {
          this.$message.success('请假信息验证成功')
          this.submitId = data.id
          this.$emit('update:submitId', data.id)
          setTimeout(() => {
            this.$emit('submited', true)
          }, 200)
        })
        .catch(() => {
          this.$emit('submited', false)
        })
        .finally(() => {
          this.loading = false
          this.anyChanged = false
        })
    },
    updateChange() {
      this.refreshVacation()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/animation';
</style>
