<template>
  <div :style="{transition:'all 0.5s'}" @mouseenter="isHover=true" @mouseleave="leaveCard">
    <el-card v-loading="loading" header="基本信息" style="position:relative">
      <el-container>
        <el-main :style="{filter:hideDetail?'blur(0.2rem)':''}">
          <CardTooltipAlert :accept="submitId" :accepting="anyChanged">
            <template slot="content">若有误（含信息有变化），请到审核注册页面修改信息</template>
          </CardTooltipAlert>
          <el-form ref="form" :model="form" label-width="8rem">
            <el-form-item label="申请人">
              <UserSelector
                ref="user-selector"
                :code.sync="form.id"
                :default-info="form&&form.realName?form.realName:'未登录,请选择'"
                select-name="发布申请.基本信息"
                style="display:inline"
              />
              <span v-if="currentUser&&form.id!=currentUser.id">
                <el-link @click="setCurrentUser">使用当前登录</el-link>
                <el-tooltip content="当替小伙伴提交申请时可能只能保存，不能发布哦~">
                  <i class="el-icon-question blue--text" />
                </el-tooltip>
              </span>
            </el-form-item>
            <el-form-item label="部职别">
              <ApplyCompany :data="form.company" />
            </el-form-item>
            <el-form-item
              label="联系方式"
              prop="Phone"
              inline-message
              :rules="[{required:true,validator:phoneRoleCheck,trigger:'blur'}]"
            >
              <el-input v-model="form.Phone" />
            </el-form-item>

            <SettleFormItem :form.sync="form.Settle.self" disabled label="本人所在地" />
            <SettleFormItem :form.sync="form.Settle.lover" disabled label="配偶所在地" />
            <SettleFormItem :form.sync="form.Settle.parent" disabled label="父母所在地" />
            <SettleFormItem :form.sync="form.Settle.loversParent" disabled label="配偶父母所在地" />
          </el-form>
        </el-main>
        <el-aside
          width="20%"
          style="padding:0;text-align:center;margin:0;background: rgb(255, 255, 255)"
        >
          <div
            class="mask"
            :style="{filter:hideDetail?'':'blur(1rem)',background:hideDetail?'#ffffff8f':''}"
          >
            <svg-icon
              :style="{transition:'all 0.5s',opacity:hideDetail?1:0,transform:hideDetail?'rotate(-360deg)':''}"
              icon-class="certification_f"
              style-normal="width:5rem;height:5rem;fill:#67C23A;color:#67C23A"
            />
          </div>
        </el-aside>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import UserSelector from '@/components/User/UserSelector'

import SettleFormItem from '@/components/SettleFormItem'
import CardTooltipAlert from './FormHelper/CardTooltipAlert'
import { postBaseInfo } from '@/api/apply/create'
import { getUserAllInfo } from '@/api/user/usercompany'
import { validPhone } from '@/utils/validate'
export default {
  name: 'BaseInfo',
  components: {
    UserSelector,
    CardTooltipAlert,
    SettleFormItem,
    ApplyCompany: () => import('@/views/Apply/CommonComponents/ApplyCompany')
  },
  props: {
    defailtId: { type: String, default: null },
    userid: { type: String, default: null }
  },
  data() {
    return {
      loading: false,
      onSvgSelected: false,
      form: this.createNewBase(),
      detailMask: false,
      submitId: null,
      isHover: false,
      anyChanged: false
    }
  },
  computed: {
    hideDetail() {
      return this.submitId && !this.isHover
    },
    currentUser() {
      return this.$store.state.user.data
    },
    userSelectId() {
      return this.userid || (this.currentUser && this.currentUser.id)
    }
  },
  watch: {
    userSelectId: {
      handler(val) {
        this.form.id = val
      },
      immediate: true
    },
    form: {
      handler(val) {
        if (val && !this.loading) {
          this.anyChanged = true
          this.submitId = null
        }
      },
      deep: true
    },
    'form.id': {
      handler(val) {
        if (val) {
          this.fetchUserInfoesDerect()
        }
      },
      immediate: true
    }
  },
  methods: {
    phoneRoleCheck(filed, invalidVal, cb) {
      var val = this.form[filed.field]
      var result = validPhone(val)
      if (result) cb(new Error(result))
      cb()
    },
    reset() {
      console.log('baseinfo init')
      this.form = this.createNewBase()
      this.loading = false
      this.anyChanged = false
    },
    leaveCard() {
      this.isHover = false
      if (this.anyChanged) {
        this.anyChanged = false
        this.submitBaseInfo()
      }
    },
    createNewBase() {
      const f = {
        id: null,
        realName: null,
        company: null,
        duties: null,
        Phone: '0',
        Settle: {
          self: this.buildSettle(),
          lover: this.buildSettle(),
          parent: this.buildSettle(),
          loversParent: this.buildSettle()
        }
      }
      return f
    },
    setCurrentUser() {
      this.form.id = this.currentUser && this.currentUser.id
    },
    fetchUserInfoesDerect() {
      this.loading = true
      const id = this.form.id
      return getUserAllInfo(id)
        .then(data => {
          const { base, company, duties, social } = data
          const form = this.form
          form.id = id
          form.realName = base.base.realName
          form.company = {
            companyOfIndayName: company.companyCodeOfApplyInday.company,
            companyOfVacationName: company.companyCodeOfApplyVacation.company,
            companyOfManageName: company.companyOfManage.company,
            companyName: company.company.name,
            dutiesName: company.duties
          }
          form.duties = duties.name
          form.Phone = social.phone
          const { self, lover, parent, loversParent } = social.settle
          if (!form.Settle) form.Settle = {}
          form.Settle.self = self
          this.$emit('update:selfSettle', social.settle)
          form.Settle.lover = lover
          form.Settle.parent = parent
          form.Settle.loversParent = loversParent
          this.loading = false
          this.submitBaseInfo()
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 提交基础信息
    submitBaseInfo() {
      console.log('baseinfo submit?' + !this.loading)
      if (this.loading) return console.warn('baseinfo is loading')
      const { id, Phone } = this.form
      if (!id || !Phone) {
        return console.warn('id or Phone is not ready', id, Phone)
      }
      if (validPhone(Phone)) return
      this.loading = true
      const payload = {
        id,
        Phone
      }
      postBaseInfo(payload)
        .then(data => {
          if (data.id) {
            this.submitId = data.id
            this.$emit('update:submitId', data.id)
            console.log('emit update', this.form.id)
            this.$emit('update:userid', this.form.id)
            setTimeout(() => {
              this.$emit('submited', true)
            }, 200)
            this.$message.success('个人信息验证通过')
          }
        })
        .catch(() => {
          setTimeout(() => {
            this.$emit('submited', false)
          }, 200)
        })
        .finally(() => {
          this.loading = false
        })
    },
    buildSettle() {
      return {
        date: null,
        valid: null,
        address: {
          parentId: null,
          rank: null,
          name: null,
          shortname: null
        },
        addressDetail: null
      }
    }
  }
}
</script>
