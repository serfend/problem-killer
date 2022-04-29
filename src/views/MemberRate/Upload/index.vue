<template>
  <div>
    <LottieIcon
      path="assets/lottie/lottie-rating.json"
      style="position:absolute;width:15rem;height:30rem;margin-top:-13rem;margin-left:10rem;z-index: -1;"
    />
    <el-card v-loading="loading">
      <template #header>
        <h2>单位评级上传</h2>
      </template>
      <div style="margin-bottom:0.5rem">
        <el-button type="text" @click="download_template">默认模板下载</el-button>
        <el-button type="text" @click="download_user_company_template">本单位样例模板下载</el-button>
        <el-button
          type="text"
          :disabled="!(file.ratingType && file.ratingCycleCount)"
          @click="download_current_data_xlsx"
        >当前选中的提交内容下载</el-button>
      </div>
      <el-form label-width="5rem">
        <el-form-item required label="类别">
          <RatingTypeSelector v-model="file.ratingType" :item.sync="file.ratingTypeItem" />
        </el-form-item>
        <el-form-item v-if="file.ratingType" required label="评比期数">
          <RatingCycleSelector
            v-model="file.ratingCycleCount"
            :rating-type="file.ratingType"
            :data-name.sync="file.ratingDesc"
          />
        </el-form-item>
        <el-form-item label="评比单位">
          <CompanySelector
            v-loading="loading_company"
            :code.sync="file.company"
            placeholder="本次评比的实施单位"
          />
        </el-form-item>
        <el-form-item label="上传数据">
          <el-tag v-if="!canSubmit" type="danger">信息不全，不可提交</el-tag>
          <el-upload
            v-else
            v-loading="loading_company"
            drag
            :before-upload="beforeAvatarUpload"
            :on-success="onUploadSuccess"
            :action="uploadurl"
            :data="file"
            :show-file-list="false"
            with-credentials
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文档拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="覆盖历史">
          <el-tooltip content="当存在历史已上传过的数据时，直接覆盖此数据">
            <el-switch v-model="file.confirm" />
          </el-tooltip>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog :visible.sync="hasError" append-to-body>
      <template #title>
        <h2>上传数据有误</h2>
      </template>
      <el-button
        type="primary"
        style="width:100%;margin-bottom:1rem"
        @click="download_callback"
      >下载反馈文件</el-button>
      <el-table
        row-key="key"
        :tree-props="{children:'children',hasChildren:'hasChildren'}"
        :data="errorList"
      >
        <el-table-column label="位置">
          <template #default="scope">
            <span>{{ scope.row.title }}</span>
            <el-tag
              v-if="scope.row.children && scope.row.children.length"
              size="mini"
            >此行另外{{ scope.row.children.length }}项</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="问题">
          <template #default="scope">{{ scope.row.message }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog v-if="existList" :visible.sync="existDialog" append-to-body>
      <template #title>
        <h2 v-if="existIsForDuplicate">存在以下已存在项,是否覆盖</h2>
        <h2 v-else>下列身份证号未注册，无法上传</h2>
      </template>
      <el-divider />
      <div v-if="existIsForDuplicate">
        <h3>共{{ existList.length }}人</h3>
        <div
          v-for="list in Math.ceil(existList.length/5)"
          :key="list"
          style="display:flex;overflow:auto;margin-top:0.5rem"
        >
          <UserFormItem
            v-for="(i,index) in existList.slice(list*5-5,list*5)"
            :key="index"
            :userid="i.userId"
            style="margin-left:0.5rem"
          />
        </div>
      </div>
      <div v-else>
        <CopyableLabel v-for="i,index in existList" :key="index" :label="i" />
      </div>
      <template #footer>
        <div>
          <el-button v-if="existIsForDuplicate" type="text" @click="confirmSubmit(true)">确认覆盖</el-button>
          <el-button type="primary" @click="confirmSubmit(false)">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { download_template, upload_data_by_last } from '@/api/memberRate/xls'
import { downloadUrl } from '@/api/common/static'
import { load_template as load_user_company_template } from './user-company-members-template'
import { templateToStandard } from '../TemplateBuilder/standard'
import { get_rates } from '@/api/memberRate/query'
export default {
  name: 'MemberRateUpload',
  components: {
    LottieIcon: () => import('@/components/LottieIcon'),
    UserFormItem: () => import('@/components/User/UserFormItem'),
    CopyableLabel: () => import('@/components/Label/CopyableLabel'),
    CompanySelector: () => import('@/components/Company/CompanySelector'),
    RatingCycleSelector: () =>
      import('../RatingTypeOption/RatingCycleSelector'),
    RatingTypeSelector: () => import('../RatingTypeOption/RatingTypeSelector')
  },
  data: () => ({
    file: {
      file: null,
      create: null,
      ratingCycleCount: null,
      ratingTypeItem: null,
      ratingDesc: null,
      ratingType: 4,
      company: null,
      confirm: false
    },
    loading_company: false,
    uploadurl: '',
    loading: false,
    errorList: [],
    errorFileCallback: '',
    hasError: false,
    existList: null,
    existDialog: false
  }),
  computed: {
    existIsForDuplicate() {
      return this.existList[0] && this.existList[0].userId
    },
    canSubmit() {
      const f = this.file
      return f.ratingCycleCount && f.ratingType
    }
  },
  watch: {
    errorList: {
      handler(val) {
        if (val && val.length) {
          this.hasError = true
        }
      }
    }
  },
  mounted() {
    this.uploadurl = require('@/utils/website').getWebUrlPath(
      '/memberRate/xlsUpload'
    )
    this.ratingCycleDate = this.ratingCycleDateValue
    this.loading_company = true
    setTimeout(() => {
      this.loading_company = false
      this.file.company = this.$store.state.user.companyid
    }, 1000)
  },
  methods: {
    confirmSubmit(confirm) {
      this.existDialog = false
      if (confirm) {
        this.loading = true
        upload_data_by_last()
          .then(() => {
            this.$message.success('已确认并上传')
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    download_current_data_xlsx() {
      this.loading = true
      const page = { pageIndex: 0, pageSize: 1e3 }
      const f = this.file
      get_rates(Object.assign(f, { page }))
        .then(model_data => {
          const { data } = templateToStandard(
            model_data,
            f.ratingTypeCycleDesc,
            f.ratingTypeItem
          )
          const filename = '周考月评上传'
          this.$store
            .dispatch('template/download_xlsx', {
              templateName: `${filename}模板.xlsx`,
              data,
              filename: `当前选中数据 - ${filename}.xlsx`
            })
            .finally(() => {
              this.loading = false
            })
        })
        .catch(() => {
          this.loading = false
        })
    },
    download_user_company_template() {
      this.loading = true
      load_user_company_template(
        Object.assign({ code: this.file.company }, this.file)
      )
        .then(data => {
          const filename = '周考月评上传'
          this.$store.dispatch('template/download_xlsx', {
            templateName: `${filename}模板.xlsx`,
            data: data.data,
            filename: `本单位样例 - ${filename}.xlsx`
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    download_template,
    download_callback() {
      const url = this.errorFileCallback
      downloadUrl(url)
    },
    convertMessage(msg) {
      if (!msg) return '无'
      const p = msg.indexOf('Object')
      if (p > -1) return `${msg.substr(0, p)}存在错误`
      return msg
    },
    onUploadSuccess(data, status, arr) {
      this.loading = false
      this.errorList = []
      this.existList = []
      if (data.status !== 0) return this.$message.error(data.message)
      const list = data.data && data.data.list
      if (!list) return this.$message.success('上传成功')
      if (this.checkDataValid(list)) return
      if (this.checkDataExist(list)) return
    },
    checkDataValid(list) {
      if (!list[0]) return this.$message.error('上传文件异常')
      const isDataInvalid = list[0].key
      if (isDataInvalid) {
        const sIndex = list.findIndex(
          i => i.key && i.key.toLowerCase() === 'labelpath'
        )
        if (sIndex > -1) {
          const s = list.splice(sIndex, 1)[0]
          this.errorFileCallback = s.message.replace('temp', '/sftemporary')
        } else this.errorFileCallback = null
      } else return false

      let index = 0
      this.errorList = list.map(i => {
        const messages = i.message.split(';')
        const first = messages.shift()
        return {
          key: index++,
          title: i.key,
          message: this.convertMessage(first),
          children: messages.map(i => ({
            key: index++,
            message: this.convertMessage(i)
          }))
        }
      })
      return true
    },
    checkDataExist(list) {
      this.existList = list
      this.existDialog = true
      return true
    },
    beforeAvatarUpload(file) {
      this.loading = true
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
.center-children {
  display: flex;
  justify-content: center;
  height: 5rem;
}
</style>
