<template>
  <span>
    <el-button type="text" @click="$emit('update:showTip',!showTip)">{{ showTip ? '隐藏帮助' : '查看帮助' }}</el-button>
    <span v-if="showTip" style="font-size:0.8rem;font-weight:600">
      <p>题目做完以后将会继续显示，直到下一题也做完了。</p>
      <p>
        <span v-for="i in problemStatusSet" :key="i.name" :style="{color:i.color}">{{ i.name }};</span>
      </p>
      <p>【Ctrl+Shift+↑】键返回上一题，【Ctrl+Shift+↓】键进入下一题</p>
      <p>题目内按【Ctrl+Alt+Enter】提交答案</p>
      <p>【Ctrl+Alt+数字】选中选项</p>
      <p>【Ctrl+Alt+←】选中我会做，【Ctrl+Alt+→】选中我不会。</p>
      <p>【Ctrl+Alt+←】选中确认会做，【Ctrl+Alt+→】选中确认不会。</p>
      <p>提交正确后【Enter】结束该题</p>
      <p>双击题目以聚焦到该题</p>
      <p>只会显示当前聚焦的题目和该题附近的题目</p>
    </span>
  </span>
</template>

<script>
import { problemColorSet } from '../../Problem/type_dispatch'
export default {
  name: 'PracticeTip',
  props: {
    showTip: { type: Boolean, default: false }
  },
  data: () => ({
    problemStatusSet: [
      { name: '当前题目标浅蓝', color: problemColorSet.focus },
      { name: '做对标绿', color: problemColorSet.answer_right },
      { name: '做错标红', color: problemColorSet.answer_wrong },
      { name: '鼠标选中标紫', color: problemColorSet.mouse_focus },
    ]
  })
}
</script>
