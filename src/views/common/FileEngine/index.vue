<template>
  <el-form style="justify-content:center">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card header="文件上传">
          <el-form-item label="文件名称">
            <el-input v-model="file.fileName" />
          </el-form-item>
          <el-form-item label="路径">
            <el-input v-model="file.filePath" />
          </el-form-item>
          <AuthCode :form.sync="file.auth" select-name="文件操作" />
          <el-form-item label="文件">
            <el-upload
              drag
              multiple
              :before-upload="beforeAvatarUpload"
              :http-request="upload"
              :on-success="onUploadSuccess"
              :action="''"
              :data="file"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
          </el-form-item>
        </el-card>
        <el-card :header="nowLoadingFile" style="margin-top:1rem">
          <el-form-item label="id">{{ fileInfo.id }}</el-form-item>
          <el-form-item label="路径">{{ fileInfo.fullPath }}</el-form-item>
          <el-form-item label="名称">{{ fileInfo.name }}</el-form-item>
          <el-form-item label="大小">{{ fileInfo.length }}</el-form-item>
          <el-form-item label="创建时间">{{ fileInfo.create }}</el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="fileInfo.clientKey" />
          </el-form-item>
          <div>
            <el-button
              :disabled="!fileInfo.id"
              :loading="fileDownloading"
              type="info"
              class="file-handle-btn"
              icon="el-icon-document-copy"
              @click="clipBoard(fileInfo.id,`${fileInfo.fullPath}_${fileInfo.name}`,$event)"
            >复制链接</el-button>
          </div>
          <div>
            <el-button
              :disabled="!fileInfo.id"
              :loading="fileDownloading"
              type="success"
              class="file-handle-btn"
              icon="el-icon-download"
              @click="download(fileInfo.id,`${fileInfo.fullPath}_${fileInfo.name}`)"
            >下载文件</el-button>
          </div>
          <div>
            <el-button
              :loading="fileDownloading"
              type="danger"
              class="file-handle-btn"
              icon="el-icon-delete"
              @click="deleteFile(fileInfo.fullPath,fileInfo.name,fileInfo.clientKey)"
            >删除文件{{ fileInfo.clientKey||fileInfo.clientKey.length==36?'':'(需要授权码)' }}</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header style="display:flex">
            <span
              v-for="(path,index) in ['root'].concat(file.filePath.split('/'))"
              :key="index"
              style="color:#33c;cursor:pointer"
              @click="jumpToPath(index)"
            >{{ path }}/</span>
            <el-button v-if="!newFolder" icon="el-icon-plus" type="text" @click="initNewFolder" />
            <el-input
              v-else
              ref="newFolder"
              v-model="newFolder"
              size="mini"
              style="width:10rem"
              @keypress.native.enter="add_path"
            >
              <template #append>
                <el-button
                  icon="el-icon-circle-plus-outline"
                  type="text"
                  style="width:100%"
                  @click="add_path"
                >添加</el-button>
              </template>
            </el-input>
          </template>
          <Explorer
            ref="explorer"
            :query-form.sync="queryForm"
            :path.sync="file.filePath"
            @select="fileSelect"
          />
        </el-card>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { upload } from '@/api/common/file'
import clipboard from '@/utils/clipboard'
import { requestFile, getClientKey, deleteFile } from '@/api/common/file'
export default {
  name: 'FileEngine',
  components: {
    AuthCode: () => import('@/components/AuthCode'),
    Explorer: () => import('./Explorer')
  },
  data: () => ({
    statusLoading: false,
    newFolder: null,
    file: {
      fileName: '',
      filePath: '',
      sha256: null,
      isHidden: false,
      userid: null,
      auth: {
        authByUserId: '',
        code: ''
      }
    },
    fileDownloading: false,
    fileInfo: {
      name: '',
      path: '',
      length: '',
      create: '',
      id: '',
      clientKey: ''
    },
    queryForm: {
      anonymous: false
    },
    statusList: []
  }),
  computed: {
    userid() {
      const form = this.queryForm || {}
      const userid = form.anonymous ? null : this.currentUser
      return userid
    },
    currentUser() {
      return this.$store.state.user.userid
    },
    nowLoadingFile() {
      return `文件下载 ${this.file.filePath}/${this.file.fileName}`
    }
  },
  watch: {
    file: {
      handler(val) {
        this.updateFile()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    upload(data) {
      debugger
      const f = { anonymous: this.queryForm.anonymous }
      data.data = Object.assign(f, data.data)
      return upload(data)
    },
    initNewFolder() {
      this.newFolder = '新的文件夹'
      this.$nextTick(() => {
        const s = this.$refs.newFolder
        s.select()
      })
    },
    add_path() {
      this.file.filePath = `${this.file.filePath}/${this.newFolder}`
      this.newFolder = ''
    },
    jumpToPath(index) {
      const list = this.file.filePath.split('/')
      this.file.fileName = ''
      this.file.filePath = list.splice(0, index).join('/')
    },
    fileSelect(file) {
      this.file.fileName = file
    },
    deleteFile(filepath, filename, clientKey) {
      const { userid } = this
      deleteFile({ userid, filepath, filename, clientKey }).then(() => {
        this.$message.success('删除成功')
      })
    },
    downloadUrl(fileId) {
      return require('@/utils/website').getWebUrlPath(
        `file/download?fileid=${fileId}`
      )
    },
    clipBoard(fileid, fileName, event) {
      clipboard(this.downloadUrl(fileid), event).then(() => {
        this.$message.success(`文件${fileName} 链接已复制`)
      })
    },
    download(fileid, fileName) {
      var a = document.createElement('a')
      a.href = this.downloadUrl(fileid)
      a.click()
    },
    updateFile() {
      const { file, userid } = this
      if (!file || !file.filePath || !file.fileName) return

      requestFile(Object.assign(file, { userid })).then(data => {
        const item = data.model || data.file
        const id = item.id
        file.clientKey = '加载中...'
        this.$nextTick(() => {
          getClientKey(id, this.file.auth)
            .then(ck => {
              this.fileInfo.clientKey = ck
              file.clientKey = ck
              this.$forceUpdate()
            })
            .catch(e => {
              this.fileInfo.clientKey = `无法加载(${e.message})`
            })
          this.fileInfo = item
        })
      })
    },
    onUploadSuccess(data, status, arr) {
      this.$message.success(`${status.name}上传成功`)
      this.refreshStatus()
      this.file.fileName = ''
    },
    beforeAvatarUpload(file) {
      debugger
      const form = this.file
      if (!form.filePath) this.file.filePath = 'client-sfvue'
      form.fileName = file.name
      return true
    },
    refreshStatus() {
      this.$refs.explorer.refresh()
    }
  }
}
</script>
<style scoped>
.file-handle-btn {
  width: 100%;
  margin-bottom: 1em;
}
</style>
