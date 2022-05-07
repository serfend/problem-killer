<template>
  <el-card>
    <transition-group name="slide-fade">
      <DataBaseSelector v-if="showSelector" key="2" v-model="database" @requireStart="requireStart" />
      <div v-if="!showSelector" key="1">
        <span>
          <el-button type="danger" style="margin-bottom:0.5rem" @click="requireStart()">返回</el-button>
          <el-button type="text" @click="show_tip=!show_tip">{{ show_tip?'隐藏帮助':'查看帮助' }}</el-button>
          <span v-if="show_tip" style="font-size:0.8rem;font-weight:600">
            <p>【Ctrl+Shift+↑】键返回上一题，【Ctrl+Shift+↓】键进入下一题</p>
            <p>题目内按【Ctrl+Alt+Enter】提交答案</p>
            <p>【Ctrl+Alt+数字】选中选项</p>
            <p>提交正确后【Enter】结束该题</p>
            <p>双击题目以聚焦到该题</p>
            <p>只会显示当前聚焦的题目和该题附近的题目</p>
          </span>
        </span>
        <Train :name="database" />
      </div>
    </transition-group>
  </el-card>
</template>

<script>
export default {
  name: 'Practice',
  components: {
    DataBaseSelector: () => import('./DataBaseSelector'),
    Train: () => import('./Train')
  },
  data: () => ({
    database: null,
    showSelector: true,
    show_tip: false
  }),
  methods: {
    requireStart (v) {
      if (v) this.database = v.name
      this.showSelector = !v
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
