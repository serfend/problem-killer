<template>
  <el-card>
    <Welcome menu-name="xjxt.manage" :show-title="false" style="height:1080px" />
  </el-card>
</template>

<script>
import cookie from 'vue-cookie'
import Welcome from '@/views/welcome'
export default {
  name: 'PageManager',
  components: { Welcome },
  data() {
    return {
      list: [
        {
          id: '1',
          label: 'API文档',
          description: 'Swagger界面查询后端支持的Api',
          svg: 'APIwendang',
          // icon: '/favicon.png',
          href: 'swagger'
        },
        {
          id: '2',
          label: '定时处理',
          description: '【需要授权】Schdule定时处理情况',
          svg: 'APIceshi',
          callback: () => {
            const authCode = prompt('输出授权码')
            if (authCode) {
              cookie.set('auth', authCode)
            }
          },
          // icon: '/favicon.png',
          href: 'schdule'
        },
        {
          id: '3',
          label: '配置管理',
          description: 'Apollo配置管理',
          svg: 'jiekou',
          // icon: '/favicon.png',
          href: 'apollo'
        },
        {
          id: '4',
          label: '双数据库',
          description: '【需授权】数据库和缓存管理',
          svg: 'guidangxiangmu',
          // icon: '/favicon.png',
          href: 'database'
        },
        {
          id: '5',
          label: '休假数据',
          description: '【未开放】单位休假情况统计分析',
          svg: 'APIjiankong',
          // icon: '/favicon.png',
          href: ''
        },
        {
          id: '6',
          label: '数据分析',
          description: '【未开放】用户行为和系统运行数据分析',
          svg: 'HTTPcuowushuai',
          // icon: '/favicon.png',
          href: ''
        },
        {
          id: '7',
          label: '集群管理',
          description: '【未开放】集群状态管理',
          svg: 'duoqudaojicheng',
          // icon: '/favicon.png',
          href: ''
        },
        {
          id: '8',
          label: '安全监控',
          description: '【未开放】安全策略配置管理',
          svg: 'anquan',
          // icon: '/favicon.png',
          href: ''
        },
        {
          id: '9',
          label: '服务状态',
          description: '【未开放】服务接口状态监控',
          svg: 'jichuguanli',
          // icon: '/favicon.png',
          href: 'database'
        }
      ]
    }
  },
  computed: {
    formatedList() {
      return this.list.map(i =>
        Object.assign(i, { href: `/settings/system/iframePage?src=${i.href}` })
      )
    }
  }
}
</script>

<style>
</style>
