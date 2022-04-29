<template>
  <el-row>
    <el-col :xl="6" :lg="8" :md="12" :sm="18" :xs="24">
      <el-card>
        <template slot="header">成绩登记卡</template>
        <div v-loading="loading" style="margin-top:4rem">
          <el-row>
            <el-col :span="8">
              <UserSummary
                :showout="true"
                :data="userInfo"
                :avatar="form.user.avatar"
                min-height="3.5rem"
              />
            </el-col>
            <el-col :span="16">
              <div style="text-align: center;position:absolute;top:-3.5rem">
                <el-tag style="display:block;">{{ userRank[0] }}</el-tag>
                <CountTo
                  :end-val="totalGrade"
                  :style="{'font-size':'5rem',color:currentGrade.color}"
                />
              </div>
            </el-col>
          </el-row>
          <el-card :style="{'background-color':genderData.background,transition:'all 0.5s ease'}">
            <i :class="genderData.icon" style="color:#fff" />
            <span style="color:#fff;font-size:1rem;margin-right:0.5rem">{{ age }}周岁</span>
            <span
              v-show="form.user.time_birthDay"
              style="color:#fff;font-size:0.8rem"
            >距离生日{{ toNextBirth }}天</span>
          </el-card>
          <div v-for="(s,i) in form.subjects" :key="i" style="margin-top:1rem">
            <el-tag class="title-item" :type="s.status">{{ s.description }}({{ s.grade }})</el-tag>

            <el-popover trigger="hover">
              <Subject
                v-model="form.subjects[i]"
                :age="age"
                :raw-value.sync="form.subjects[i].rawValue"
                @gradechange="onCaculateGrade"
              />
              <span slot="reference">
                <span class="subject-link">{{ s.alias }} 成绩:{{ s.rawValue }}</span>
              </span>
            </el-popover>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :xl="6" :lg="8" :md="12" :sm="18" :xs="24">
      <el-card header="用户信息">
        <el-form label-width="5rem">
          <el-form-item label="选取用户">
            <UserSelector
              :code.sync="form.user.userName"
              :avatar.sync="form.user.avatar"
              :default-info="form.user.realName?form.user.realName:'未登录,请选择'"
              style="display:inline"
              @change="selectChanged"
            />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="form.user.realName" style="width:7rem" />
          </el-form-item>
          <el-form-item label="性别">
            <GenderBtn v-model="form.user.gender" :data.sync="genderData" :disabled="false" />
          </el-form-item>
          <el-form-item label="出生日期">
            <el-date-picker v-model="form.user.time_birthDay" type="date" style="width:10rem" />
          </el-form-item>
          <el-form-item label="人员类别">
            <el-select v-model="form.user.type">
              <el-option
                v-for="(item,i) in memberTypes"
                :key="i"
                :label="item[1]"
                :value="item[0]"
              />
            </el-select>
            <el-tooltip effect="light">
              <Standard slot="content" />
              <i class="el-icon-question" />
            </el-tooltip>
          </el-form-item>
          <el-form-item v-for="(s,i) in form.subjects" :key="i" :label="s.alias">
            <span>{{ s.rawValue }}</span>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import UserSelector from '@/components/User/UserSelector'
import GenderBtn from '@/components/User/GenderBtn'
import Subject from './Subject'
import Standard from './Standard'
import UserSummary from '@/layout/components/UserSummary'
import { datedifference } from '@/utils'
import CountTo from 'vue-count-to'
import {
  getSubjects,
  buildGradeQuery,
  getResult,
  buildGradeSubject
} from '@/api/grade/phyGrade'
import { debounce } from '@/utils'
import { singleRankingOpt, rankingOpt } from './rankingOpt'
export default {
  name: 'PhyGradeCard',
  components: {
    UserSelector,
    GenderBtn,
    Subject,
    Standard,
    UserSummary,
    CountTo
  },
  data: () => ({
    loading: false,
    nowSubject: null,
    genderData: { background: '#aaa' },
    onUserChanging: false,
    form: {
      user: {
        userName: null,
        realName: null,
        gender: 0,
        time_birthDay: null,
        avatar: null,
        type: 2,
        weight: 0,
        height: 0
      },
      subjects: []
    },
    submitU: null
  }),
  computed: {
    currentGrade() {
      const rank = this.userRank[0]
      const r = singleRankingOpt.find(i => i.description === rank)
      return r
    },
    memberTypes() {
      return rankingOpt.map(i => [i.value, i.type])
    },
    totalGrade() {
      const s = this.form.subjects
      if (!s) return 0
      return s.reduce((p, c) => p + parseInt(c.grade), 0)
    },
    userRank() {
      const type = this.userType
      const s = type.standards
      const g = this.totalGrade
      for (let i = s.length - 1; i >= 0; i--) {
        if (s[i][1] <= g && !s[i][2]) return s[i]
      }
      return null
    },
    userType() {
      const user = this.form.user
      const type = rankingOpt.filter(i => i.value === user.type)[0]
      return type
    },
    userInfo() {
      const user = this.form.user
      const type = this.userType
      return {
        realName: user.realName,
        dutiesName: type.type
      }
    },
    onCaculateGrade() {
      return debounce(() => {
        this.caculateGrade()
      }, 500)
    },
    onFormChange() {
      return debounce(() => {
        this.updateSubjects()
      }, 500)
    },
    currentUser() {
      return this.$store.state.user.data
    },
    currentUserAvatar() {
      return this.$store.state.user.avatar
    },
    age() {
      return datedifference(new Date(), this.form.user.time_birthDay, 'year')
    },
    toNextBirth() {
      return datedifference(this.nextBirthDay, new Date(), 'day') + 1
    },
    nextBirthDay() {
      const birth = new Date(this.form.user.time_birthDay)
      const m = birth.getMonth()
      const d = birth.getDate()
      const ny = new Date().getFullYear()
      const nextBirth = new Date(ny, m, d)
      if (nextBirth < new Date()) return new Date(ny + 1, m, d)
      return nextBirth
    }
  },
  watch: {
    currentUser: {
      handler(val) {
        if (!val) return
        this.$nextTick(() => {
          this.selectChanged(val)
        })
      },
      immediate: true
    },
    currentUserAvatar: {
      handler(val) {
        if (!val) return
        this.$nextTick(() => {
          this.form.user.avatar = val
        })
      },
      immediate: true
    },
    'form.user.userName': {
      handler(val) {
        this.onUserChanging = true
      }
    },
    'form.user': {
      handler(val) {
        this.beforeUpdate()
        this.onFormChange()
      },
      deep: true
    }
  },
  methods: {
    modify() {
      this.val += Math.random() * 100
    },
    datedifference,
    caculateGrade() {
      console.log('caculate grade')
      const grades = this.form.subjects.map(i =>
        buildGradeSubject(i.name, i.rawValue)
      )
      this.refreshSubmitUser()
      const u = this.submitU
      const query = buildGradeQuery(grades, u, true)
      this.loading = true
      getResult(query)
        .then(data => {
          const s = data.subjects
          const sub = this.form.subjects
          for (let i = 0; i < s.length; i++) {
            for (let j = 0; j < sub.length; j++) {
              if (s[i].subject === sub[j].name) {
                const { grade } = s[i]
                sub[j].grade = grade
                for (let r = 0; r < singleRankingOpt.length; r++) {
                  if (singleRankingOpt[r].grade > grade) break
                  sub[j].description = singleRankingOpt[r].description
                  sub[j].status = singleRankingOpt[r].status
                }
                break
              }
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    refreshSubmitUser() {
      const user = this.form.user
      const { gender, time_birthDay } = user
      // on username changed only effect one time per select
      this.submitU = this.onUserChanging
        ? user.userName
        : { gender, time_birthDay }
    },
    selectChanged(val) {
      const u = this.form.user
      u.realName = val.realName
      u.gender = val.gender
      u.time_birthDay = val.timeBirth
    },
    beforeUpdate() {
      this.loading = true
      this.refreshSubmitUser()
      this.nowSubject = null
    },
    updateSubjects() {
      this.onUserChanging = false
      getSubjects(null, null, this.submitU)
        .then(data => {
          this.form.subjects = data.map(i => {
            i.description = singleRankingOpt[1].description
            i.status = singleRankingOpt[1].status
            i.grade = 0
            return i
          })
        })
        .finally(() => {
          this.loading = false
          if (this.form.subjects === null) {
            this.nowSubject = null
          } else {
            const arr = []
            for (let i = 0; i < this.form.subjects.length; i++) {
              arr.push(i)
            }
            this.nowSubject = arr
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/element-variables';
.title-item {
  margin-right: 0.2rem;
}
.subject-link {
  cursor: pointer;
  &:hover {
    color: $--color-primary;
  }
}
</style>
