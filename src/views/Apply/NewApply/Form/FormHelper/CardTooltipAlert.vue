<template>
  <el-tooltip effect="light" style="margin-bottom:10px">
    <slot slot="content" name="content" />
    <el-alert
      :type="accepting?'warning':accept?'success':'error'"
      center
    >{{ accepting?`${accept?'信息有变化':'准备提交'}~鼠标移到卡片外部，提交当前信息`:accept?'恭喜您，信息已无误':'信息可能有误，再检查检查吧~' }}</el-alert>
  </el-tooltip>
</template>

<script>
export default {
  name: 'CardTooltipAlert',
  props: {
    accept: {
      type: String,
      default: null
    },
    accepting: {
      type: Boolean,
      default: false
    }
  }
}
</script>
