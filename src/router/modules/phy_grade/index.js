import list from './modules/list'
import detail from './modules/detail'
import rules from './modules/rules'
import statistics from './modules/statistics'
import exams from './modules/exams'

const phyGrade = {
  path: 'phyGrade',
  component: () => import('@/views/blank'),
  name: 'MemberPhyGrade',
  hidden: false,
  meta: {
    title: 'default.app.phyGrade.title',
    icon: 'phy-grade'
  },
  children: [statistics, exams, list, detail, rules]
}

export default phyGrade
