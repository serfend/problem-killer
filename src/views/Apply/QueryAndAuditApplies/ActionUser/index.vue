<template>
  <span>
    <el-dialog :visible.sync="authFormShow" title="敏感操作授权">
      <el-form ref="authForm" :model="authForm">
        <AuthCode :form.sync="authForm.auth" select-name="用户操作" />
        <el-form-item>
          <el-button-group style="width:100%">
            <el-button type="info" style="width:50%" @click=" authFormShow = false ">取消</el-button>
            <el-button
              type="success"
              style="width:50%"
              @click="hendleExecute(authForm.method,row)"
            >确认</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dropdown
      v-if="statusDic&&statusDic[row.status]&&statusDic[row.status].acessable.length>0"
      v-loading="loading"
      trigger="click"
      size="mini"
      :style="{width:btnType?'100%':null}"
      @command="c=>handle_action(c,row)"
    >
      <el-button :type="btnType||'text'" :plain="!!btnType" :style="{width:btnType?'100%':null}">操作</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in statusDic[row.status].acessable"
            :key="item.desc"
            :command="item"
          >
            <el-link
              v-if="actionDic[item]"
              :type="actionDic[item].type"
              style="width:100%"
            >{{ actionDic[item].alias }}</el-link>
            <span v-else>未知操作选项:{{ item }}</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button v-loading="loading" type="text" @click="exportApply(row)">下载</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </span>
</template>

<script>
import { MessageBox } from 'element-ui'
import { exportApplyDetail } from '@/api/common/static'
import { doAction } from '@/api/audit/handle'
import { deleteApply } from '@/api/apply/handle'
export default {
  name: 'ActionUser',
  components: {
    AuthCode: () => import('@/components/AuthCode')
  },
  props: {
    row: { type: Object, default: () => ({}) },
    entityType: { type: String, default: 'vacation' },
    btnType: { type: String, default: null }
  },
  data() {
    return {
      loading: false,
      activeName: '',
      authForm: {},
      authFormShow: false
    }
  },
  computed: {
    sensitiveAction() {
      return '敏感操作'
    },
    statusDic() {
      return this.$store.state.vacation.statusDic
    },
    actionDic() {
      return this.$store.state.vacation.actionDic
    }
  },
  methods: {
    exportApplyDetail,
    handle_action(item, row) {
      const action = this.actionDic[item]
      if (!action) return
      const message = `${action.description} 确定要${action.alias}吗？`
      this.$confirm(message, {
        title: `确认${action.alias}`,
        type: 'warning'
      }).then(() => {
        this.hendleExecute(item, row)
      })
    },
    hendleExecute(method, row) {
      if (this.loading) return
      let params = row.id
      const fnName = method
      if (fnName === 'Delete') {
        if (!this.authFormShow) {
          this.authForm.method = method
          this.authFormShow = true
          return
        }
        this.authFormShow = false
        params = {
          id: row.id,
          auth: this.authForm.auth
        }
      }
      this.loading = true
      const fn =
        fnName === 'Delete'
          ? deleteApply(params, this.entityType)
          : doAction(fnName, params, this.entityType)
      fn.then(data => {
        if (data && data.list && data.list[0]) {
          const opt = {
            message: `<h3>操作失败</h3><div style="margin-top:0.5em">存在${
              data.list.length
            }项冲突，<a style="color:#00f" href="/#/apply/${
              this.entityType
            }/applyDetail?id=${data.list[0]}">点击查看</a>首项</div>`,
            dangerouslyUseHTMLString: true,
            type: 'info',
            duration: 10000
          }
          this.$message(opt)
        } else {
          this.$message.success(`${this.actionDic[method].alias}成功`)
        }
      }).finally(() => {
        this.loading = false
        this.$emit('updated')
      })
    },
    exportApply(row) {
      if (this.entityType !== 'vacation') {
        this.$message.warning('未配置申请单模板')
        return
      }
      const decider = {
        confirm: 0,
        cancel: 1,
        close: -1
      }
      // TODO 此处应根据人员类别直接选取
      // TODO 允许用户选取自定义任意导出模板
      const opt = {
        message: '选择是否下载干部类型',
        type: 'info',
        title: '导出',
        confirmButtonText: '干部',
        cancelButtonText: '其他人员',
        distinguishCancelAndClose: true,
        showCancelButton: true,
        callback: action => {
          const dutiesType = decider[action]
          if (dutiesType === -1) return
          const applyId = row.id
          this.loading = true
          exportApplyDetail(dutiesType, applyId).finally(() => {
            this.loading = false
          })
        }
      }
      MessageBox(opt)
    }
  }
}
</script>

<style>
</style>
