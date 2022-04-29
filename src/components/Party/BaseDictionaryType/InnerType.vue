<template>
  <el-tooltip>
    <template #content>{{ description }}</template>
    <el-tag :style="{'background-color':color,color:'#fff'}" effect="plain">{{ alias }}</el-tag>
  </el-tooltip>
</template>

<script>
export default {
  name: 'BaseDictionaryType',
  model: {
    prop: 'type',
    event: 'change'
  },
  props: {
    type: { type: Number, default: -1 },
    dictionary: { type: Object, default: null },
    config: { type: Object, required: true }
  },
  computed: {
    item() {
      const { config, dictionary, type } = this
      const props = config.props
      if (!dictionary) return null
      const r = dictionary[type] || {
        [props.alias]: '未知类型',
        [props.color]: '#ccc'
      }
      return r
    },
    description() {
      return this.getConfig('description') || '无说明'
    },
    color() {
      return this.getConfig('color') || '#888'
    },
    alias() {
      return this.getConfig('alias') || '未知类型'
    }
  },
  methods: {
    getConfig(name) {
      const item = this.item
      if (!item) return null
      const v =
        (this.config && this.config.props && this.config.props[name]) || name
      return item[v] || null
    }
  }
}
</script>
