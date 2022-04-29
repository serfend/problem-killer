<template>
  <div>
    <el-card>
      <div slot="header">
        <h3>审批节点设置（筛选审批人）</h3>
        <el-button
          type="success"
          icon="el-icon-refresh-right"
          circle
          style="float:right"
          @click="refresh"
        />
      </div>
      <el-table v-loading="loading" :data="data.allActionNode">
        <el-table-column label="名称">
          <template slot-scope="scope">
            <el-tooltip effect="light">
              <div slot="content">
                <h3>创建于{{ format(scope.row.create) }}</h3>>
                <div>{{ scope.row.description }}</div>
                <div>{{ scope.row.auditMembersCount==0?'所有符合条件的成员均需要审批':`在所有符合条件的成员中，任选${scope.row.auditMembersCount}人审批` }}</div>
              </div>
              <div>{{ scope.row.name }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="作用域">
          <CompanyFormItem :id="scope.row.regionOnCompany" slot-scope="scope" />
        </el-table-column>
        <el-table-column label="单位">
          <template slot-scope="scope">
            <div v-if="!scope.row.companies||scope.row.companies.length==0">
              <div
                v-if="scope.row.companyRefer"
              >{{ scope.row.companyRefer=='parent'?'上级审核':'本级审核' }}</div>
              <div
                v-else-if="scope.row.companyCodeLength.length>0 || scope.row.companyTags.length>0"
              >
                <el-tooltip effect="light">
                  <div slot="content">
                    <el-form>
                      <el-form-item v-if="scope.row.companyCodeLength.length>0" label="代码长度">
                        <el-tag v-for="(l,i) in scope.row.companyCodeLength" :key="i">{{ l }}</el-tag>
                      </el-form-item>
                      <el-form-item v-if="scope.row.companyTags.length>0" label="单位类别">
                        <el-tag v-for="(t,index) in scope.row.companyTags" :key="index">{{ t }}</el-tag>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div>{{ scope.row.companyTags.length + scope.row.companyCodeLength.length }}条范围</div>
                </el-tooltip>
              </div>
              <el-tooltip v-else>
                <div slot="content">所有单位都将默认使用此方案</div>
                <span>不限</span>
              </el-tooltip>
            </div>
            <el-dropdown v-else-if="scope.row.companies.length>1">
              <div>{{ scope.row.companies[0].name }}等{{ scope.row.companies.length }}个单位</div>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(cmp,index) in scope.row.companies" :key="index">
                  <CompanyFormItem :data="cmp" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <CompanyFormItem v-else :data="scope.row.companies[0]" />
          </template>
        </el-table-column>
        <el-table-column label="职务">
          <template slot-scope="scope">
            <div v-if="!scope.row.duties||scope.row.duties.length==0">
              <div style="float:left">
                <el-tooltip>
                  <div
                    slot="content"
                  >{{ scope.row.dutyIsMajor==2?'仅职务类型为主官的生效':scope.row.dutyIsMajor==1?'仅职务类型非主官的生效':'不论职务类型是否为主官都将生效' }}</div>
                  <el-tag>{{ scope.row.dutyIsMajor==2?'仅主官':scope.row.dutyIsMajor==1?'仅非主官':'不限' }}</el-tag>
                </el-tooltip>
              </div>

              <div style="float:left">
                <div v-if="scope.row.dutyTags.length>0">
                  <el-tooltip effect="light">
                    <div slot="content">
                      <el-tag v-for="(t,i) in scope.row.dutyTags" :key="i">{{ t }}</el-tag>
                    </div>
                    <el-tag>{{ scope.row.dutyTags.length }}种类别</el-tag>
                  </el-tooltip>
                </div>
                <el-tooltip v-else>
                  <div slot="content">所有职务都将默认使用此方案</div>
                  <div>不限类别</div>
                </el-tooltip>
              </div>
            </div>
            <el-dropdown v-else-if="scope.row.duties.length>1">
              <div>{{ scope.row.duties[0].name }}等{{ scope.row.duties.length }}个职务</div>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(duty,i) in scope.row.duties" :key="i">
                  <DutyFormItem :data="duty" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <DutyFormItem v-else :data="scope.row.duties[0]" />
          </template>
        </el-table-column>
        <el-table-column label="成员">
          <template slot-scope="scope">
            <div v-if="!scope.row.auditMembers||scope.row.auditMembers.length==0">
              <el-popover trigger="hover" content="所有成员都将默认使用此方案">
                <el-tag slot="reference">不限</el-tag>
              </el-popover>
            </div>
            <el-dropdown v-else-if="scope.row.auditMembers.length>1">
              <div>{{ scope.row.auditMembers[0].realName }}等{{ scope.row.auditMembers.length }}名成员</div>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(cmp,i) in scope.row.auditMembers" :key="i">
                  <UserFormItem :data="cmp" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <UserFormItem v-else :data="scope.row.auditMembers[0]" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300rem">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit-outline"
              @click="showNodeDialoag('edit',scope.row)"
            >编辑</el-button>
            <el-button
              type="info"
              icon="el-icon-circle-close"
              @click="showNodeDialoag('delete',scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        plain
        type="success"
        icon="el-icon-circle-plus-outline"
        style="width:100%"
        @click="showNodeDialoag('new',null)"
      >添加</el-button>
    </el-card>
    <el-dialog
      :visible.sync="nodeDialogShow"
      :title="newNode.mode=='new'?'新增':newNode.mode=='edit'?'编辑':'删除'"
    >
      <el-form v-loading="newNode.loading" label-width="120px">
        <el-form-item label="名称" style="width:400px">
          <el-input v-model="newNode.name" placeholder="填入独一无二的名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="newNode.description"
            placeholder="节点描述，可自定义"
            style="width:400px"
            type="textarea"
            autosize
          />
        </el-form-item>
        <el-form-item label="单位" style="width:400px">
          <CompaniesSelector v-model="newNode.companies" />

          <el-tag
            v-for="(tag,index) in newNode.companies"
            :key="index"
            closable
            :disable-transitions="false"
            @close="handleCompaniesSelectClose(tag)"
          >{{ tag.name }}</el-tag>
        </el-form-item>
        <el-form-item label="长度">
          <el-select v-model="newNode.companyCodeLength" multiple placeholder="单位代码的位数">
            <el-option v-for="item in 15" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="相对路径">
          <el-select v-model="newNode.companyRefer" placeholder="相对查询何种">
            <el-option
              v-for="(item,i) in companyReferDic"
              :key="i"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单位类型">
          <el-select
            v-model="newNode.companyTags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="单位类型选取，输入后按回车键确认"
          />
        </el-form-item>
        <el-form-item label="主官">
          <el-radio-group v-model="newNode.dutyIsMajor">
            <el-radio :label="0">不限</el-radio>
            <el-radio :label="2">仅主官</el-radio>
            <el-radio :label="1">仅非主官</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="职务">
          <DutiesSelector v-model="newNode.duties" />
          <div>
            <el-tag
              v-for="(tag,index) in newNode.duties"
              :key="index"
              closable
              :disable-transitions="false"
              @close="handleDutiesSelectClose(tag)"
            >{{ tag.name }}</el-tag>
          </div>
        </el-form-item>
        <el-form-item label="职务类型">
          <DutiesSelector :only-tag="true" @tagChange="v=>newNode.dutyTags.push(v)" />
          <el-tag
            v-for="(tag,index) in newNode.dutyTags"
            :key="index"
            closable
            :disable-transitions="false"
            @close="newNode.dutyTags.splice(newNode.dutyTags.indexOf(tag))"
          >{{ tag }}</el-tag>
        </el-form-item>
        <el-form-item label="指定审核人">
          <UserSelector
            :code.sync="userSelect.code"
            :default-info="userSelect.realName?userSelect.realName:'搜索成员'"
            style="display:inline"
            @change="handleUserSelectChange"
          />
          <el-tag
            v-for="(tag,i) in newNode.auditMembers"
            :key="i"
            closable
            :disable-transitions="false"
            @close="handleAuditMembersSelectClosed(tag)"
          >{{ tag.realName }}</el-tag>
        </el-form-item>
        <el-form-item label="审批人数量">
          <el-tooltip content="需要多少人审批">
            <el-input-number v-model="newNode.auditMembersCount" />
          </el-tooltip>
        </el-form-item>
        <AuthCode :form.sync="newNode.auth" select-name="审批流节点编辑" />
        <el-button-group style="width:100%">
          <el-button
            v-loading="newNode.loading"
            type="success"
            style="width:50%"
            @click="submitNode"
          >保存</el-button>
          <el-button
            v-loading="newNode.loading"
            type="danger"
            style="width:50%"
            @click="deleteNode"
          >删除</el-button>
        </el-button-group>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  addStreamNode,
  editStreamNode,
  deleteStreamNode,
  buildFilter
} from '@/api/audit/applyAuditStream'
import CompaniesSelector from '@/components/Company/CompaniesSelector'
import DutiesSelector from '@/components/Duty/DutiesSelector'
import AuthCode from '@/components/AuthCode'
import CompanyFormItem from '@/components/Company/CompanyFormItem'
import DutyFormItem from '@/components/Duty/DutyFormItem'
import UserFormItem from '@/components/User/UserFormItem'
import UserSelector from '@/components/User/UserSelector'
import { formatTime } from '@/utils'
export default {
  name: 'ApplyAuditStreamAction',
  components: {
    CompanyFormItem,
    DutyFormItem,
    CompaniesSelector,
    AuthCode,
    UserFormItem,
    DutiesSelector,
    UserSelector
  },
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
  data() {
    return {
      companyReferDic: [
        { value: '', label: '不使用相对' },
        { value: 'self', label: '本级审核' },
        { value: 'parent', label: '上级审核' }
      ],
      nodeDialogShow: false,
      newNode: this.buildnewNode(),
      userSelect: {}
    }
  },
  methods: {
    format(d) {
      return formatTime(d)
    },
    checkAuditMembersIndex(id) {
      const node = this.newNode
      const auditMembers = node.auditMembers.map(i => i.id)
      return auditMembers.indexOf(id)
    },
    handleUserSelectChange(val) {
      const node = this.newNode
      if (!val) return
      this.userSelect.realName = val.realName
      if (this.checkAuditMembersIndex(val.id) > -1) {
        return this.$message.error(`${val.realName}已被选中`)
      }
      node.auditMembers.push(val)
    },
    handleCompaniesSelectClose(tag) {
      const node = this.newNode
      const companies = node.companies.map(i => i.code)
      const code = tag.code
      node.companies.splice(companies.indexOf(code), 1)
    },
    handleAuditMembersSelectClosed(tag) {
      const node = this.newNode
      const i = this.checkAuditMembersIndex(tag.id)
      node.auditMembers.splice(i, 1)
    },
    handleDutiesSelectClose(tag) {
      const node = this.newNode
      const i = node.duties.map(i => i.code).indexOf(tag.code)
      node.duties.splice(i, 1)
    },
    refresh() {
      this.$emit('refresh')
    },
    showNodeDialoag(mode, target) {
      const node = this.newNode
      this.nodeDialogShow = true
      node.mode = mode
      if (target) {
        Object.assign(node, target)
      }
    },
    submitNode() {
      const node = this.newNode
      if (node.loading) return this.$message.info('加载中')
      node.loading = true
      var fn = node.mode === 'edit' ? editStreamNode : addStreamNode
      const region = this.data.newCompanyRegion || {}
      fn({
        id: node.id,
        name: node.name,
        companyRegion: region.code,
        description: node.description,
        filter: buildFilter(
          Object.assign(
            { entityType: this.data.entityTypeDesc.split('|')[0] },
            node
          )
        ),
        auth: node.auth
      })
        .then(() => {
          this.$message.success(`节点${node.name}已提交`)
          this.refresh()
        })
        .finally(() => {
          node.loading = false
        })
    },
    deleteNode(row) {
      const node = this.newNode
      if (node.loading) return this.$message.info('加载中')
      node.loading = true
      var auth = node.auth
      if (!auth) {
        auth = {}
      }
      deleteStreamNode({
        name: node.name,
        entityType: this.data.entityTypeDesc.split('|')[0],
        authByUserId: auth.authByUserId,
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
    buildnewNode() {
      const node = this.newNode
      var lastAuth = node ? node.auth : null
      if (lastAuth === null) {
        lastAuth = {
          authByUserId: '',
          code: 0
        }
      }
      return {
        mode: 'new',
        name: '',
        description: '',
        duties: [],
        dutyIsMajor: 0,
        dutyTags: [],
        companies: [],
        companyRefer: '',
        companyTags: [],
        companyCodeLength: [],
        auditMembersCount: 1,
        auditMembers: [],
        auth: lastAuth,
        loading: false
      }
    }
  }
}
</script>

<style>
</style>
