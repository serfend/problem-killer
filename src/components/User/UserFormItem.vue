<template>
  <div v-loading="loading">
    <User v-if="directShowCard" :data="innerData" :can-load-avatar="true" />
    <el-popover v-else :placement="placement" width="200" trigger="hover" @show="isActive=true">
      <User v-if="isActive" :data="innerData" :can-load-avatar="isActive" />
      <el-tag slot="reference" class="user-item" v-bind="$attrs">
        <i class="el-icon-user-solid" />
        <span v-if="innerData">{{ innerData.realName }}</span>
        <span v-else>
          <el-tooltip :content="errorMsg">
            <span>{{ userid }}无效</span>
          </el-tooltip>
        </span>
      </el-tag>
    </el-popover>
  </div>
</template>

<script>
import { getUserSummary } from '@/api/user/userinfo'
import User from './index'
export default {
  name: 'UserFormItem',
  components: { User },
  props: {
    data: {
      type: Object,
      default: () => ({
        realName: null
      })
    },
    userid: {
      type: String,
      default: null
    },
    placement: {
      type: String,
      default: 'right'
    },
    directShowCard: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isActive: false,
    innerData: {
      realName: 'null'
    },
    lastUserId: null,
    loading: false,
    errorMsg: null
  }),
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.innerData = val
        }
      },
      immediate: true
    },
    userid: {
      handler(val) {
        this.loadUser(val)
      },
      immediate: true
    }
  },

  methods: {
    loadUser(userid) {
      if (!userid) {
        if (this.lastUserId) this.innerData = null
        return
      }
      this.loading = true
      this.lastUserId = userid
      getUserSummary(userid, true)
        .then(data => {
          this.innerData = data
        })
        .catch(e => {
          this.innerData = null
          this.errorMsg = e.message
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-item {
  transition: transform 0.5s;
}
</style>
