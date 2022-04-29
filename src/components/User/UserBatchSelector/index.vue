<template>
  <el-row v-if="users">
    <transition-group name="fade-out">
      <el-col key="user-list" class="user-list">
        <UserWithAvatarItem
          v-for="u in users_id"
          :key="u"
          :user="u"
          :selected="selected[u]"
          @selectedChanged="v=>handleSelected(u,v)"
          @dblClick="$emit('requireDetail',u)"
        >
          <template v-if="startLoadData&&usersStatus[u]" #description>
            <el-tooltip v-if="!usersStatus[u].isCompleteFlow" effect="light">
              <template #content>
                <div v-if="currentStep(u)">
                  <div>第{{ partyJoinStepsIndex[currentStep(u).id] +1 }}步：{{ currentStep(u).description }}</div>
                </div>
                <div v-else>当前未进行任何流程</div>
              </template>
              <div class="item-description">{{ currentStep(u).alias || '无' }}</div>
            </el-tooltip>
            <div v-else class="item-description">已完成流程</div>
          </template>
        </UserWithAvatarItem>
        <transition-group v-if="showSubmit" name="breadcrumb">
          <el-button
            v-if="innerSelectedUsers.length<users.length && btnSelectallLabel"
            key="user-btn-all"
            type="text"
            @click="innerSelectedUsers = users_id"
          >{{ btnSelectallLabel }}</el-button>
          <el-button
            v-if="innerSelectedUsers.length>0 && btnEditLabel"
            key="user-btn-submit"
            type="text"
            @click="$emit('requireEdit',innerSelectedUsers)"
          >{{ btnEditLabel }}</el-button>
        </transition-group>
      </el-col>
    </transition-group>
  </el-row>
</template>

<script>
export default {
  name: 'UserBatchSelector',
  components: {
    UserWithAvatarItem: () => import('./UserWithAvatarItem'),
  },
  props: {
    users: { type: Array, default: null },
    selectedUsers: { type: Array, default: null },
    startLoadData: { type: Boolean, default: false },
    showSubmit: { type: Boolean, default: true },
    btnSelectallLabel: { type: String, default: '全选' },
    btnEditLabel: { type: String, default: '编辑' },
  },
  data: () => ({
    selected: {},
    usersStatus: {}
  }),
  computed: {
    partyJoinStepsIndex() {
      return {}
    },
    users_id() {
      return this.get_users_id(this.users)
    },
    innerSelectedUsers: {
      get() {
        const dict = this.selected
        return this.users_id.filter(i => dict[i])
      },
      set(val) {
        val = val || []
        const s = {}
        val.forEach(i => (s[i] = true))
        this.selected = s
      }
    }
  },
  watch: {
    selectedUsers: {
      handler(val) {
        this.innerSelectedUsers = this.get_users_id(val)
      },
      deep: true,
      immediate: true
    },
    users: {
      handler(val) {
        if (!val || !this.startLoadData) return
        this.updateUserStatus()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    get_users_id(v) {
      return v && v.map(i => i.id || i) || []
    },
    currentStep(u) {
      const item = this.usersStatus[u] || {}
      return item && item.currentStep
    },
    updateUserStatus() {},
    handleSelected(u, v) {
      this.$set(this.selected, u, v)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/element-variables';
.user-list {
  display: grid;
  grid-template-columns: min-content min-content min-content min-content min-content;
}
.item-description {
  height: 1rem;
  text-align: center;
  color: $--color-primary;
}
</style>
