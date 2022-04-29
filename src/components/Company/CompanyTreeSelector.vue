<template>
  <div v-loading="loading">
    <OrgTree
      :data.sync="data"
      :horizontal="horizontal"
      :collapsable="collapsable"
      label-class-name="item-node"
      selected-class-name="myred"
      :render-content="renderContent"
      selected-key="selected"
      @on-expand="onExpand"
      @on-node-click="onNodeClick"
      @on-node-mouseover="onMouseover"
      @on-node-mouseout="onMouseout"
    />
  </div>
</template>

<script>
import { companyChild, companyDetail } from '@/api/company'
import OrgTree from '@/components/OrgTree'
let now_index = 0
const mapper = (i) => {
  i.id = now_index++
  i.label = i.name
  i.children = null
  i.selected = false
  return i
}
export default {
  name: 'CompanyTreeSelector',
  components: {
    OrgTree,
  },
  model: {
    event: 'change',
    prop: 'code',
  },
  props: {
    root: {
      type: Object,
      default: null,
    },
    code: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    loading: false,
    data: {},
    data_dict: {}, // key-value of each node to avoid duplicate loading name
    current: {
      active: false,
      focus: null,
      select: null,
    },
    horizontal: true,
    collapsable: true,
  }),
  watch: {
    root: {
      handler(val) {
        if (!this.root) {
          companyChild('root').then((data) => {
            this.data = {
              code: 'root',
              name: '单位树',
              children: data.list,
            }
          })
        } else {
          this.data = this.root
          this.loadNode(this.data) // TODO root node should follow outer prop modify
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async loadNodeChildren(raw_node) {
      this.loading = true
      // console.log('load node children', raw_node)
      if (!raw_node.children) return
      const list = []
      for (let i = 0; i < raw_node.children.length; i++) {
        list.push(this.loadNode(raw_node.children[i]))
      }
      await Promise.all(list)
      this.loading = false
    },
    async loadNode(raw_node) {
      // console.log('load node', raw_node)
      const dict = this.data_dict
      const code = raw_node && raw_node.code
      const node = dict[code] || raw_node
      // console.log('load attach to node', node)
      const name = node && node.name
      if (!name) {
        const cur_raw = await companyDetail(code)
        Object.assign(raw_node, mapper(cur_raw.model))
      }
      const data = await companyChild(code)
      this.$set(raw_node, 'children', data.list.map(mapper))
      dict[node.code] = raw_node
    },
    onMouseout(e, data) {
      this.current.active = false
    },
    onMouseover(e, data) {
      this.current.focus = data
      this.current.active = true
    },
    renderContent(h, data) {
      return data.name
    },
    async onExpand(e, data) {
      if (data.selected === undefined) {
        await this.loadNodeChildren(data)
      }
      if ('expand' in data) {
        data.expand = !data.expand
        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      } else {
        this.$set(data, 'expand', true)
      }
    },
    onNodeClick(e, data) {
      this.$set(data, 'selected', !data.selected)
      this.$emit('change', data)
      // console.log('selected', data, data.selected)
    },
    collapse(list) {
      list.forEach((child) => {
        if (child.expand) {
          child.expand = false
        }
      })
    },
    toggleExpand(data, val) {
      if (Array.isArray(data)) {
        data.forEach((item) => {
          this.$set(item, 'expand', val)
          if (item.children) {
            this.toggleExpand(item.children, val)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.children) {
          this.toggleExpand(data.children, val)
        }
      }
    },
  },
}
</script>

<style lang="scss">
.item-node {
  cursor: pointer;
  user-select: none;
}

.myred {
  background: #ccc;
}

.floating {
  background: rgba(0, 0, 0, 0.7);
  width: 160px;
  height: 100px;
  position: absolute;
  color: #fff;
  padding-top: 15px;
  border-radius: 15px;
  padding-left: 15px;
  box-sizing: border-box;
  left: 0;
  top: 0;
  transition: all 0.3s;
  z-index: 999;
  text-align: left;
  font-size: 12px;
}
</style>
