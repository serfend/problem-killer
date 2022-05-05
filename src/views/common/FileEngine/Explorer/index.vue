<template>
  <el-row v-loading="loading">
    <el-form label-width="8rem">
      <el-form-item label="查看匿名文件">
        <el-tooltip content="匿名文件是所有用户都可看到的公开文件，如选中，则上传和查询时都将查看公开的文件">
          <el-switch v-model="innerQueryForm.anonymous" :disabled="!currentUser" />
        </el-tooltip>
      </el-form-item>
    </el-form>
    <el-card v-infinite-scroll="loadNextPage">
      <div v-for="(folder,index) in folders.array" :key="index">
        <SvgIcon icon-class="file" />
        <span style="cursor:pointer" @click="enterPath(folder)">{{ folder }}</span>
      </div>
      <el-row v-for="file in folderFiles.array" :key="file.id" class="e-file-container">
        <el-col :span="1">
          <SvgIcon icon-class="doc" />
        </el-col>
        <el-col :span="9">
          <el-tooltip :content="file.name">
            <span
              style="overflow:hidden;white-space:nowrap"
              @click="$emit('select',file.name)"
            >{{ file.name }}</span>
          </el-tooltip>
        </el-col>
        <el-col :span="6">
          <el-tooltip>
            <template slot="content">
              <div>创建时间:{{ file.create }}</div>
              <div>最后修改:{{ file.lastModify }}</div>
            </template>
            <span>{{ new Date(file.lastModify)|formatTime }}</span>
          </el-tooltip>
        </el-col>
        <el-col :span="2">
          <span>{{ `${numberFormatter(file.length)}B` }}</span>
        </el-col>
        <el-col :span="4">
          <span>{{ file.fromClient }}</span>
        </el-col>
      </el-row>
      <el-button
        v-if="foldersHasNextPage||filesHasNextPage"
        :loading="loading"
        style="width:100%"
        type="text"
        @click="loadNextPage"
      >{{ loading?'加载中...':'点击加载更多记录' }}</el-button>
      <div v-else style="height:1px;background-color:#dcdfe6;margin:0.5rem 0.2rem" />
    </el-card>
  </el-row>
</template>

<script>
import { formatTime } from '@/utils'
import { numberFormatter } from '@/filters'
import SvgIcon from '@/components/SvgIcon'
import { folderFiles, requestFolder } from '@/api/common/file'
export default {
  name: 'Explorer',
  components: { SvgIcon },
  props: {
    path: { type: String, default: null },
    queryForm: { type: Object, default: null }
  },
  data: () => ({
    loading: false,
    folderDict: {},
    folders: {
      array: [],
      pages: {
        pageIndex: -1,
        pageSize: 20,
        totalCount: 0
      }
    },
    folderFilesDict: {},
    folderFiles: {
      array: [],
      pages: {
        pageIndex: -1,
        pageSize: 20,
        totalCount: 0
      }
    },
    innerQueryForm: {
      anonymous: false
    },
    nowPath: null
  }),
  computed: {
    currentUser() {
      return this.$store.state.user.userid
    },
    foldersHasNextPage() {
      const pages = this.folders.pages
      return pages.totalCount >= (pages.pageIndex + 1) * pages.pageSize
    },
    filesHasNextPage() {
      const pages = this.folderFiles.pages
      return pages.totalCount >= (pages.pageIndex + 1) * pages.pageSize
    }
  },
  watch: {
    path: {
      handler(val) {
        if (!val) {
          val = ''
        }
        this.nowPath = val
        this.refresh()
      },
      immediate: true
    },
    innerQueryForm: {
      handler(val) {
        this.$emit('update:queryForm', val)
        this.refresh()
      },
      deep: true
    },
    currentUser: {
      handler(val) {
        if (!val) this.innerQueryForm.anonymous = true
      },
      immediate: true
    }
  },
  methods: {
    formatTime,
    numberFormatter,
    refresh() {
      this.folderDict = {}
      this.folders.array = []
      this.folders.pages.pageIndex = -1
      this.folderFilesDict = {}
      this.folderFiles.array = []
      this.folderFiles.pages.pageIndex = -1
      this.loadNextPage()
    },
    enterPath(path) {
      this.nowPath = `${this.nowPath ? `${this.nowPath}/` : ''}${path}`
      this.$emit('update:path', this.nowPath)
    },
    loadNextFilePage() {
      const pages = this.folderFiles.pages
      const userid = this.innerQueryForm.anonymous ? null : this.currentUser
      const path = this.nowPath
      pages.pageIndex++
      console.log('load page of file,', pages.pageIndex)
      return folderFiles({ userid, pages, path }).then(data => {
        if (!data.list) return
        this.folderFiles.array = this.folderFiles.array.concat(data.list)
        pages.totalCount = data.totalCount
      })
    },
    loadNextFolderPage() {
      const pages = this.folders.pages
      pages.pageIndex++
      console.log('load page of folder,', pages.pageIndex)
      const userid = this.innerQueryForm.anonymous ? null : this.currentUser
      const path = this.nowPath
      return requestFolder({ userid, path, pages }).then(data => {
        //  本地去重
        const newList = data.list.filter(i => {
          const r = this.folderDict[i]
          if (!r) this.folderDict[i] = true
          return !r
        })
        if (!newList) return
        this.folders.array = this.folders.array.concat(newList)
        pages.totalCount = data.totalCount
      })
    },
    loadNextPage() {
      if (this.loading) return
      if (!this.filesHasNextPage && !this.foldersHasNextPage) return
      this.loading = true
      const actions = [this.loadNextFolderPage(), this.loadNextFilePage()]
      Promise.all(actions).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.e-file-container {
  cursor: pointer;
  span {
    display: flex;
  }
  &:nth-child(2n + 1) {
    transition: all 0.5s;
    background-color: #0000ff10;
    :hover {
      background-color: #0000ff47;
    }
  }
  &:nth-child(2n) {
    transition: all 0.5s;
    background-color: #0000ff07;
    :hover {
      background-color: #0000ff37;
    }
  }
}
</style>
