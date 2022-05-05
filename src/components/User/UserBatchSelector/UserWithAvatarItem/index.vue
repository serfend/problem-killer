<template>
  <div
    :class="['user-item',innerSelected?'selected':'']"
    @click="handleClick"
    @dblclick="handleDblClick"
  >
    <UserAvatar
      :user="user"
      :style-normal="{'border-radius':'5px'}"
      :class="['user-avatar']"
      size="3rem"
    />
    <div class="user-name">
      <span>{{ summary && summary.realName }}</span>
      <slot name="description" />
    </div>
  </div>
</template>

<script>
import { getUserSummary } from '@/api/user/userinfo'
export default {
  name: 'UserWithAvatarItem',
  components: {
    UserAvatar: () => import('@/components/User/UserAvatar')
  },
  props: {
    user: { type: String, default: null },
    selected: { type: Boolean, default: false }
  },
  data: () => ({
    summary: null,
    inner_selected: false
  }),
  computed: {
    innerSelected: {
      get() {
        return this.inner_selected
      },
      set(val) {
        this.inner_selected = val
        this.$emit('update:selected', val)
        this.$emit('selectedChanged', val)
      }
    }
  },
  watch: {
    user: {
      handler(val) {
        this.refresh()
      },
      immediate: true
    },
    selected: {
      handler(val) {
        this.inner_selected = val
      },
      immediate: true
    }
  },
  methods: {
    handleDblClick() {
      this.$emit('dblClick')
    },
    handleClick() {
      this.innerSelected = !this.innerSelected
    },
    refresh() {
      this.loading = true
      getUserSummary(this.user)
        .then(data => {
          this.summary = data
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin base() {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1rem;
  text-align: center;
}
.user-name {
  cursor: pointer;
  @include base;
}
.user-item {
  user-select: none;
  width: 5rem;
  display: flex;
  flex-direction: column;
  opacity: 0.5;
  transition: all ease 0.5s;
  @include base;
}
.user-avatar {
  cursor: pointer;
  margin: auto !important;
}
.selected {
  opacity: 1;
}
</style>
