<template>
  <div style="margin:0.2rem">
    <transition-group name="slide-fade">
      <DataBaseSelector v-if="showSelector" key="2" v-model="database" @requireStart="requireStart" />
      <div v-if="!showSelector" key="1">
        <el-card class="operation-bar">
          <el-button type="danger" style="margin-bottom:0.5rem" @click="requireStart({ is_manual: true })">返回
          </el-button>
          <el-button type="text" @click="show_tip = !show_tip">{{ show_tip ? '隐藏帮助' : '查看帮助' }}</el-button>
          <span v-if="show_tip" style="font-size:0.8rem;font-weight:600">
            <p>【Ctrl+Shift+↑】键返回上一题，【Ctrl+Shift+↓】键进入下一题</p>
            <p>题目内按【Ctrl+Alt+Enter】提交答案</p>
            <p>【Ctrl+Alt+数字】选中选项</p>
            <p>提交正确后【Enter】结束该题</p>
            <p>双击题目以聚焦到该题</p>
            <p>只会显示当前聚焦的题目和该题附近的题目</p>
          </span>
        </el-card>
        <Train :name="database" />
      </div>
    </transition-group>
  </div>
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
    async requireStart ({ database_name, is_manual }) {
      if (is_manual) {
        const f = this.$confirm
        const f_action = database_name ? f(`是否要切换题库到:${database_name}`, '切换题库') : f('是否要退出', '退出')
        const user_select = await f_action.catch(e => {})
        if (user_select !== 'confirm') return
      }
      if (database_name) this.database = database_name
      this.showSelector = !database_name
    }
  }
}
</script>
<style lang="scss" scoped>
.operation-bar {
  position: fixed;
  z-index: 2;
  transition: all ease 0.5s;
  opacity: 0.5;
  right: -8rem;

  &:hover {
    opacity: 1;
    right: 0;
  }
}
</style>
