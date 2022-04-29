<template>
  <div>
    <el-tooltip v-if="directShow" effect="light">
      <template #content>
        <VacationDescriptionContent
          :userid="userid"
          :users-vacation.sync="innerUserVacation"
          :loading-result.sync="loading_result"
        />
      </template>
      <el-progress :percentage="percent" :color="getColor(percent)" />
    </el-tooltip>
    <VacationDescriptionContent
      v-else
      :users-vacation.sync="innerUserVacation"
      :userid="userid"
      :loading-result.sync="loading_result"
    />
  </div>
</template>

<script>
const red = [245, 108, 108]
const green = [103, 194, 58]
import { rgbToHex } from '@/utils'
export default {
  name: 'VacationDescription',
  components: {
    VacationDescriptionContent: () => import('./VacationDescriptionContent')
  },
  props: {
    usersVacation: { type: Object, default: () => ({}) },
    thisTimeVacationLength: { type: Number, default: 0 },
    directShow: { type: Boolean, default: true },
    loadingResult: { type: String, default: null },
    userid: { type: String, default: null }
  },
  data: () => ({
    innerUserVacation: {},
    innerLoadingResult: null
  }),
  computed: {
    loading_result: {
      get() {
        return this.innerLoadingResult
      },
      set(val) {
        this.innerLoadingResult = val
        this.$emit('update:loadingResult', val)
      }
    },
    percent() {
      var uv = this.innerUserVacation
      if (!uv.yearlyLength) return 100
      const vl = this.thisTimeVacationLength
      var fn = parseInt
      const spendLength = fn(uv.yearlyLength) - fn(uv.leftLength) + fn(vl)
      var result = Math.floor(100 * (spendLength / fn(uv.yearlyLength)))
      if (result < 0) result = 0
      if (result > 100) result = 100
      return result
    }
  },
  watch: {
    loadingResult: {
      handler(val) {
        this.innerLoadingResult = val
      },
      immediate: true
    },
    usersVacation: {
      handler(val) {
        this.innerUserVacation = val
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getColor(percent) {
      percent = percent / 100
      let r = (1 - percent) * red[0] + percent * green[0]
      let g = (1 - percent) * red[1] + percent * green[1]
      let b = (1 - percent) * red[2] + percent * green[2]
      r = Math.floor(r)
      g = Math.floor(g)
      b = Math.floor(b)
      const c = rgbToHex(`rgba(${r},${g},${b},255)`)
      return c
    }
  }
}
</script>
