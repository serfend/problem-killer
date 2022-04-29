<template>
  <el-form v-if="innerRegisterForm" v-loading="loading" label-position="right" label-width="5rem">
    <el-tabs v-model="nowStep" accordion class="tab-container">
      <el-tab-pane v-for="opt in stepOptions.filter((i) => !i.removed && !ignorePanelsDict[i.component])" :key="opt.index" :label="opt.name">
        <div :key="opt.index" class="panel-content" :style="{height:isRegister?'25rem':''}">
          <component :is="opt.component" :form.sync="innerRegisterForm[opt.component]" :is-register="isRegister" :child-index="opt.childIndex" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<script>
import { stepOptions, createForm, Const_DisabledVacation } from './config'
import { getUserAllInfo } from '@/api/user/usercompany'
import { checkUserValid } from '@/utils/validate'
export default {
  name: 'RegFormItems',
  components: {
    SvgIcon: () => import('@/components/SvgIcon'),
    Base: () => import('../components/Base'),
    Application: () => import('../components/Application'),
    Social: () => import('../components/Social'),
    Company: () => import('../components/Company'),
    Diy: () => import('../components/Diy'),
    Auth: () => import('@/components/AuthCode')
  },
  model: {
    event: 'change',
    prop: 'registerForm'
  },
  props: {
    loading: { type: Boolean, default: false },
    user: { type: String, default: null },
    registerForm: { type: Object, default: null },
    isRegister: { type: Boolean, default: false },
    ignorePanels: { type: Array, default: null }
  },
  data: () => ({
    nowStep: '0',
    stepOptions,
    innerRegisterForm: null
  }),
  computed: {
    ignorePanelsDict () {
      const dict = {}
      if (!this.ignorePanels) return dict
      this.ignorePanels.map(i => {
        dict[i] = true
      })
      return dict
    }
  },
  watch: {
    user: {
      handler (val) {
        this.handleUserChange()
      },
      immediate: true
    },
    registerForm: {
      handler (val) {
        if (!val) {
          val = createForm()
          this.$emit('change', val)
          return
        }
        this.innerRegisterForm = val
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    next_step (step) {
      let now_index = parseInt(this.nowStep)
      const target = this.stepOptions[now_index]
      if (
        target.childIndex + step < target.childNum &&
        target.childIndex + step >= 0
      ) {
        target.childIndex += step
        return
      }
      if (now_index + step < this.stepOptions.length && now_index + step >= 0) {
        now_index += step
        this.nowStep = now_index.toString()
      }
    },
    handleUserChange () {
      const val = this.user
      if (!val) return
      this.$emit('update:loading', true)
      this.$emit('update:selectIsInvalidAccount', 0)
      this.innerRegisterForm = null
      getUserAllInfo(val)
        .then(data => {
          const f = {}
          f.Social = data.social
          f.Diy = data.diy
          f.Base = data.base.base
          f.Application = data.application
          const duties = data.duties || {}
          const { company, companyOfManage } = data.company
          const { invitedBy, accountStatus } = data.application
          const c = {
            company,
            companyOfManage,
            duties: {
              name: duties.name
            },
            title: {
              name: duties.title
            },
            titleDate: duties.titleDate,
            disabledVacation:
              (accountStatus & Const_DisabledVacation) > 0 ? 1 : -1
          }
          const cmps = ['companyCodeOfApplyVacation', 'companyCodeOfApplyInday']
          cmps.map(i => {
            const c_item = data.company[i] || {}
            c[`${i}Enable`] = c_item.enable
            c[i] = c_item.company
          })
          f.Company = c
          this.$emit('update:selectIsInvalidAccount', checkUserValid(invitedBy))
          this.nowSelectCompany = company
          this.$emit('change', f)
        })
        .finally(() => {
          this.$emit('update:loading', false)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/animation';
.panel-content {
  overflow: scroll;
}
</style>
