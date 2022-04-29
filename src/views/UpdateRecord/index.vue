<template>
  <el-card v-loading="loading" style="margin-bottom:3rem">
    <AuthCode :form.sync="auth" select-name="更新记录" />
    <div style="margin:1rem">
      <span>应用名称</span>
      <el-input v-model="appName" style="width:200rem" />
    </div>
    <Pagination :pagesetting.sync="pages" :total-count="pagesTotalCount" />
    <el-button-group>
      <el-button icon="el-icon-plus" type="success" @click="addNew">添加记录</el-button>
      <el-button v-show="!dialogShow" @click="dialogShow=true">批量修改</el-button>
    </el-button-group>
    <el-table :data="list">
      <el-table-column label="版本" width="125rem">
        <template slot-scope="scope">
          <el-input v-model="scope.row.version" />
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.create"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.description"
            type="textarea"
            :rows="1"
            :autosize="!scope.row.saved"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            :disabled="isEqual(prev[scope.row.version],scope.row)"
            type="info"
            @click="handleAction(scope.row,'cancel')"
          >取消</el-button>
          <el-button type="success" @click="handleAction(scope.row,'save')">保存</el-button>
          <el-button
            :disabled="!scope.row.saved"
            type="danger"
            @click="handleAction(scope.row,'delete')"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :pagesetting.sync="pages" :total-count="pagesTotalCount" />
    <el-dialog :visible.sync="dialogShow" title="批量修改">
      <el-input v-model="mutiInput" type="textarea" autosize />
      <el-button icon="el-icon-refresh" type="success" @click="syncCurrent">刷新</el-button>
      <el-button icon="el-icon-upload2" type="success" @click="submitMuti">更新</el-button>
    </el-dialog>
  </el-card>
</template>

<script>
import AuthCode from '@/components/AuthCode'
import Pagination from '@/components/Pagination'
import { modifyUpdateRecord, getUpdateRecord } from '@/api/common/version'
export default {
  name: 'UpdateRecord',
  components: { AuthCode, Pagination },
  data: () => ({
    loading: false,
    list: [],
    prev: {}, // 记录上次保存的记录
    auth: {
      authByUserId: null,
      code: ''
    },
    pagesTotalCount: 0,
    pages: { pageIndex: 0, pageSize: 10 },
    dialogShow: false,
    mutiInput: '',
    userAppName: null
  }),
  computed: {
    appName: {
      get() {
        return this.userAppName || this.$store.state.settings.title
      },
      set(val) {
        this.userAppName = val
      }
    }
  },
  watch: {
    pages: {
      handler(val) {
        this.$nextTick(() => {
          this.refresh()
        })
      }
    },
    appName() {
      this.refresh()
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    syncCurrent() {
      this.mutiInput = JSON.stringify(
        this.list.map(i => ({
          isRemoved: i.isRemoved,
          version: i.version,
          description: i.description,
          create: i.create
        }))
      )
    },
    submitMuti() {
      this.$confirm('确定修改吗？').then(() => {
        const m = JSON.parse(this.mutiInput).map(i => {
          i.appName = this.appName
          return i
        })
        modifyUpdateRecord(m, this.auth).then(() => {
          this.$message.success('批量修改完成')
        })
      })
    },
    refresh() {
      this.loading = true
      const appName = this.appName
      getUpdateRecord(Object.assign({ appName }, this.pages))
        .then(data => {
          this.list = data.list.map(i => {
            this.prev[i.version] = i
            this.prev[i.version].saved = true
            return Object.assign({ saved: true }, i)
          })
          this.pagesTotalCount = data.totalCount
        })
        .finally(() => {
          this.loading = false
        })
    },
    update(model) {
      const m = Object.assign({}, model)
      delete m.saved
      modifyUpdateRecord(m, this.auth).then(data => {
        this.$message.success(model.isRemoved ? '已删除' : '已更新')
        if (model.isRemoved) {
          var rIndex = this.list.findIndex(i => i.version === model.version)
          this.list.splice(rIndex, 1)
        }
      })
    },
    addNew() {
      this.list.unshift({
        version: '版本号',
        description: '描述信息',
        create: new Date(),
        saved: false
      })
    },
    isEqual(a, b) {
      if (!a || !b) return true
      return (
        a.version === b.version &&
        a.description === b.description &&
        a.create === b.create
      )
    },
    async handleAction(item, action) {
      switch (action) {
        case 'delete': {
          if (await this.$confirm('删除将无法恢复,是否继续')) {
            item.isRemoved = true
          } else {
            return
          }
          break
        }
        case 'save': {
          item.appName = this.appName
          break
        }
        case 'cancel': {
          if (!this.prev[item.version]) {
            return this.$message.error('无历史记录')
          } else {
            item = Object.assign({}, this.prev[item.version])
            return
          }
        }
      }
      this.update(item)
    }
  }
}
</script>

<style>
</style>
