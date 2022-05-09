<template>
  <el-card v-loading="loading" class="problem">
    <template #header>
      <div class="header">
        <h3>{{ d.alias || '未命名的题库' }}(代号{{ d.name||'未知' }})</h3>
        <span v-if="user_info && user_info.score" class="header-score">{{ user_info.score.average }}分</span>
        <el-rate :value="d.star || 5.0" disabled show-score text-color="#cc8200" score-template="{value}分" />
      </div>
    </template>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>共{{ d.problems && d.problems.length }}题</div>
        <div class="problem-description">{{ d.description || '无描述' }}</div>
      </el-col>
      <el-col :span="12">
        <div v-if="user_info">
          <div>
            <el-button type="text" @click="onHistory">历史</el-button>
            <el-button type="text" class="btn-start" @click="onStart({ is_manual: true })">开始答题</el-button>
          </div>
          <el-form v-if="user_info.score">
            <el-form-item label="均分">
              <el-progress
                :percentage="user_info.score.average || 0"
                :text-inside="true"
                :stroke-width="20"
                class="normal-progress"
              />
            </el-form-item>
            <el-form-item>
              <span>满分:{{ user_info.score.total || '无' }}</span>
              <span>参加次数:{{ user_info.score.total_time || '无' }}</span>
              <span>最高分:{{ user_info.score.max || '无' }}</span>
              <span>最低分:{{ user_info.score.min || '无' }}</span>
            </el-form-item>
          </el-form>
        </div>
        <div v-else>无信息</div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="showHistory" append-to-body>
      <History :data="user_info && user_info.history" />
    </el-dialog>
  </el-card>
</template>

<script>
import { CreateUserInfo } from './user_info'
import api from '@/api/problems'
export default {
  name: 'DataBase',
  components: {
    History: () => import('./History/index.vue')
  },
  props: {
    data: { type: Object, default: () => ({}) }
  },
  data: () => ({
    loading: false,
    user_info: null,
    showHistory: false,
    pages: {
      pageIndex: 0,
      pageSize: 5
    }
  }),
  computed: {
    d () {
      const d = this.data
      if (!d || !d.problems) { return { problems: [] } }
      return d
    }
  },
  watch: {
    'data.name': {
      handler (val) {
        this.onDataChanged(val)
      },
      immediate: true
    }
  },
  methods: {
    onDataChanged (val) {
      this.loading = true
      const name = this.d.name
      // TODO 支持多页
      api.user_database_detail({ name })
        .then((data) => {
          if (!data || !data.score) { data = CreateUserInfo() }
          this.user_info = data
        }).finally(() => {
          this.loading = false
        })
    },
    onStart (is_manual) {
      const database = this.d
      this.$emit('requireStart', { database, is_manual })
    },
    onHistory () {
      this.showHistory = true
    }
  }
}
</script>
<style lang="scss">
.normal-progress {
  .el-progress-bar {
    width: 80% !important;
  }
}
</style>
<style lang="scss" scoped>
.problem {
  .problem-description {
    color: #ccc;
  }

  .header {
    .header-score {
      color: #0be244;
    }

    display: flex;
    justify-content: space-between;
  }

  .btn-start {
    margin-left: 1rem;
  }
}
</style>
