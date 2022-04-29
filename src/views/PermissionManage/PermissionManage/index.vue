<template>
  <div>
    <el-card style="margin-top:1rem">
      <el-tree :data="nodes" node-key="id" default-expand-all :expand-on-click-node="false">
        <span slot-scope="{ data }">
          <span
            v-if="data.description"
          >{{ data.description.split('.')[data.description.split('.').length-1] }}</span>
          <span style="color:#ccc;font-size:0.7rem">{{ data.key }}</span>
        </span>
      </el-tree>
    </el-card>
  </div>
</template>

<script>
import pathHandler from '@/utils/common/pathHandler'
export default {
  name: 'Permission',
  label: '全部权限',
  data: () => ({
    nodes: [],
    focus_company: null
  }),
  computed: {
    allPermissions() {
      return this.$store.state.permission.allPermissions
    }
  },
  watch: {
    allPermissions: {
      handler(val) {
        this.nodes = pathHandler.pathToArray(val, k =>
          k.key.split('.')
        )[0].children[0].children
      }
    }
  },
  methods: {
    append(data) {
      console.log(data)
    },
    remove(node, data) {
      console.log(node, data)
    }
  }
}
</script>
