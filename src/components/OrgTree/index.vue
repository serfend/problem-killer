<template>
  <div class="org-tree-container">
    <div class="org-tree" :class="{horizontal, collapsable}">
      <org-tree-node
        :data="data"
        :props="props"
        :horizontal="horizontal"
        :label-width="labelWidth"
        :collapsable="collapsable"
        :render-content="renderContent"
        :label-class-name="labelClassName"
        :selected-key="selectedKey"
        :selected-class-name="selectedClassName"
        @on-expand="(e, data) => $emit('on-expand', e, data)"
        @on-node-focus="(e, data) => $emit('on-node-focus', e, data)"
        @on-node-click="(e, data) => $emit('on-node-click', e, data)"
        @on-node-mouseover="(e, data) => $emit('on-node-mouseover', e, data)"
        @on-node-mouseout="(e, data) => $emit('on-node-mouseout', e, data)"
      />
    </div>
  </div>
</template>

<script>
import render from './node'

export default {
  name: 'OrgTree',
  components: {
    OrgTreeNode: {
      render,
      functional: true,
    },
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    props: {
      type: Object,
      default: () => ({
        label: 'label',
        expand: 'expand',
        children: 'children',
      }),
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
    selectedKey: {
      type: String,
      default: null,
    },
    collapsable: {
      type: Boolean,
      default: null,
    },
    renderContent: {
      type: Function,
      default: null,
    },
    labelWidth: {
      type: [String, Number],
      default: null,
    },
    labelClassName: {
      type: [Function, String],
      default: null,
    },
    selectedClassName: {
      type: [Function, String],
      default: null,
    },
  },
}
</script>

<style lang="scss">
@import './styles/org-tree.scss';
</style>
