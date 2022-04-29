export const rankingOpt = [{
  type: '一类人员',
  value: 1,
  // 名称 最低分 是否不参与计算 是否不显示
  standards: [
    ['单项及格', 65, true],
    ['不及格', 0, false, true],
    ['及格', 260],
    ['良好', 340],
    ['优秀', 380],
    ['特3级', 440],
    ['特2级', 480],
    ['特1级', 500]
  ]
}, {
  type: '二类人员',
  value: 2,
  standards: [
    ['单项及格', 60, true],
    ['不及格', 0, false, true],
    ['及格', 240],
    ['良好', 300],
    ['优秀', 360],
    ['特3级', 440],
    ['特2级', 480],
    ['特1级', 500]
  ]
}, {
  type: '三类人员',
  value: 3,
  standards: [
    ['单项及格', 55, true],
    ['不及格', 0, false, true],
    ['及格', 220],
    ['良好', 300],
    ['优秀', 340],
    ['特3级', 440],
    ['特2级', 480],
    ['特1级', 500]
  ]
}]

export const singleRankingOpt = [{
  grade: 0,
  description: '不及格',
  status: 'danger',
  color: '#900'
}, {
  grade: 60,
  description: '及格',
  status: 'warning',
  color: '#ffba00'
}, {
  grade: 80,
  description: '良好',
  status: 'primary',
  color: '#46b6ef'
}, {
  grade: 90,
  description: '优秀',
  status: 'success',
  color: '#13ce66'
}, {
  grade: 100,
  description: '特3级',
  status: 'success',
  color: '#13ce77'
}, {
  grade: 110,
  description: '特2级',
  status: 'success',
  color: '#13ce88'
}, {
  grade: 120,
  description: '特1级',
  status: 'success',
  color: '#13ce99'
}]
