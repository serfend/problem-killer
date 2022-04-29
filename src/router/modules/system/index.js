import log from './modules/log'
import file from './modules/file'
import qr_code from './modules/qrCode'
import dwz from './modules/dwz'
import manage from './modules/manager'
import comment from '../others/comment'
import version from './modules/version'
import phy_grade from '../phy_grade'

const system = {
  path: 'system',
  component: () => import('@/views/blank'),
  name: 'System',
  meta: {
    ctitle: '工具管理',
    icon: 'setting'
  },
  children: [
    manage, log,
    {
      path: 'iframePage',
      component: () => import('@/components/IFramePage'),
      name: 'IFramePage',
      hidden: true,
      meta: {
        breadcrumb: false,
        affix: false,
        title: 'default.app.iframepage.title',
        icon: 'component'
      }
    }, version, file, dwz, qr_code, comment,
    phy_grade,
  ]
}

export default system
