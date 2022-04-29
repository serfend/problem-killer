<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :sm="24" :md="18" :lg="12">
        <el-card>
          <el-form style="justify-content:center" label-width="100px">
            <el-form-item label="原始链接">
              <el-input v-model="target" type="textarea" />
            </el-form-item>
            <el-form-item label="有效期">
              <el-radio-group v-model="validDateLength">
                <el-radio :label="1">1天</el-radio>
                <el-radio :label="7">7天</el-radio>
                <el-radio :label="3650">永久</el-radio>
                <el-date-picker v-model="expire" type="datetime" placeholder="自定义" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="自定id">
              <el-input v-model="urlKey" />
            </el-form-item>
            <el-form-item label="短链接">
              <ShortUrl :url-key.sync="urlKey" />
            </el-form-item>
            <el-button type="success" @click="create()">创建</el-button>
            <el-tooltip v-show="urlKey" :content="`基于已填写的key:${urlKey}创建`">
              <el-button type="success" @click="create(urlKey)">保存</el-button>
            </el-tooltip>
            <el-button type="danger" @click="remove">删除</el-button>
            <el-button type="info" @click="loadStatistics">统计情况</el-button>
          </el-form>
        </el-card>
      </el-col>
      <el-col :sm="24" :md="18" :lg="12">
        <el-card v-loading="onLoading">
          <template slot="header">
            <el-button type="success" icon="el-icon-refresh-right" round @click="loadShortUrls" />
          </template>
          <el-table :data="shortUrls">
            <el-table-column label="短链接">
              <template slot-scope="scope">
                <el-link :href="shortUrlContent(scope.row.key)">{{ scope.row.key }}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="目标">
              <template slot-scope="scope">
                <el-link :href="scope.row.target">{{ scope.row.target }}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="有效期">
              <template slot-scope="scope">
                <div>{{ scope.row.create }}</div>
                <div>{{ scope.row.expire }}</div>
              </template>
            </el-table-column>
            <el-table-column label="创建人">
              <template slot-scope="scope">{{ scope.row.createBy }}</template>
            </el-table-column>
          </el-table>
          <Pagination :pagesetting.sync="pages" :total-count="pagesTotalCount" />
        </el-card>
      </el-col>
      <el-col :sm="24" :md="18" :lg="12">
        <el-card>
          <ShortUrlStatistics :url-key="urlKey" />
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { shortUrlContent } from './config'
import { createDwz, loadDwz, remove } from '@/api/common/dwz'
import ShortUrl from './ShortUrl'
import ShortUrlStatistics from './ShortUrlStatistics'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'ShortUrlView',
  components: { ShortUrl, ShortUrlStatistics, Pagination },
  data: () => ({
    onLoading: false,
    target: '',
    urlKey: '',
    expire: '',
    validDateLength: 1,
    statisticsData: {},
    statisticsQuery: {
      create: { start: '', end: '' },
      viewBy: '',
      ip: '',
      device: '',
      pages: { pageIndex: 0, pageSize: 999 }
    },
    shortUrls: [],
    pages: {
      pageIndex: 0,
      pageSize: 20
    },
    pagesTotalCount: 0
  }),
  computed: {
  },
  watch: {
    validDateLength: {
      handler(val) {
        if (val) {
          this.expire = parseTime(new Date(+new Date() + val * 86400 * 1000))
        }
      },
      immediate: true
    },
    pages: {
      handler(val) {
        this.loadShortUrls()
      },
      immediate: true
    }
  },
  mounted() {
    this.loadShortUrls()
  },
  methods: {
    shortUrlContent,
    create(key) {
      createDwz(this.target, key, this.expire).then(data => {
        this.urlKey = data.key
        this.$message.success('保存成功')
      })
    },
    remove() {
      remove(this.urlKey).then(() => {
        this.$message.success('已删除')
      })
    },
    loadStatistics() {},
    loadShortUrls() {
      this.onLoading = true
      loadDwz({ pages: this.pages })
        .then(data => {
          var list = data.list
          this.shortUrls = list
          this.pagesTotalCount = data.totalCount
        })
        .finally(() => {
          this.onLoading = false
        })
    }
  }
}
</script>

<style>
</style>
