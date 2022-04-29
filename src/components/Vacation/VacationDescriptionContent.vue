<template>
  <div v-loading="loading">
    <ul v-if="!loading_result" class="tooltip-vacation">
      <li>
        <b>全年假期天数：</b>
        <span>{{ innerData.yearlyLength }}</span>天
      </li>
      <li>
        <b>当前已休次数：</b>
        <span>{{ innerData.nowTimes }}</span>次
      </li>
      <li>
        <b>剩余假期天数：</b>
        <span>{{ innerData.leftLength }}</span>天
      </li>
      <li>
        <b>全年可休路途：</b>
        <span>{{ innerData.maxTripTimes }}</span>次
      </li>
      <li>
        <b>当前已休路途：</b>
        <span>{{ innerData.onTripTimes }}</span>次
      </li>
      <li>
        <b>备注：</b>
        <span>{{ innerData.description || '暂无' }}</span>
      </li>
      <li>
        <b>其他假期：</b>
        <el-tooltip
          v-if="innerData.additionals&&innerData.additionals.length>0"
          effect="light"
          placement="right"
        >
          <div slot="content">
            <div
              v-for="(v,i) in innerData.additionals"
              :key="i"
              :style="{color:v.description=='法定节假日'?'#13ce66':'#ff4949'}"
            >{{ parseTime(v.start) }}:{{ v.name }} {{ v.length }}天</div>
          </div>
          <span>{{ innerData.additionals.reduce((prev,cur)=>prev+cur.length,0) }}天</span>
        </el-tooltip>
        <span v-else>无</span>
      </li>
    </ul>
    <div v-else>{{ loading_result }}</div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { getUsersVacationLimit } from '@/api/user/userinfo'
export default {
  name: 'VacationDescriptionContent',
  components: {},
  props: {
    usersVacation: {
      type: Object,
      default() {
        return {}
      }
    },
    userid: { type: String, default: null },
    loadingResult: { type: String, default: null }
  },
  data: () => ({
    loading: false,
    innerData: {},
    loading_result: null
  }),
  watch: {
    usersVacation: {
      handler(val) {
        this.innerData = val
      },
      immediate: true,
      deep: true
    },
    userid: {
      handler(val) {
        this.refresh()
      },
      immediate: true
    }
  },
  methods: {
    refresh() {
      const { userid } = this
      if (!userid) {
        return
      }
      this.loading = true
      getUsersVacationLimit({ userid })
        .then(data => {
          this.innerData = {
            yearlyLength: 0,
            nowTimes: 0,
            leftLength: 0,
            onTripTimes: 0,
            maxTripTimes: 0,
            ...data
          }
          this.loading_result = null
          this.$emit('update:usersVacation', this.innerData)
        })
        .catch(e => {
          this.loading_result = JSON.stringify(e)
        })
        .finally(() => {
          this.loading = false
          this.$emit('update:loadingResult', this.loadingResult)
        })
    },
    parseTime(val) {
      return parseTime(val, '{y}年{m}月{d}日')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/element-variables';
.tooltip-vacation {
  width: 260px;
  ul,
  li {
    list-style: none;
    letter-spacing: 1px;
    span {
      color: $--color-primary;
    }
  }
}
</style>
