<template>
  <div style="margin:0.2rem">
    <transition-group name="slide-fade">
      <DataBaseSelector v-if="showSelector" key="2" v-model="database" @requireStart="requireStart" />
      <div v-if="!showSelector" key="1">
        <Train :name="database">
          <template #sidebar>
            <span>
              <el-button type="danger" style="margin-bottom:0.5rem" @click="requireStart({ is_manual: true })">返回
              </el-button>
              <PracticeTip :show-tip.sync="show_tip" />
            </span>
          </template>
        </Train>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'Practice',
  components: {
    DataBaseSelector: () => import('./DataBaseSelector'),
    Train: () => import('./Train'),
    PracticeTip: () => import('./PracticeTip')
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
</style>
