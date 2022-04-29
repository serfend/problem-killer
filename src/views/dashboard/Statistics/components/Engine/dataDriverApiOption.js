const dailyApiOption = [{
  key: 'applyMembersCount',
  name: '申请人数', // 图表展示项
  rateBy: 'membersCount', // 如果需要百分比，则以哪个计算
  screen: '人数' // 分配至哪个屏幕
}, {
  key: 'completeVacationExpectDayCount',
  name: '应休天数',
  screen: '天数'
}, {
  key: 'completeVacationRealDayCount',
  name: '实休天数',
  rateBy: 'completeVacationExpectDayCount',
  screen: '天数'
}, {
  key: 'completeYearlyVacationCount',
  name: '休满假数',
  rateBy: 'membersCount',
  screen: '人数'
}, {
  key: 'membersCount',
  name: '总人数',
  screen: '人数'
}, {
  key: 'membersVacationDayLessThanP60',
  name: '休假低于60%数',
  rateBy: 'membersCount',
  screen: '人数'
}]
import {
  getAppliesNew,
  getAppliesComplete,
  getAppliesProcess,
  getAppliesDailyProcess
} from '@/api/statistics'
export const apiOption = {
  new: {
    name: '新增休假', // api名称
    api: getAppliesNew, // api方法
    props: [{ // 单个实体展示属性
      key: 'day',
      name: '天数'
    }, {
      key: 'value',
      name: '次数'
    }],
    accumulate: true, // 是否仅展示最后一条
    chartShow: [true, false, true] // 在哪些图表上展示
  },
  complete: {
    name: '完成休假',
    api: getAppliesComplete,
    props: [{
      key: 'day',
      name: '天数'
    }, {
      key: 'value',
      name: '次数'
    }],
    accumulate: true,
    chartShow: [true, false, true]
  },
  process: {
    name: '完成情况',
    api: getAppliesProcess,
    props: [{
      key: 'applyCount',
      name: '申请数'
    }, {
      key: 'applySumDayCount',
      name: '天数'
    }],
    accumulate: true,
    chartShow: [true, false, false]
  },
  daily: {
    name: '累积情况',
    api: getAppliesDailyProcess,
    props: dailyApiOption,
    accumulate: false,
    chartShow: [true, true, false]
  }
}
