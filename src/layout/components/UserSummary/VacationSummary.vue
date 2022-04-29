<template>
  <el-row :gutter="20" style="width:100%">
    <el-col :span="8">
      <div class="data-show">
        <div class="data-title">天数/次数</div>
        <el-link class="data-description" @click="toMyVacation">{{ form.days }}</el-link>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="data-show">
        <div class="data-title">已休路途</div>
        <el-link class="data-description" @click="toMyVacation">{{ form.times }}</el-link>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="data-show">
        <div class="data-title">休假率</div>
        <el-link class="data-description" @click="toMyVacation">{{ form.rate }}%</el-link>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'VacationSummary',
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    form: {
      days: '0/0',
      times: '0/0',
      rate: 0
    }
  }),
  watch: {
    data: {
      handler(val) {
        if (val && val.yearlyLength) {
          var v = val
          this.form.days = `${v.comsumeLength}/${v.nowTimes}`
          this.form.rate =
            v.yearlyLength === 0
              ? 0
              : Math.round((v.comsumeLength / v.yearlyLength) * 10000) / 100
          this.form.times = `${v.onTripTimes}/${v.maxTripTimes}`
        }
      },
      deep: true,
      immediate: true
    },
    deep: true
  },
  methods: {
    toMyVacation() {
      this.$router.push('/apply/vacation/myapply')
    }
  }
}
</script>

<style lang="scss" scoped>
.data-show {
  display: block;
  text-align: center;
  margin: 5px 0 5px 0;

  .data-title {
    color: #ccc;
  }
  .data-description {
    color: #000;
    font-weight: 600;
    font-size: 16px;
  }
}
</style>
