<template>
  <span>
    <el-button type="text" @click="$emit('update:showTip',!showTip)">{{ showTip ? '隐藏帮助' : '查看帮助' }}</el-button>
    <span v-if="showTip" style="font-size:0.8rem;font-weight:600">
      <p>【Ctrl+Shift+↑】键返回上一题，【Ctrl+Shift+↓】键进入下一题</p>
      <p>题目内按【Ctrl+Alt+Enter】提交答案</p>
      <p>【Ctrl+Alt+数字】选中选项</p>
      <p>提交正确后【Enter】结束该题</p>
      <p>双击题目以聚焦到该题</p>
      <p>只会显示当前聚焦的题目和该题附近的题目</p>
    </span>
  </span>
</template>

<script>
export default {
  name: 'PracticeTip',
  props: {
    showTip: { type: Boolean, default: false }
  }
}
</script>
