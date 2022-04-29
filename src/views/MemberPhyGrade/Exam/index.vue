<template>
  <el-card>
    <template slot="header">
      <h3>{{ $t('default.app.phyGrade.exam.title') }}</h3>
      <el-button circle type="success" icon="el-icon-refresh" style="float:right" @click="refresh" />
    </template>
    <el-card style="margin-bottom:1rem">
      <el-form inline label-width="5rem">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="负责单位">
          <CompanySelector v-model="form.holdBy" />
        </el-form-item>
        <el-form-item label="创建人">
          <UserSelector v-model="form.createBy" />
        </el-form-item>
        <el-form-item label="负责人">
          <UserSelector v-model="form.handleBy" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="form.create"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
            clearable
          />
        </el-form-item>
        <el-form-item label="考核日期">
          <el-date-picker
            v-model="form.executeTime"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
            clearable
          />
        </el-form-item>
      </el-form>
    </el-card>
    <el-table :data="list">
      <el-table-column label="id" width="250rem">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.description">
            <span>{{ scope.row.name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="负责单位" width="200rem">
        <template slot-scope="scope">
          <CompanyFormItem v-model="scope.row.holdBy" />
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="150rem">
        <template slot-scope="scope">
          <UserFormItem :userid="scope.row.createBy" />
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="150rem">
        <template slot-scope="scope">
          <UserFormItem :userid="scope.row.handleBy" />
        </template>
      </el-table-column>
      <el-table-column label="创建/考核日期" width="300rem">
        <template slot-scope="scope">
          <div>
            <el-tooltip :content="`创建于:${scope.row.create}`">
              <span>{{ parseTime(scope.row.create)||'无' }}</span>
            </el-tooltip>
          </div>
          <div>
            <el-tooltip :content="`考核时间:${scope.row.create}`">
              <span>{{ parseTime(scope.row.executeTime)||'无' }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280rem">
        <template slot-scope="scope">
          <el-link type="success">查看成绩</el-link>
          <el-button type="success" @click="editExam(scope)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="success" style="width:100%" @click="editExam()">新 增 考 核</el-button>
    <ExamEdit ref="examEdit" v-model="list[focus]" />
    <Pagination :pagesetting="pages" :total-count="totalCount" />
  </el-card>
</template>

<script>
import Pagination from '@/components/Pagination'
import CompanySelector from '@/components/Company/CompanySelector'
import CompanyFormItem from '@/components/Company/CompanyFormItem'
import UserSelector from '@/components/User/UserSelector'
import UserFormItem from '@/components/User/UserFormItem'
import ExamEdit from './ExamEdit'
import { createNewExam, postExam, getExam } from '@/api/grade/grade'
import { parseTime } from '@/utils'
export default {
  name: 'Exam',
  components: {
    Pagination,
    CompanySelector,
    CompanyFormItem,
    UserFormItem,
    UserSelector,
    ExamEdit
  },
  data: () => ({
    focus: 0,
    list: [],
    form: createNewExam(),
    pages: {
      pageIndex: 0,
      pageSize: 5
    },
    totalCount: 0
  }),
  mounted() {
    this.refresh()
  },
  methods: {
    parseTime,
    postExam,
    createNewExam() {
      const i = createNewExam()
      i.holdBy = 'A'
      return i
    },
    refresh() {
      const pages = this.pages
      getExam({ ...this.form, pages }).then(data => {
        this.list = data.list
        this.totalCount = data.totalCount
      })
    },
    editExam(scope) {
      if (!scope) {
        const row = createNewExam()
        this.list.push(row)
        scope = {
          $index: this.list.length - 1,
          row
        }
      }
      this.focus = scope.$index
      this.$refs.examEdit.show = true
    }
  }
}
</script>

<style>
</style>
