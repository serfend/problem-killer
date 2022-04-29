<template>
  <el-card v-if="iSubject" v-loading="loading">
    <template slot="header">
      <h3>{{ iSubject.alias }}</h3>
      <el-button circle type="success" icon="el-icon-refresh" style="float:right" @click="refresh" />
    </template>
    <el-table :data="iSubject.standards">
      <el-table-column label="性别" width="150rem">
        <template slot-scope="scope">
          <GenderBtn v-model="scope.row.gender" :disabled="false" />
        </template>
      </el-table-column>
      <el-table-column label="年龄范围">
        <template slot-scope="scope">
          <el-slider
            v-model="scope.row.ageRange"
            range
            show-stops
            :min="getAgeRange(scope.row.minAge,0)"
            :max="getAgeRange(scope.row.minAge,1)"
            @change="handleAgeChange(scope)"
          />
        </template>
      </el-table-column>
      <el-table-column label="合格分数" width="100rem">
        <template slot-scope="scope">
          <el-input v-model="scope.row.baseStandard" />
        </template>
      </el-table-column>
      <el-table-column label="满分后计算公式" width="200rem">
        <template slot-scope="scope">
          <el-input v-model="scope.row.expressionWhenFullGrade" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200rem">
        <template slot-scope="scope">
          <el-popover v-model="scope.row.scorePairOpen" trigger="click">
            <ScorePair
              v-if="scope.row.scorePairOpen"
              :score-pair.sync="scope.row.gradePairs"
              :expression-when-full-grade.sync="scope.row.expressionWhenFullGrade"
              :show-input="false"
              :show-editor="true"
            />
            <el-link slot="reference" type="success">查看评判</el-link>
          </el-popover>
          <el-button type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="success" style="width:100%" @click="$emit('requireSave',iSubject)">保存</el-button>
  </el-card>
</template>

<script>
import ScorePair from '../components/ScorePair'
import GenderBtn from '@/components/User/GenderBtn'
export default {
  name: 'Standard',
  components: { GenderBtn, ScorePair },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    subject: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    form: {},
    iSubject: null
  }),
  watch: {
    subject(value) {
      if (!value) return
      this.iSubject = value
      this.iSubject.standards = value.standards
        .sort((a, b) => a.minAge - b.minAge)
        .map(i => {
          i.ageRange = [i.minAge, i.maxAge]
          return { ...i }
        })
    }
  },
  methods: {
    refresh() {
      this.$emit('requireRefresh', this.iSubject)
    },
    remove(item) {
      const index = this.iSubject.standards.findIndex(i => i.id === item.id)
      this.iSubject.standards.splice(index, 1)
    },
    getAgeRange(val, minOrMax) {
      val = Math.round(val / 10) * 10
      switch (minOrMax) {
        case 0:
          return 0
        case 1:
          return 60
      }
    },
    handleAgeChange({ row, $index }) {
      const item = row
      item.minAge = item.ageRange[0]
      item.maxAge = item.ageRange[1]
      this.$set(this.iSubject.standards, $index, item)
      this.$emit('update:subject', this.iSubject)
    }
  }
}
</script>

<style>
</style>
