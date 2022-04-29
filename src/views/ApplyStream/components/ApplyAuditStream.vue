<template>
  <div>
    <el-card>
      <div slot="header">
        <h3>审批方案</h3>
        <el-button
          type="success"
          icon="el-icon-refresh-right"
          circle
          style="float:right"
          @click="refresh"
        />
      </div>
      <el-table v-loading="loading" :data="data.allSolution">
        <el-table-column label="名称">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="作用域">
          <CompanyFormItem :id="scope.row.regionOnCompany" slot-scope="scope" />
        </el-table-column>
        <el-table-column label="说明">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="流程" width="100rem">
          <template slot-scope="scope">
            <el-tooltip>
              <div slot="content">
                <el-steps direction="vertical">
                  <el-step v-for="(s,i) in scope.row.nodes" :key="i" style="width:20rem">
                    <div slot="title" style="color:#ffc300">
                      <div v-if="s">{{ s.name }}</div>
                      <div v-else>无效的节点，可能已被删除</div>
                    </div>
                    <div slot="description">
                      <div v-if="s">
                        <div style="color:#ffffff;font-size:1rem">{{ s.description }}</div>
                        <div>
                          <span>需要</span>
                          <span>{{ s.auditMembersCount==0?'所有人':(s.auditMembersCount+'人') }}</span>
                          <span>审核</span>
                        </div>
                      </div>
                    </div>
                  </el-step>
                </el-steps>
              </div>
              <div>{{ scope.row.nodes.length }}条</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300rem">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit-outline"
              @click="showSolutionDialog('edit',scope.row)"
            >编辑</el-button>
            <el-button
              type="info"
              icon="el-icon-circle-close"
              @click="showSolutionDialog('delete',scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        plain
        type="success"
        icon="el-icon-circle-plus-outline"
        style="width:100%"
        @click="showSolutionDialog('new',null)"
      >添加</el-button>
    </el-card>
    <el-dialog
      :visible.sync="nodeDialogShow"
      :title="newSolution.mode=='new'?'新增':newSolution.mode=='edit'?'编辑':'删除'"
    >
      <el-form v-loading="newSolution.loading">
        <el-form-item label="名称">
          <el-input v-model="newSolution.name" placeholder="填入独一无二的名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newSolution.description" placeholder="方案的描述，可自定义" />
        </el-form-item>
        <el-form-item label="审批节点">
          <el-select v-model="newSolution.nodeSelect" @change="selectNodeChanged">
            <el-option
              v-for="(item,i) in data.allActionNode"
              :key="i"
              :label="item.name"
              :value="item.name"
            >
              <el-tooltip :content="item.description">
                <div>{{ item.name }}</div>
              </el-tooltip>
            </el-option>
          </el-select>
        </el-form-item>
        <el-card>
          <el-tree
            :data="newSolution.nodes"
            node-key="id"
            draggable
            default-expand-all
            :expand-on-click-node="false"
          >
            <div slot-scope="{node}" class="custom-tree-node">
              <el-tag closable effect="plain" @close="handleSelectNodeClose(node)">{{ node.label }}</el-tag>
              <span>{{ node.data.description }}</span>
            </div>
          </el-tree>
        </el-card>
        <AuthCode :form.sync="newSolution.auth" select-name="审批流编辑" />
        <el-button-group style="width:100%">
          <el-button
            v-loading="newSolution.loading"
            type="success"
            style="width:50%"
            @click="submitSolution"
          >保存</el-button>
          <el-button
            v-loading="newSolution.loading"
            type="danger"
            style="width:50%"
            @click="deleteSolution"
          >删除</el-button>
        </el-button-group>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import CompanyFormItem from '@/components/Company/CompanyFormItem'
import AuthCode from '@/components/AuthCode'
import { formatTime } from '@/utils'
import {
  addStreamSolution,
  editStreamSolution,
  deleteStreamSolution
} from '@/api/audit/applyAuditStream'
export default {
  name: 'ApplyAuditStream',
  components: { AuthCode, CompanyFormItem },
  props: {
    data: {
      type: Object,
      default() {
        return {
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
    loading: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    nodeDialogShow: false,
    newSolution: {
      mode: 'new',
      name: '',
      description: '',
      nodeSelect: '',
      nodes: [],
      auth: {
        authByUserId: '',
        code: 0
      },
      loading: false
    }
  }),
  methods: {
    format(d) {
      return formatTime(d)
    },
    refresh() {
      this.$emit('refresh')
    },
    submitSolution() {
      const node = this.newSolution
      if (node.loading) return this.$message.info('加载中')
      node.loading = true
      var fn = node.mode === 'edit' ? editStreamSolution : addStreamSolution
      const region = this.data.newCompanyRegion || {}
      fn({
        id: node.id,
        name: node.name,
        companyRegion: region.code,
        entityType: this.data.entityTypeDesc.split('|')[0],
        description: node.description,
        nodes: node.nodes.map(i => i.label),
        auth: node.auth
      })
        .then(() => {
          this.$message.success(`方案${node.name}已提交`)
          this.refresh()
        })
        .finally(() => {
          node.loading = false
        })
    },
    showSolutionDialog(mode, target) {
      const node = this.newSolution
      this.nodeDialogShow = true
      node.mode = mode
      if (target) {
        node.id = target.id
        node.name = target.name
        node.description = target.description
        node.nodes = target.nodes.map(i => {
          if (!i) i = { name: '无效的节点' }
          return this.buildNodeSelect(i.name)
        })
      }
    },
    deleteSolution() {
      const node = this.newSolution
      if (node.loading) return this.$message.info('加载中')
      node.loading = true
      var auth = node.auth
      if (!auth) {
        auth = {}
      }
      deleteStreamSolution({
        name: node.name,
        authByUserId: auth.authByUserId,
        entityType: this.data.entityTypeDesc.split('|')[0],
        code: auth.code
      })
        .then(() => {
          this.$message.success(`${node.name}已删除`)
          this.nodeDialogShow = false
          this.refresh()
        })
        .finally(() => {
          node.loading = false
        })
    },
    buildNodeSelect(val) {
      const s = this.data.allActionNodeDic[val]
      return {
        id: Math.random(),
        label: val,
        description: s && s.description
      }
    },
    selectNodeChanged(val) {
      const node = this.newSolution
      node.nodes.push(this.buildNodeSelect(val))
      node.nodeSelect = ''
    },
    handleSelectNodeClose(node) {
      const no = this.newSolution
      var id = node.data.id
      var index = no.nodes.findIndex(n => n.id === id)
      no.nodes.splice(index, 1)
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}
</style>
