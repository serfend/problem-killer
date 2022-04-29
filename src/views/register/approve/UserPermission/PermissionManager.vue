<template>
  <div v-loading="loading">
    <el-tree :data="list" :expand-on-click-node="false">
      <span slot-scope="{ node,data }" class="custom-tree-node">
        <span>{{ data.description }}</span>
        <span v-if="node.isLeaf">
          <span v-if="data.permissions&&data.permissions.length>0">
            <i class="el-icon-check" style="color:#3c3" />
            <el-button
              type="text"
              @click="showPermissionDetail(node,data)"
            >{{ data.permissions.length>1?`${data.permissions[0]}等${data.permissions.length}个权限`:`${data.permissions[0]}` }}</el-button>
          </span>
          <el-button v-else type="text" @click="showPermissionDetail(node,data)">无权限</el-button>
        </span>
        <span v-else>{{ data.total>0?`${data.total}个权限`:'' }}</span>
      </span>
    </el-tree>
    <el-button type="success" style="margin-top:1rem;width:100%" @click="requireUpdate(true)">提交保存</el-button>
    <el-dialog :visible.sync="show_permission_dialog" append-to-body>
      <PermissionModify
        v-model="currentPermission.data"
        :name="currentPermission.name"
        :title="currentPermission.title"
        @require-close="show_permission_dialog=false"
        @require-update="requireUpdate(true)"
      />
    </el-dialog>
  </div>
</template>

<script>
import { allPermissions, getPermission } from '@/api/permission'
export default {
  name: 'PermissionManager',
  components: {
    PermissionModify: () => import('./PermissionModify')
  },
  props: {
    userId: {
      type: String,
      default: null
    },
    auth: {
      type: Object,
      default: null
    }
  },

  data: () => ({
    loading: false,
    lastUpdate: '',
    list: [],
    itemDict: null, // key=>permission item
    currentPermission: {
      name: null,
      title: null
    },
    show_permission_dialog: false
  }),
  watch: {
    userId: {
      handler(val) {
        this.load()
      },
      immediate: true
    }
  },
  mounted() {
    this.init_load()
  },
  destroyed() {
    this.requireUpdate()
  },
  methods: {
    check_update() {
      return false
    },
    requireUpdate(directUpdate = false) {
      const id = this.userId
      const f = this.check_update()
      if (!directUpdate && f !== this.lastUpdate) {
        this.$confirm('权限有修改，是否更新', '更新提醒', {
          type: 'info'
        }).then(() => {
          this.do_submit(f, id)
        })
      } else if (f !== this.lastUpdate) {
        this.do_submit(f, id)
      }
    },
    do_submit(NewPermission, id) {
      this.loading = true
    },
    showPermissionDetail(node, data) {
      this.currentPermission = {
        data,
        title: node.parent.data.title,
        name: node.parent.data.name,
        total: 0
      }
      this.show_permission_dialog = true
    },
    load() {
      if (!this.itemDict) {
        setTimeout(() => this.load(), 200)
        return
      }
      const id = this.userId
      if (!id) return
      this.loading = true
      getPermission({ id })
        .then(data => {
          // TODO
        })
        .finally(() => {
          this.loading = false
          this.requireUpdate()
        })
    },
    init_load() {
      this.loading = true
      allPermissions()
        .then(data => {
          this.load_config(data.model)
        })
        .finally(() => {
          this.loading = false
        })
    },
    load_config(list) {
      console.log('update permissions config', list)
      this.itemDict = {}
      list.forEach(n => {
        this.extract_node(n)
      })
      this.load_config_list(this.itemDict.permission, this.list)
    },
    load_config_list(node, list) {
      const items = Object.keys(node)
      items.forEach(n => {
        if (n === 'item') return
        const current_node = node[n].item || {}
        list.push(current_node)
        current_node.children = []
        this.load_config_list(node[n], current_node.children)
      })
    },
    extract_node(node) {
      const { key, description } = node
      const keys = key.split('.')
      const descriptions = description.split('.')
      let dict = this.itemDict
      keys.forEach(n => {
        if (!dict[n]) dict[n] = {}
        dict = dict[n]
      })
      dict.item = node
      return { keys, descriptions }
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
