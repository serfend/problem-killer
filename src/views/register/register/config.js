export const stepOptions = [
  {
    name: '基本',
    index: 1,
    childIndex: 0,
    childNum: 1,
    icon: 'el-icon-s-custom',
    component: 'Base'
  },
  {
    name: '系统',
    index: 2,
    childIndex: 0,
    childNum: 1,
    icon: 'el-icon-document-copy',
    component: 'Application'
  },
  {
    name: '单位',
    index: 3,
    childIndex: 0,
    childNum: 1,
    icon: 'el-icon-office-building',
    component: 'Company'
  },
  {
    name: '家庭',
    index: 4,
    childIndex: 0,
    childNum: 4,
    icon: 'el-icon-s-home',
    component: 'Social'
  },
  {
    name: '其他(可不填)',
    index: 5,
    childIndex: 0,
    childNum: 1,
    icon: 'el-icon-s-grid',
    component: 'Diy'
  },
  {
    name: '授权(可不填)',
    index: 6,
    childIndex: 0,
    childNum: 1,
    icon: 'el-icon-s-check',
    component: 'Auth'
  }
]

export const createForm = () => ({
  Base: {},
  Social: {},
  Company: {
    // company component require this prop
    company: {},
    title: {},
    duties: {}
  },
  Application: {},
  Diy: {},
  Auth: {},
  password: '',
  confirmPassword: ''
})

export const Const_DisabledVacation = 4
