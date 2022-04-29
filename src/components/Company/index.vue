<template>
  <el-form v-loading="loading" :style="{width:width}">
    <el-form-item label="代码">{{ innerInfo.code }}</el-form-item>
    <el-form-item label="名称">{{ innerInfo.name }}</el-form-item>
    <el-form-item label="类别">{{ innerInfo.type }}</el-form-item>
    <el-form-item label="管理成员">
      <div v-if="innerInfo.managers.length==0">无管理</div>
      <div v-else-if="innerInfo.managers.length==1">
        <el-link
          icon="el-icon-s-custom"
          :target="`#/user/profile?id=${innerInfo.managers[0].id}`"
        >{{ innerInfo.managers[0].realName }}</el-link>
      </div>
      <el-dropdown v-else>
        <span class="el-dropdown-link">
          <el-link
            icon="el-icon-s-custom"
            :target="`#/user/profile?id=${innerInfo.managers[0].id}`"
          >{{ innerInfo.managers[0].realName }}</el-link>
          等{{ innerInfo.managers.length }}人
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="u in innerInfo.managers" :key="u.id" icon="el-icon-s-custom">
            <el-link icon="el-icon-s-custom" :target="`#/user/profile?id=${u.id}`">{{ u.realName }}</el-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-form-item>
  </el-form>
</template>

<script>
import { companyDetail } from '@/api/company'
export default {
  name: 'Company',
  model: {
    prop: 'id',
    event: 'change'
  },
  props: {
    data: { type: Object, default() { return this.defaultData() } },
    id: { type: String, default: null },
    width: { type: String, default: '200px' },
    canLoad: { type: Boolean, default: false }
  },
  data() {
    return {
      loading: false,
      innerInfo: this.defaultData(),
      loaded: false,
      lastId: null
    }
  },
  watch: {
    id: {
      handler(val) {
        this.loaded = false
        this.OnStatusChange()
      },
      immediate: true
    },
    canLoad: {
      handler(val) {
        this.OnStatusChange()
      },
      immediate: true
    },
    data: {
      handler(val) {
        if (!val) return
        var defaultInfo = this.defaultData()
        for (var i in this.innerInfo) {
          if (val[i]) this.innerInfo[i] = val[i]
          else this.innerInfo[i] = defaultInfo[i]
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    OnStatusChange() {
      const id = this.id
      if (!id) {
        const data = this.data
        if (data) return
        this.$emit('update:data', null)
        return
      }
      const canLoad = this.canLoad
      if (!canLoad || this.lastId === id) return
      this.loading = true
      this.lastId = id
      companyDetail(id)
        .then(data => {
          const c = data.model
          this.$emit('update:data', c)
          this.$emit('formUpdate', c)
          this.loaded = true
        })
        .finally(() => {
          this.loading = false
        })
    },
    defaultData() {
      return {
        name: '无名称',
        type: '无类别',
        code: '未知代码',
        managers: [] // Array of UserDto
      }
    }
  }
}
</script>

<style>
</style>
