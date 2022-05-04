<template>
  <el-card>
    <transition-group name="slide-fade">
      <DataBaseSelector v-if="showSelector" key="2" v-model="database" @requireStart="requireStart" />
      <div v-if="!showSelector" key="1">
        <span>
          <el-button type="danger" style="margin-bottom:0.5rem" @click="requireStart()">返回</el-button>
          <span style="font-size:0.8rem;font-weight:600">【Ctrl+Shift+↑】键返回上一题，【Ctrl+Shift+↓】键进入下一题，题目内按【Ctrl+Alt+Enter】提交答案，【Ctrl+Alt+数字】选中选项，提交正确后【Enter】结束该题。</span>
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
    showSelector: true
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
