<template>
  <transition>
    <div v-show="!iDisabled" id="submit-form" v-loading="onLoading">
      <div :style="{'background-color':theme,'z-index':3}" :class="navClass">
        <slot />
        <span v-if="next_permit_submit<=new Date()">
          <el-button :disabled="iDisabled" type="success" style="width:100%" @click="submitApply(2)">发 布</el-button>
          <div style="margin:0.5rem 0">
            <el-popover placement="top-start" trigger="hover">
              <div>
                <h2>提交、保存、发布是什么</h2>
                <el-divider />
                <p>
                  <b>提交</b>任何人都可以操作，但24小时后仍未保存则会被删除
                </p>
                <p>
                  <b>保存</b>仅本人及上级操作，将会使申请进入草稿状态，随时可发布
                </p>
                <p>
                  <b>发布</b>仅本人及上级操作，将会使申请进入审核中状态
                </p>
                <div>
                  <el-button :disabled="iDisabled" type="success" @click="submitApply(0)">提交</el-button>
                  <el-button :disabled="iDisabled" type="success" @click="submitApply(1)">保存</el-button>
                </div>
              </div>
              <i slot="reference" class="el-icon-more-outline" style="color:#fff" />
            </el-popover>
            <el-button type="info" size="mini" @click="createNew">新建申请</el-button>
            <el-button v-show="submitId" size="mini" type="success" @click="skimDetail">查 看 详 情</el-button>
          </div>
        </span>
        <el-progress v-else :percentage="percent" status="exception" :text-inside="true" :stroke-width="25" :format="formatPercent" />

        <el-dialog :visible.sync="showSuccessDialog" append-to-body>
          <div v-if="!errorMsg">
            <div style="display:flex;justify-content:center">
              <LottieIcon path="/assets/lottie/lottie.success.json" :animate-speed="0.5" style="width:15rem" />
            </div>
            <div class="item-put-center" style="margin:3rem 0 2rem 0;font-size:2rem">申 请 提 交 成 功</div>
          </div>
          <div v-else>
            <div style="display:flex;justify-content:center">
              <LottieIcon path="/assets/lottie/lottie.fail.json" :animate-speed="0.5" style="width:15rem" />
            </div>
            <el-alert v-if="errorMsg" type="error" center effect="dark" show-icon closable>{{ errorMsg }}</el-alert>
          </div>
          <div class="item-put-center">
            <el-popover v-for="(i,index) in errorList" :key="i.id" trigger="hover" placement="top" @show="i.can_show=true">
              <component
                :is="`${entityType}ApplyDetail`"
                :can-show="i.can_show"
                :show-user="false"
                :show-comment="false"
                :focus-id="i.id"
                style="width:80rem"
              />
              <template #reference>
                <el-button style="cursor:pointer;margin-left:0.3rem" type="text" @click="show_detail(i)">第{{ index+1 }}项</el-button>
              </template>
            </el-popover>
          </div>
          <div class="item-put-center">
            <el-button type="success" style="width:60%" @click="skimDetail">查看本次提交的详情</el-button>
          </div>
          <div class="item-put-center">
            <el-button type="info" style="width:60%" @click="showSuccessDialog=false">关 闭</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </transition>
</template>

<script>
import { getTimeDesc } from '@/utils'
import { doAction } from '@/api/audit/handle'
import { submitApply } from '@/api/apply/create'
export default {
  name: 'SubmitApply',
  components: {
    // SvgIcon: () => import('@/components/SvgIcon'),
    LottieIcon: () => import('@/components/LottieIcon'),
    indayApplyDetail: () =>
      import('@/views/Apply/ApplyDetail/IndayApplyDetail'),
    vacationApplyDetail: () =>
      import('@/views/Apply/ApplyDetail/VacationApplyDetail')
  },
  props: {
    baseInfoId: { type: String, default: null },
    requestId: { type: String, default: null },
    mainType: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
    entityType: { type: String, default: 'vacation' }
  },
  data: () => ({
    onLoading: false,
    submitId: '',
    showSuccessDialog: false,
    errorMsg: null,
    errorList: [],
    next_permit_submit: 0,
    next_permit_begin: 0,
    percent: 0,
    time_desc: 0,
    time_updator: null,
    isFlashing: true,
    caculateParent: ''
  }),
  computed: {
    navClass () {
      const i = this.isFlashing ? ' flashing' : ''
      return `footer-nav${i}`
    },
    iDisabled () {
      return this.disabled || !this.baseInfoId || !this.requestId
    },
    theme () {
      return this.$store.state.settings.theme
    },
    applyDetailUrl () {
      return `#/apply/${this.entityType}/applydetail?id=${this.submitId}`
    }
  },
  watch: {
    disabled: {
      handler (val) {
      },
      immediate: true
    },
    submitId: {
      handler (val) {
        if (val) this.showSuccessDialog = true
      }
    }
  },
  mounted () {
    clearInterval(this.time_updator)
    this.time_updator = setInterval(() => {
      if (!this.next_permit_submit) return
      const t = this.next_permit_submit - new Date()
      this.time_desc = `${getTimeDesc(t / 1e3)}后可再次提交`

      const total = this.next_permit_submit - this.next_permit_begin
      const spent = new Date() - this.next_permit_begin
      this.percent = 100 - Math.floor((spent / total) * 1e4) / 1e2
    }, 5e2)
  },
  destroyed () {
    clearInterval(this.time_updator)
  },
  methods: {
    getTimeDesc,
    formatPercent (v) {
      return this.time_desc
    },
    skimDetail () {
      const url = this.applyDetailUrl
      window.open(url)
    },
    show_detail (id) { },
    /**
     * 提交申请 0:仅提交，1:提交并保存，2:提交并发布
     */
    submitApply (actionStatus) {
      if (this.onLoading === true) {
        return this.$message.info('提交中，请等待')
      }
      this.errorMsg = null
      const BaseId = this.baseInfoId
      const RequestId = this.requestId
      const main_type = this.mainType
      this.onLoading = true
      const doActionCb = data => {
        if (!data || !data.list) {
          const msg = actionStatus === 1 ? '提交并保存' : '提交并发布'
          this.$message.success(`${msg}成功`)
          this.errorList = []
          this.$emit('complete', true)
          return
        }
        this.errorList = data.list.map(i => ({
          id: i,
          can_show: true
        }))
        this.$emit('complete', false)
        const count = this.errorList.length
        this.errorMsg = `存在${count}条与本次提交的离队时间或归队时间冲突的申请`
      }
      const cb = data => {
        var applyId = data.id
        var fn = actionStatus === 1 ? 'save' : 'publish'
        this.$message.success('提交成功')
        this.$emit('submit')
        this.submitId = data.id
        if (actionStatus > 0) {
          doAction(fn, applyId, this.entityType)
            .then(doActionCb)
            .catch(e => {
              this.$emit('complete', false)
              this.errorMsg = e.message
            })
        }
      }
      submitApply({
        RequestId,
        BaseId,
        isPlan: main_type === 2,
        entityType: this.entityType,
        Verify: {
          Code: 201700816
        }
      })
        .then(data => {
          this.next_permit_submit = 0
          cb(data)
        })
        .catch(e => {
          switch (e.status) {
            case 43310: {
              this.next_permit_submit =
                new Date() - 0 + Number(e.message.replace(/[^0-9]/gi, '')) * 1e3
              this.next_permit_begin = new Date()
              break
            }
          }
        })
        .finally(() => {
          this.onLoading = false
        })
    },
    /**
     * 创建新的申请
     */
    createNew () {
      this.$confirm('此操作将清空并重新填写, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('reset')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-nav {
  z-index: 1;
  opacity: 0.12;
  box-shadow: 0 -2px 10px -4px;
  padding: 8px;
  transition: all 0.5s ease;
  &:hover {
    opacity: 1;
  }
}
@import '@/styles/animation';

.item-put-center {
  margin-top: 1rem;
  justify-content: center;
  text-align: center;
}
</style>
