<template>
  <el-card v-loading="loading">
    <template slot="header">
      <h3>{{ $t('default.app.phyGrade.rules.subject.title') }}</h3>
      <el-button circle type="success" icon="el-icon-refresh" style="float:right" @click="refresh" />
    </template>
    <AuthCode v-model="form.auth" />
    <el-table :data="form.subjects">
      <el-table-column label="id">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" />
        </template>
      </el-table-column>
      <el-table-column label="分组">
        <template slot-scope="scope">
          <el-input v-model="scope.row.group" />
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.alias" />
        </template>
      </el-table-column>
      <el-table-column label="是否倒序" width="80rem">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.countDown" />
        </template>
      </el-table-column>
      <el-table-column label="数值计算方式">
        <template slot-scope="scope">
          <el-select v-model="scope.row.valueFormat">
            <el-option
              v-for="item in valueFormatOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300rem">
        <template slot-scope="scope">
          <el-link type="success" @click="checkStandard(scope.row)">查看标准</el-link>
          <el-button type="success" @click="requireSave(scope.row)">保存</el-button>
          <el-button type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import AuthCode from '@/components/AuthCode'
import { getSubjects, setSubject, getSubjectByName } from '@/api/grade/phyGrade'
export default {
  name: 'Subject',
  components: { AuthCode },
  data: () => ({
    loading: false,
    valueFormatOption: [
      { label: '按个数', value: 0 },
      { label: '按时分秒', value: 1 },
      { label: '按秒表', value: 2 }
    ],
    form: { auth: { authByUserId: null, code: null }, subjects: [] }
  }),
  watch: {
    loading(val) {
      this.$emit('update:loading', val)
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    requireRefresh(subject) {
      this.loading = true
      getSubjectByName(subject.name)
        .then(data => {
          const s = data.model
          const index = this.form.subjects.findIndex(i => i.name === s.name)
          this.form.subjects[index] = s
          this.checkStandard(this.form.subjects[index])
        })
        .finally(() => {
          this.loading = false
        })
    },
    requireSave(subject) {
      this.loading = true
      if (subject) {
        setSubject(subject, this.form.auth)
          .then(data => {
            this.$message.success('已保存')
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    checkStandard(row) {
      this.$emit('update:subject', row)
    },
    refresh() {
      this.loading = true
      getSubjects()
        .then(list => {
          this.form.subjects = list
        })
        .finally(() => {
          this.loading = false
        })
    },
    remove(item) {
      const index = this.form.subjects.findIndex(i => i.id === item.id)
      this.form.subjects.splice(index, 1)
    }
  }
}
</script>
<style>
</style>
