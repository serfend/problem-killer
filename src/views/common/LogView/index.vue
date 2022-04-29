<template>
  <div>
    <el-card>
      <el-form inline>
        <el-form-item label="uid">
          <el-input v-model="uid" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="createTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
            clearable
          />
        </el-form-item>
        <el-form-item label="信息等级">
          <el-select
            v-model="rank"
            class="full-width"
            placeholder="选择"
            multiple
            clearable
            @change="updatenew(true)"
          >
            <el-option
              v-for="item in rankDicArray"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
              <span :style="{'float': 'left','color':item.foreColor}">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备">
          <el-select
            v-model="device"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="选择或添加设备名称"
          >
            <el-option
              v-for="item in messageMap('device')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="ip">
          <el-select
            v-model="ip"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="选择或添加来源ip"
          >
            <el-option
              v-for="item in messageMap('ip')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="包含信息">
          <el-input v-model="message" />
        </el-form-item>
        <el-button v-loading="isLoading" type="success" style="width:100%;" @click="updatenew">立即刷新</el-button>
      </el-form>
    </el-card>
    <el-card>
      <el-table
        v-loading="isLoading"
        :data="rank.length>0?tableData.filter(i=>rank.indexOf(i.rank)>-1):tableData"
        border
        style="width: 100%"
      >
        <el-table-column label="等级" width="120">
          <template slot-scope="scope">
            <el-tag :color="rankDic[scope.row.rank].foreColor">{{ rankDic[scope.row.rank].name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tag
              :color="operationDic[scope.row.operation].foreColor"
            >{{ operationDic[scope.row.operation].name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="日期" width="120">
          <template slot-scope="scope">{{ format(scope.row.date) }}</template>
        </el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="ip" width="120">
          <template slot-scope="scope">{{ scope.row.ip }}</template>
        </el-table-column>
        <el-table-column label="设备" width="120">
          <template slot-scope="scope">{{ scope.row.device }}</template>
        </el-table-column>
        <el-table-column label="UserAgent">
          <template slot-scope="scope">{{ scope.row.ua }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleClick(scope.row)">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <Pagination :pagesetting.sync="page" :total-count="pagesTotalCount" />
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import {
  getReport,
  report,
  getReportDic,
  getUserActionOperationDic
} from '@/api/account'
import { formatTime } from '@/utils'
export default {
  name: 'LogView',
  data() {
    return {
      page: {
        pageIndex: 0,
        pageSize: 20
      },
      pagesTotalCount: 0,
      isLoading: false,
      uid: '',
      rank: [], // 选中指定rank
      ip: [], // 选中指定ip
      createTime: null,
      device: [], // 选中指定device
      message: null,
      rankDicArray: [], // 日志等级设置
      rankDic: {},
      operationDicArray: [], // 日志操作设置
      operationDic: {},
      tableData: []
    }
  },
  mounted() {
    const method = this.updatenew
    const opeationDic = new Promise((resolve, reject) => {
      getUserActionOperationDic()
        .then(data => {
          this.operationDic = data.list
          for (let i = 0; i < this.operationDic.length; i++) {
            this.operationDicArray.push(this.operationDic[i])
          }
          return resolve()
        })
        .catch(e => {
          return reject(e)
        })
    })
    const reportDic = new Promise((resolve, reject) => {
      getReportDic()
        .then(data => {
          this.rankDic = data.list
          for (let i = 0; i < this.rankDic.length; i++) {
            this.rankDicArray.push(this.rankDic[i])
          }
          return resolve()
        })
        .catch(e => {
          return reject(e)
        })
    })
    Promise.all([opeationDic, reportDic]).then(() => {
      method()
    })
  },
  methods: {
    report,
    getReport,
    format(d) {
      return formatTime(d)
    },
    messageMap(keyName) {
      const l = this.tableData.map(i => {
        return {
          value: i[keyName],
          label: i[keyName]
        }
      })
      const keys = {}
      const result = []
      for (let i = 0; i < l.length; i++) {
        const item = l[i]
        if (!keys[item.value]) {
          keys[item.value] = true
          result.push(item)
        }
      }
      return result
    },
    handleClick(row) {
      console.log(row)
    },
    updatenew(isUserAction) {
      this.isLoading = true
      const cDate = this.createTime || []
      getReport(
        this.uid,
        cDate[0] ? parseTime(cDate[0]) : null,
        cDate[1] ? parseTime(cDate[1]) : null,
        this.page,
        this.rank.length === 0 ? null : this.rank,
        this.ip.length === 0 ? null : this.ip,
        this.device.length === 0 ? null : this.device,
        this.message ? this.message : null
      )
        .then(data => {
          this.tableData = data.list
          this.pagesTotalCount = data.totalCount
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style>
</style>
