<template>
  <span>
    <span v-if="descList[pickerType]">
      <el-date-picker v-model="ratingCycleDate" type="year" style="width:8rem" />
      <el-radio-group v-model="ratingCycleDesc" @change="selectChange">
        <el-radio-button
          v-for="(i,index) in descList[pickerType]"
          :key="index"
          :label="i.v"
        >{{ i.l }}</el-radio-button>
      </el-radio-group>
    </span>
    <span v-else-if="!pickerType" />
    <el-date-picker v-else v-model="ratingCycleDate" :type="pickerType" style="width:10rem" />
    <span v-if="value" style="color:#eee">{{ value }}期</span>
  </span>
</template>

<script>
import { ratingTypeDict } from '../setting'
import { parseTime } from '@/utils'
import {
  descList,
  dateValueToCycleCount,
  dateValueToCycleDesc
} from './converter'
export default {
  name: 'RatingCycleSelector',
  model: {
    prop: 'v',
    event: 'change'
  },
  props: {
    v: { type: Number, default: 0 },
    rawDate: { type: Date, default: null },
    dateName: { type: String, default: null },
    ratingType: { type: Number, default: 0 },
    ratingTypes: { type: Array, default: null }
  },
  data: () => ({
    value: 0,
    ratingCycleDateValue: null,
    ratingCycleDesc: null,
    descList,
    ratingTypeList: ratingTypeDict
  }),
  computed: {
    pickerType() {
      const t = this.ratingTypeDict[this.ratingType]
      return t && t[2]
    },
    ratingTypeDict() {
      const types = this.ratingTypes
      const v = this.ratingTypeList
      if (v && !types) return v
      const dict = {}
      types.map(i => {
        dict[i.code] = [i.desc, true, i.type]
      })
      return dict
    },
    ratingCycleDate: {
      get() {
        return this.ratingCycleDateValue
      },
      set(v) {
        this.ratingCycleDateValue = v
        this.onChange()
      }
    }
  },
  watch: {
    rawDate: {
      handler(val) {
        this.ratingCycleDateValue = val
      },
      immediate: true
    },
    ratingType: {
      handler(val) {
        this.onChange()
      }
    },
    v: {
      handler(val) {
        this.value = val
        this.onChange()
      },
      immediate: true
    }
  },
  methods: {
    selectChange(v) {
      this.ratingCycleDate = new Date(parseTime(new Date(), v))
    },
    onChange() {
      const v = this.ratingCycleDateValue
      this.$emit('update:rawDate', v)
      const { ratingType, ratingCycleDesc } = this
      this.value = dateValueToCycleCount(ratingType, v, ratingCycleDesc)
      this.$emit('change', this.value)
      if (!this.value) return this.$emit('update:dateName', null)
      const descName = dateValueToCycleDesc(ratingType, v, ratingCycleDesc)
      this.$emit('update:dateName', descName)
    }
  }
}
</script>
