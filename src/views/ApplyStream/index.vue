<template>
  <el-card class="content-card">
    <el-form label-width="5rem">
      <el-form-item label="查询单位" required>
        <CompanySelector
          v-model="data.companyRegion"
          default-select-first
          placeholder="选择管理的主单位（单位作用域是界定当前规则有效范围的配置）"
          style="width:30rem"
          @change="requireRefresh"
        />
      </el-form-item>
      <el-form-item v-if="data.companyRegion" label="审批类型">
        <el-select v-model="data.entityType">
          <el-option label="休假" value="vacation" />
          <el-option label="请假" value="inday" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="data.companyRegion&&data.entityType" label="子分类">
        <span style="display:flex">
          <el-tooltip content="若为子分类单独分配了审批流，则此子分类将不再使用通用的审批流。">
            <i class="el-icon-question blue--text" />
          </el-tooltip>
          <VacationTypeSelector
            v-model="data.vacationType"
            :types.sync="data.types"
            :entity-type="data.entityType"
            :left-length="0"
            :check-filter="false"
          />
        </span>
      </el-form-item>

      <el-form-item v-if="data.companyRegion" label="转移到">
        <CompanySelector
          v-model="data.newCompanyRegion"
          placeholder="选择变动到新的单位作用域"
          style="width:30rem"
          @change="requireRefresh"
        />
        <el-tooltip content="默认不转移审批流作用域，如需修改可选中其他单位">
          <i class="el-icon-question blue--text" />
        </el-tooltip>
      </el-form-item>
    </el-form>
    <el-tabs v-if="data.companyRegion" v-model="activeName" class="tab-container">
      <el-tab-pane label="说明" name="ApplyStreamAbout">
        <ApplyStreamAbout v-show="activeName=='ApplyStreamAbout'" />
      </el-tab-pane>
      <el-tab-pane label="方案规则" name="ApplyStreamSolution">
        <ApplyStreamSolution :loading="loading" :data="data" @refresh="solutionRuleRefresh" />
      </el-tab-pane>
      <el-tab-pane label="方案项" name="ApplyAuditStream">
        <ApplyAuditStream :loading="loading" :data="data" @refresh="solutionRefresh" />
      </el-tab-pane>
      <el-tab-pane label="流节点" name="ApplyAuditStreamAction">
        <ApplyAuditStreamAction :loading="loading" :data="data" @refresh="actionNodeRefresh" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import {
  queryStreamNode,
  queryStreamSolution,
  queryStreamSolutionRule
} from '@/api/audit/applyAuditStream'
import { debounce } from '@/utils'
export default {
  name: 'ApplyStream',
  components: {
    CompanySelector: () => import('@/components/Company/CompanySelector'),
    ApplyStreamSolution: () => import('./components/ApplyStreamSolution'),
    ApplyAuditStream: () => import('./components/ApplyAuditStream'),
    ApplyAuditStreamAction: () => import('./components/ApplyAuditStreamAction'),
    ApplyStreamAbout: () => import('./components/ApplyStreamAbout'),
    VacationTypeSelector: () =>
      import('@/components/Vacation/VacationTypeSelector')
  },
  data() {
    return {
      activeName: 'ApplyStreamAbout',
      loading: false,
      data: {
        entityType: 'vacation',
        types: [],
        vacationType: null, // TODO 审批流应与业务无关
        companyRegion: null,
        newCompanyRegion: null,
        allSolutionRule: [],
        allSolutionRuleDic: {},
        allSolution: [],
        allSolutionDic: {},
        allActionNode: [],
        allActionNodeDic: {}
      }
    }
  },
  computed: {
    requireRefresh() {
      return debounce(() => {
        this.refresh()
      }, 500)
    }
  },
  watch: {
    'data.companyRegion': {
      handler(val) {
        this.data.newCompanyRegion = val
      }
    },
    'data.entityType': {
      handler(val) {
        this.data.vacationType = null
        this.refresh()
      }
    },
    'data.vacationType': {
      handler(val) {
        this.refresh()
      }
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.solutionRuleRefresh()
      this.solutionRefresh()
    },
    solutionRuleRefresh() {
      this.loading = true
      const region = this.data.companyRegion || {}
      const { entityType, vacationType } = this.data
      const s = vacationType ? `${vacationType}|` : ''
      this.data.entityTypeDesc = `${s}${entityType}`
      queryStreamSolutionRule({
        companyRegion: region.code,
        entityType: this.data.entityTypeDesc.split('|')[0]
      })
        .then(data => {
          this.data.allSolutionRule = data.list
        })
        .finally(() => {
          this.loading = false
        })
    },
    async solutionRefresh() {
      this.loading = true
      const node = this.actionNodeRefresh
      // 加载解决方案
      const solution = () => {
        const region = this.data.companyRegion || {}
        return queryStreamSolution({
          companyRegion: region.code,
          entityType: this.data.entityTypeDesc.split('|')[0]
        }).then(data => {
          var tableData = data.list
          var length = tableData.nodes ? tableData.nodes.length : 0
          for (var i = length; i < length; i++) {
            tableData.nodes[i].key = Math.random()
          }
          this.data.allSolution = tableData
        })
      }

      return node()
        .then(() => solution())
        .finally(() => {
          this.loading = false
        })
    },
    async actionNodeRefresh() {
      this.loading = true
      const region = this.data.companyRegion || {}
      return await queryStreamNode({
        companyRegion: region.code,
        entityType: this.data.entityTypeDesc.split('|')[0]
      })
        .then(data => {
          this.data.allActionNode = data.list
          for (var n in this.data.allActionNode) {
            const node = this.data.allActionNode[n]
            this.data.allActionNodeDic[node.name] = node
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss"  scoped>
@import "@/styles/animation";
.content-card {
  padding-top: 20px;
}

</style>
