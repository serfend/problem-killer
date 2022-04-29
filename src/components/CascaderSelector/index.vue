<template>
  <el-cascader
    ref="elcascader"
    v-model="staticValue"
    :props="props"
    :show-all-levels="true"
    :placeholder="data&&(multiple?data.map(i=>i[labelName]).join(' '):data[labelName])||placeholder||'未选中任何节点'"
    :class="['card',data&&data.length?'active':'inactive']"
    clearable
    :disabled="disabled"
    @change="handleItemChange"
  />
</template>

<script>
export default {
  name: 'CascaderSelector',
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    defaultSelectFirst: { type: Boolean, default: false },
    data: { type: [Array, Object], default: null },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: null },
    valueName: { type: String, default: 'value' },
    labelName: { type: String, default: 'label' },
    multiple: { type: Boolean, default: false },
    childGetterMethod: { type: Function, default: () => () => {} },
    place: { type: String, default: null }
  },
  data() {
    return {
      staticValue: [],
      props: {
        getChild: id => {
          return this.childGetterMethod(id)
        },
        lazy: true,
        checkStrictly: true,
        multiple: this.multiple,
        // expandTrigger: 'hover', 如果自动展开可能会导致偏移和无法选中的情况
        lazyLoad(node, callback) {
          if (node.root) node.value = 'root'
          this.getChild(node.value).then(data => {
            var list = data.list
            const nodes = Array.from(list).map(item => ({
              value: item.code + '',
              label: item.name,
              leaf: false
            }))
            callback(nodes)
          })
        }
      }
    }
  },
  methods: {
    dblClick(v) {
      console.log(v)
    },
    handleItemChange(val) {
      const { valueName, labelName, multiple } = this
      this.$nextTick(() => {
        const nodes = this.$refs.elcascader.getCheckedNodes()
        const items = nodes.map(i => {
          const item = {}
          item[valueName] = i.value
          item[labelName] = i.label
          return item
        })
        const data = multiple ? items : items[0]
        this.$emit('change', data)
        const place =
          data && (multiple ? data.map(i => i[labelName]) : data[labelName])
        this.$emit('update:place', place)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/element-variables';
.card {
  width: '100%';
  transition: all ease 0.5s;
}
.active {
  color: $--color-primary;
}
.inactive {
  color: $--color-info;
}
</style>
