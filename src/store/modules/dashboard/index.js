export function loadSettingString(name) {
  return localStorage.getItem(`dashboard.setting[${name}]`)
}
import {
  memberCardDefault
} from './memberCard'
export function createSetting() {
  return {
    color: {
      __setting: {
        default: ['#ff6f4f', '#71ff80', '#3581ff', '#cc337f', '#71ccb0', '#f581cc'], // 父设置
        type: () => import('@/components/ColorsPicker')
      },
      value: {
        memberCard: {
          value: ['#ff6f4f', '#71ff80', '#3581ff', '#cc337f', '#71ccb0', '#f581cc'], // 子设置
          label: '地图序列',
          type: () => import('@/components/ColorsPicker'),
          __setting: {
            useParent: true // 是否继承父设置
          }
        },
        barChart: {
          value: ['#ff6f4f', '#71ff80', '#3581ff', '#cc337f', '#71ccb0', '#f581cc'],
          label: '主图',
          type: () => import('@/components/ColorsPicker'),
          __setting: {
            useParent: true // 是否继承父设置
          }
        }
      },
      label: '配色'
    },
    dateRange: {
      value: {
        start: {
          value: new Date(new Date() - 7 * 86400000),
          label: '开始时间',
          type: 'el-date-picker',
          __setting: {
            props: {
              format: 'yyyy年MM月dd日',
              'value-format': 'yyyy-MM-dd'
            }
          }
        },
        end: {
          value: new Date(),
          label: '结束时间',
          type: 'el-date-picker',
          __setting: {
            props: {
              format: 'yyyy年MM月dd日',
              'value-format': 'yyyy-MM-dd'
            }
          }
        }
      },
      label: '统计时间'
    },
    company: {
      value: {
        main: {
          value: null,
          label: '主单位',
          type: () => import('@/components/Company/CompanySelector')
        },
        compare: {
          value: [],
          label: '比较单位',
          type: () => import('@/components/Company/CompaniesSelector')
        }
      },
      label: '单位'
    },
    memberType: {
      value: null,
      label: '人员类别',
      type: () => import('@/components/Selector'),
      __setting: {
        props: {
          option: [],
          clearable: true
        }
      }
    },
    memberCard: {
      label: '翻牌器设置',
      value: memberCardDefault(),
      type: () => import('@/views/dashboard/Statistics/components/NumberCounter/MembersCounter/Settings')
    }
  }
}
