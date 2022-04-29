<template>
  <div :style="{transition:'all 0.5s'}" @mouseenter="isHover=true" @mouseleave="leaveCard">
    <el-card
      v-loading="loading"
      header="休假信息"
      class="flashing-alert"
      style="position:relative;z-index:2;"
    >
      <el-form label-width="5rem">
        <el-form-item label="填报类型">
          <el-tooltip content="正式填报休假申请，审批通过后计入全年休假情况。">
            <el-radio v-model="main_type" :label="0" border>正式报假</el-radio>
          </el-tooltip>
          <el-tooltip content="用于填报年度休假计划，不计入全年休假情况。">
            <el-radio v-model="main_type" :label="2" border>计划报假</el-radio>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-show="main_type==0" label="选择计划">
          <el-tooltip content="【开发中】您可以从之前填报的计划中直接选取作为正式填报项提交">
            <el-select v-model="direct_select_apply" disabled>
              <el-option value="1" label="8月1日正休15天" />
            </el-select>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <el-container v-show="main_type>-1">
        <el-main :style="{filter:hideDetail?'blur(0.2rem)':''}">
          <CardTooltipAlert :accept="submitId" :accepting="anyChanged">
            <template slot="content">鼠标移到休假进度条上可查看年度休假情况，有误请联系业务口。</template>
          </CardTooltipAlert>
          <el-alert
            v-if="formApply && formApply.isArchitect"
            center
            type="error"
          >补充申请 申请将会被标记为【补充记录】</el-alert>
          <el-form v-if="formApply" ref="formApply" :model="formApply" label-width="6rem">
            <el-form-item label="年休假率">
              <VacationDescription
                v-if="nowVacationType&&usersvacation"
                :users-vacation="usersvacation"
                :this-time-vacation-length="nowVacationType.primary?formApply.vacationLength:0"
              />
            </el-form-item>
            <el-form-item label="休假类型">
              <VacationTypeSelector
                v-model="formApply.vacationType"
                :entity-type="entityType"
                :types.sync="vacationTypes"
                :left-length="usersvacation.leftLength"
                :hide="false"
                @change="updateMaxLen"
              />
            </el-form-item>
            <el-form-item label="休假原因">
              <el-input
                v-model="formApply.reason"
                type="textarea"
                maxlength="30"
                show-word-limit
                style="width:30rem"
              />
            </el-form-item>
            <el-form-item label="休假天数">
              <el-slider
                v-model="formApply.vacationLength"
                show-input
                :max="maxVacationLength"
                :min="0"
                :format-tooltip="v=>`${v}/${maxVacationLength}天`"
                @input="updateChange"
              />
            </el-form-item>
            <el-form-item v-if="nowVacationType && nowVacationType.canUseOnTrip" label="路途天数">
              <el-slider
                v-model="formApply.OnTripLength"
                show-input
                :max="14"
                :min="0"
                :format-tooltip="v=>`${v}/14天`"
                @input="updateChange"
              />
            </el-form-item>
            <el-form-item v-if="nowVacationType &&nowVacationType.caculateBenefit" label="其他假">
              <BenefitVacation v-model="benefitList" @change="updateChange" />
            </el-form-item>
            <el-form-item
              label="离队时间"
              prop="StampLeave"
              :rules="[{required:true,validator:stampLeaveRuleCheck,trigger:'blur'}]"
            >
              <div style="display:flex">
                <DatetimePicker
                  v-model="formApply.StampLeave"
                  type="date"
                  view="year"
                  :color="theme"
                  format="YYYY-MM-DD"
                  locale="zh-cn"
                  :locale-config="localeConfig"
                  @change="updateChange"
                />
                <span style="margin-left:1rem">预计归队</span>
                <el-date-picker
                  v-model="formApply.StampReturn"
                  disabled
                  placeholder="自动计算"
                  type="date"
                  format="yyyy年MM月dd日"
                  value-format="yyyy-MM-dd"
                />
              </div>
            </el-form-item>
            <el-form-item v-if="nowVacationType &&nowVacationType.caculateBenefit">
              <el-collapse-transition v-for="(item,i) in lawVacations" :key="item.id">
                <LawVacation
                  v-model="lawVacations[i].useLength"
                  :max-length="item.length"
                  :name="item.name"
                  :start="item.start"
                  style="margin:0.2rem"
                />
              </el-collapse-transition>
            </el-form-item>
            <el-form-item label="目的地" :rules="[{required:true,trigger:'blur'}]">
              <CascaderSelector
                v-model="formApply.vacationPlace"
                :child-getter-method="locationChildren"
                :value-name="'code'"
                :label-name="'name'"
                :placeholder="vacationPlaceDefault&&vacationPlaceDefault.code==formApply.vacationPlace.code?vacationPlaceDefault.name:''"
                style="width:30rem"
              />
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="formApply.vacationPlaceName" style="width:30rem" />
            </el-form-item>
            <el-form-item label="交通工具">
              <el-select v-model="formApply.ByTransportation" placeholder="火车">
                <el-option label="火车" :value="0" />
                <!-- <el-option label="飞机" value="1" /> -->
                <el-option label="汽车" :value="2" />
                <el-option label="其他" :value="-1" />
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
import { postRequestInfo, getStampReturn } from '@/api/apply/create'
import { parseTime } from '@/utils'
import { locationChildren } from '@/api/common/static'
import { getUsersVacationLimit } from '@/api/user/userinfo'
import localeConfig from '@/lang/locale-config'

export default {
  name: 'RequestInfo',
  components: {
    CardTooltipAlert: () => import('../FormHelper/CardTooltipAlert'),
    VacationDescription: () =>
      import('@/components/Vacation/VacationDescription'),
    VacationTypeSelector: () =>
      import('@/components/Vacation/VacationTypeSelector'),
    CascaderSelector: () => import('@/components/CascaderSelector'),
    BenefitVacation: () => import('./BenefitVacation'),
    LawVacation: () => import('./LawVacation'),
    DatetimePicker: () => import('vue-persian-datetime-picker')
  },
  props: {
    userid: { type: String, default: null },
    selfSettle: { type: Object, default: null },
    entityType: { type: String, default: 'vacation' }
  },
  data: () => ({
    localeConfig,
    loading: false,
    formApply: {},
    vacationPlaceDefault: null,
    vacationTypes: null,
    usersvacation: {
      yearlyLength: 0,
      nowTimes: 0,
      leftLength: 0,
      onTripTimes: 0,
      maxTripTimes: 0
    },
    benefitList: [],
    lawVacations: [],
    submitId: null,
    isHover: false,
    anyChanged: false,
    nowMaxLength: 30,
    main_type: -1, // 0:正式报 1:计划报
    direct_select_apply: null
  }),
  computed: {
    theme() {
      return this.$store.state.settings.theme
    },
    nowVacationType() {
      const type = this.formApply && this.formApply.vacationType
      return this.vacationTypes && this.vacationTypes.find(v => v.name === type)
    },
    // above 3 computed should remove in the future
    maxVacationLength() {
      const type = this.nowVacationType
      if (!type) return 0
      const isPrimary = type.primary
      const leftLength = Math.min(this.usersvacation.leftLength, type.maxLength)
      return isPrimary ? leftLength : this.nowMaxLength
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
    },
    filtedBenefitList() {
      return this.benefitList.filter(i => i && i.name && i.length)
    },
    checkIsPlan() {
      const i = this.main_type
      const main_type_dict = { 0: false, 2: true }
      return main_type_dict[i]
    }
  },
  watch: {
    vacationTypes: {
      handler(val) {
        if (!val) return
        this.$nextTick(() => {
          if (!this.formApply) {
            this.formApply = this.createNewRequest()
          }
          this.formApply.vacationType = val[0].name
        })
      }
    },
    main_type: {
      handler(val) {
        this.$nextTick(() => {
          this.updateChange()
        })
      }
    },
    lawVacations: {
      handler(val) {
        this.updateChange()
      },
      deep: true
    },
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
    'formApply.vacationType': {
      handler(val) {
        this.$emit('vacationTypeUpdate', val)
      }
    },
    selfSettle: {
      handler(val) {
        this.resetSettle(val)
      },
      deep: true
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    locationChildren,
    updatedApply() {
      this.anyChanged = true
      this.submitId = null
      this.$emit('update:submitId', null)
      const vl = this.formApply.vacationLength
      const nm = this.nowMaxLength
      if (vl > 0.7 * nm || (vl < 2 * nm && nm > 30)) {
        this.updateMaxLen()
      }
    },
    updateMaxLen() {
      const type = this.nowVacationType
      if (!type) return
      let newLength = this.formApply.vacationLength * 1.5 + 1
      const maxMin = Math.min(type.maxLength, 30)
      if (newLength < maxMin) newLength = maxMin
      if (newLength > type.maxLength) newLength = type.maxLength
      this.nowMaxLength = newLength
    },
    stampLeaveRuleCheck(field, invalid, cb) {
      const i = new Date(this.formApply[field.field]) < new Date('2000-1-1')
      if (i) return cb(new Error('离队时间不合法'))
      cb()
    },
    leaveCard() {
      this.isHover = false
      this.submitRequestInfo()
    },
    // call by base info ,DO NOT REMOVE
    refreshVacation() {
      const { userid, checkIsPlan } = this
      const vacationYear =
        (this.formApply && new Date(this.formApply.StampLeave).getFullYear()) ||
        new Date().getFullYear()
      getUsersVacationLimit({ userid, vacationYear, checkIsPlan })
        .then(data => {
          this.usersvacation = data
        })
        .finally(() => {
          this.vacationYear = vacationYear
          this.resetLoading()
        })
    },
    resetSettle(val) {
      if (val && val.self && val.self.address) {
        const self = val.self.address
        const social = [val.parent, val.lover, val.loversParent]
        const checkDic = social.map(i => i.address)
        const target = checkDic.find(i => i && i.code !== self.code)
        if (target) {
          const likely = Object.assign({}, target)
          this.formApply.vacationPlace = likely
          likely.name = `${likely.name}(默认休假地点)`
          this.vacationPlaceDefault = likely
        }
      }
    },
    reset() {
      console.log('reset request')
      this.formApply = this.createNewRequest()
      this.resetLoading()
    },
    resetLoading() {
      this.loading = false
      this.anyChanged = false
      this.updatedApply()
    },
    createNewRequest() {
      const types = this.vacationTypes
      return {
        StampLeave: parseTime(+new Date() + 86400e3, '{y}-{m}-{d}'),
        StampReturn: '',
        vacationLength: 0,
        OnTripLength: 0,
        vacationType: types ? types[0].name : '',
        vacationPlace: {},
        vacationPlaceName: '',
        lawVacaion: [],
        reason: '',
        ByTransportation: 0,
        isPlan: null
      }
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
          `休假地点须精确到区县，当前:${(params.vacationPlace &&
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
      if (this.loading || !this.anyChanged || this.main_type === -1) return
      this.submitId = null
      this.$emit('update:submitId', null)

      const caculaingDate = this.caculaingDate()
      if (caculaingDate.length < 0) return

      let s = Object.assign({ id: this.userid }, this.formApply)

      s.isPlan = this.checkIsPlan
      s.vacationAdditionals = this.filtedBenefitList
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
          this.$message.success('休假信息验证成功')
          this.submitId = data.id
          this.$emit('update:submitId', data.id)
          this.$emit('update:mainType', this.main_type)
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
      const caculaingDate = this.caculaingDate()
      this.refreshVacation()
      if (caculaingDate.length < 0) return
      this.formApply.isArchitect = new Date(caculaingDate.start) <= new Date()
      let s = Object.assign({}, caculaingDate)
      const lawVacations = this.lawVacations
      s = Object.assign({ lawVacationSet: lawVacations }, s)
      getStampReturn(s).then(data => {
        if (!data) return
        this.formApply.StampReturn = parseTime(data.endDate, '{y}-{m}-{d}')
        const des = data.descriptions ? data.descriptions : []
        const t1 =
          lawVacations.length !== des.length
        const t2 = des.find(i => {
          const item = lawVacations.find(l => i.id === l.id)
          return !item || item.length !== i.length
        })
        if (t1 || t2) this.lawVacations = des
      })
    },
    caculaingDate() {
      if (!this.formApply.StampLeave) return {}
      const benefits = this.filtedBenefitList.reduce((prev, cur) => {
        return prev + cur.length
      }, 0)
      // 正休假计算路途，如果存在福利假则不计算法定节假日
      const type = this.nowVacationType
      if (!type) return {}
      const trip = type.canUseOnTrip
      const benefit = type.caculateBenefit

      const primary = parseInt(this.formApply.vacationLength)
      const onTrip = parseInt(this.formApply.OnTripLength)
      let total = primary
      if (trip) total += onTrip
      // if (benefit) total += benefits // 福利假不可累积法定节假日
      return {
        start: this.formApply.StampLeave,
        length: total,
        benefits,
        caculateLawvacation: benefit
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/animation';
</style>
