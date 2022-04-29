<template>
  <div>
    <div v-show="!showDialog" class="display-item" @click="showSetting">设置</div>
    <el-dialog :visible.sync="showDialog" title="设置" append-to-body>
      <MagicForm v-if="innerSetting" v-model="innerSetting" />
      <el-alert v-else type="error">设置选项未初始化</el-alert>
      <template slot="footer">
        <el-button type="success" icon="el-icon-upload" @click="saveSetting">保存</el-button>
        <el-button type="danger" icon="el-icon-refresh" @click="reloadPage">加载</el-button>
        <el-button type="info" icon="el-icon-edit" @click="editSetting">高级编辑</el-button>
        <el-select v-model="settingName" allow-create filterable>
          <el-option v-for="item in settings" :key="item" :value="item" :label="item" />
        </el-select>
      </template>
      <el-dialog :visible.sync="showSettingEditDialog" append-to-body>
        <el-input v-model="settingText" type="textarea" autosize />
        <el-button type="success" style="width:100%" @click="saveEditSetting">保存</el-button>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import MagicForm from '@/components/MagicForm'
import { debounce } from '@/utils'
import { loadSettingString } from '@/store/modules/dashboard/index'
export default {
  name: 'SettingEngine',
  components: { MagicForm },
  props: {
    setting: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data: () => ({
    showDialog: false,
    showSettingEditDialog: false,
    innerSetting: null,
    settingName: 'default',
    settings: ['default'],
    lastUpdate: new Date(),
    settingText: null
  }),
  computed: {
    updatedSetting() {
      return debounce(() => {
        this.$emit('update:setting', this.innerSetting)
      }, 500)
    },
    requireSaveConfig() {
      return debounce(() => {
        return this.saveConfig()
      }, 500)
    },
    updatedSettingName() {
      return debounce(() => {
        return this.loadSetting()
      }, 500)
    }
  },
  watch: {
    showDialog: {
      handler(val) {
        if (!val) this.$emit('closed')
        else this.$emit('opend')
      }
    },
    settings: {
      handler(val) {
        this.$nextTick(() => {
          this.requireSaveConfig()
        })
      }
    },
    settingName: {
      handler(val) {
        this.$nextTick(() => {
          this.updatedSettingName().then(() => {
            this.requireSaveConfig()
          })
        })
      }
    },
    setting: {
      handler(val) {
        if (val) {
          this.innerSetting = val
        }
      },
      immediate: true
    },
    innerSetting: {
      handler(val) {
        this.updatedSetting()
      },
      deep: true
    }
  },
  mounted() {
    var rawSetting = localStorage.getItem('dashboard.settings')
    if (rawSetting) {
      var item = JSON.parse(rawSetting)
      this.settings = item.settings
      this.settingName = item.name
      this.$nextTick(() => this.updatedSettingName())
    } else {
      this.loadSetting()
    }
  },
  methods: {
    showSetting() {
      this.showDialog = true
    },
    loadSetting() {
      return new Promise((res, rej) => {
        this.$store
          .dispatch('dashboard/loadSetting', { name: this.settingName })
          .catch(() => {
            this.$store.dispatch('dashboard/init')
          })
          .finally(() => {
            res()
          })
      })
    },
    saveSetting() {
      this.$store.dispatch('dashboard/saveSetting', {
        name: this.settingName,
        setting: this.innerSetting
      })
      this.$message.success('已保存')
    },
    reloadPage() {
      this.$confirm('重新加载设置将刷新页面').then(() => {
        this.$router.go(0)
      })
    },
    saveEditSetting() {
      const item = JSON.parse(this.settingText)
      this.$store.dispatch('dashboard/saveSetting', {
        name: this.settingName,
        setting: item
      })
      this.$message.success('已保存')
    },
    editSetting() {
      this.settingText = loadSettingString(this.settingName)
      this.showSettingEditDialog = true
    },
    saveConfig() {
      if (this.settings.indexOf(this.settingName) === -1) {
        this.settings.push(this.settingName)
      }
      localStorage.setItem(
        'dashboard.settings',
        JSON.stringify({
          name: this.settingName,
          settings: this.settings
        })
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.display-item {
  color: #aaa;
  font-size: 0.05rem;
  cursor: pointer;
}
</style>
