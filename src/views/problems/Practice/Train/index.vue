<template>
  <div v-if="name" v-loading="loading">
    <div v-if="database">
      <el-card class="right-hover-panel flashing-layout-right">
        <span>
          <slot name="sidebar" />
          <el-button type="text" @click="show_options = !show_options">查看详情</el-button>
        </span>
      </el-card>
      <div class="train-container">
        <div class="train">
          <h1>题库：{{ database.alias || database.description }}</h1>
          <PracticeTip :show-tip.sync="show_tip" />
          <ProblemList :data="database.problems" @onStatus="v => problem_status = v" @requireInit="show_options=true" />
        </div>
      </div>
      <el-dialog :visible.sync="show_options" :width="device === 'mobile' ? '100%' : '50%'" append-to-body>
        <template #title>
          <h3>设置选项</h3>
        </template>
        <el-collapse v-model="current_option_focus" accordion>
          <el-collapse-item title="题目选取" name="1">
            <ProblemOverview :data="database.problems" :focus.sync="problem_focus" />
          </el-collapse-item>
          <el-collapse-item title="刷题设置" name="2">
            <TrainOptions :database="name" :problems="database.problems" @change="onOptionsChanged" />
          </el-collapse-item>
          <el-collapse-item title="刷题统计" name="3">
            <TrainStatus :data="problem_status" />
          </el-collapse-item>
        </el-collapse>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import api from '@/api/problems'
export default {
  name: 'Train',
  components: {
    ProblemOverview: () => import('./ProblemOverview'),
    ProblemList: () => import('./ProblemList'),
    TrainOptions: () => import('./TrainOptions'),
    TrainStatus: () => import('./TrainStatus'),
    PracticeTip: () => import('../PracticeTip')
  },
  props: {
    name: { type: String, default: null }
  },
  data: () => ({
    database: null,
    loading: false,
    problem_focus: null,
    problem_status: null,
    show_options: false,
    current_option_focus: '1',
    show_tip: false
  }),
  computed: {
    ...mapState({
      device: (state) => state.app.device,
    })
  },
  watch: {
    name: {
      handler (val) {
        this.refresh()
      },
      immediate: true
    }
  },
  methods: {
    onOptionsChanged () {
    },
    showOption ({ is_show }) {
      this.show_options = !!is_show
    },
    refresh () {
      const { name } = this
      if (!name) return
      this.loading = true
      api.get_database_detail(name).then(data => {
        this.database = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.train-container {
  display: flex;
  justify-content: center;
}

.train {
  width: 64rem;
  padding: 0 0.2rem 0 0.2rem;
  border: 1px solid #ddd;
}

.operation-bar {
  position: fixed;
  z-index: 2;
  transition: all ease 0.5s;
  transition-delay: 5s;
  opacity: 0.5;
  top: 10vh;
  right: -8rem;

  &:hover {
    transition-delay: 0s;
    opacity: 1;
    right: 0;
  }
}
</style>
