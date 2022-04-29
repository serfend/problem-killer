<template>
  <el-card style="margin:2%">
    <template #header>
      <h2>发布记录</h2>
    </template>
    <el-collapse accordion>
      <el-collapse-item v-for="item in list" :key="item.id">
        <template slot="title">
          <h3 style="margin-right:1rem">{{ item.title }}</h3>
          <el-link type="primary">{{ item.version }}</el-link>
        </template>
        <div>{{ formatTime(item.create) }}</div>
        <p v-for="(l,index) in item.description.split('\n')" :key="index">{{ l }}</p>
      </el-collapse-item>
    </el-collapse>
    <el-button
      v-if="hasNextPage"
      v-loading="loading"
      v-infinite-scroll="refresh"
      type="text"
      icon="el-icon-plus"
      @click="refresh"
    >{{ loading?'加载中...':'点击加载更多记录' }}</el-button>
    <div v-else style="height:1px;background-color:#dcdfe6;margin:0.5rem 0.2rem" />
  </el-card>
</template>

<script>
import { formatTime } from '@/utils'
import { getUpdateRecord } from '@/api/common/version'
export default {
  name: 'VersionDisplay',
  data: () => ({
    loading: false,
    list: [],
    pages: { pageIndex: -1, pageSize: 5 },
    totalCount: 0
  }),
  computed: {
    appName() {
      return this.$store.state.settings.title
    },
    hasNextPage() {
      const { pageSize, pageIndex } = this.pages
      return pageSize * pageIndex <= this.totalCount
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    formatTime(t) {
      return formatTime(new Date(t), '{y}-{m}-{d}')
    },
    refresh() {
      if (this.loading || !this.hasNextPage) return
      this.loading = true
      this.pages.pageIndex++
      getUpdateRecord(Object.assign({ appName: this.appName }, this.pages))
        .then(data => {
          this.list = this.list.concat(
            data.list.map(i => {
              let title = ''
              const checkTitle = i.description.substring(0, 2) === '# '
              if (checkTitle) {
                var tPos = i.description.indexOf(' #')
                title = i.description.substring(2, tPos)
                i.description = i.description.substring(tPos + 3)
              } else {
                var pos = i.description.indexOf('\n')
                if (pos > 0) {
                  title = i.description.substring(0, pos)
                }
              }
              if (i.version.substring(0, 1) !== 'v') i.version = `v${i.version}`
              return Object.assign({ title }, i)
            })
          )
          this.totalCount = data.totalCount
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style>
</style>

