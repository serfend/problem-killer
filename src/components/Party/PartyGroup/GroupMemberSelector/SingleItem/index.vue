<template>
  <div v-waves>
    <div
      v-loading="loading"
      :class="['single-item',inner_selected?'selected':null,disabled?'disabled':null]"
      @click="handleClick"
    >
      <span>
        <div v-loading="loading_avatar" class="user-avatar-container">
          <el-image
            v-if="!loading_avatar && (avatar||defaultAvatar)"
            :src="avatar||defaultAvatar"
            :preview-src-list="[avatar]"
            class="user-avatar"
          />
        </div>
      </span>
      <div class="user-name">{{ companyAndDuties }}</div>
    </div>
  </div>
</template>

<script>
import defaultAvatar from '@/assets/plain/defaultAvatar.js'
import { getUserAvatar } from '@/api/user/userinfo'
import waves from '@/directive/waves'
export default {
  name: 'GroupTypeSelectorSingleItem',
  components: {},
  directives: { waves },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: { type: Object, default: null },
    selected: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  data: () => ({
    defaultAvatar,
    avatar: null,
    loading: false,
    loading_avatar: false,
    inner_selected_value: false
  }),
  computed: {
    inner_selected: {
      get() {
        return this.inner_selected_value
      },
      set(val) {
        this.inner_selected_value = val
        this.$emit('update:selected', val)
      }
    },
    companyAndDuties() {
      const d = this.data
      return `${d.companyAndDuty} ${d.userRealName}`
    }
  },
  watch: {
    'data.id': {
      handler(val) {
        this.load_avatar()
      },
      immediate: true
    }
  },
  methods: {
    handleClick() {
      if (this.disabled) return this.$message.error('禁用项,不可选')
      this.inner_selected = !this.inner_selected
      this.$emit('onSelect', this.inner_selected)
    },
    load_avatar() {
      this.loading_avatar = true
      const { userName } = this.data
      getUserAvatar(userName, null, true)
        .then(d => {
          this.avatar = d.url
        })
        .finally(() => {
          this.loading_avatar = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/element-variables';
.selected {
  background-color: #0000002f;
  .user-name {
    color: $--color-primary !important;
  }
}
.disabled {
  background-image: repeating-linear-gradient(
    45deg,
    #ffffff2f,
    #ffffff4f 9px,
    #0000002f 0,
    #0000004f 18px
  );
  cursor: no-drop !important;
}
.single-item {
  width: 100%;
  overflow: hidden;
  transition: all 0.5s ease;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  opacity: 0.8;
  cursor: pointer;
  user-select: none;
  &:hover {
    opacity: 1;
    .item-remove {
      margin-left: 0;
      margin-right: 0.5rem;
      opacity: 1;
    }
  }
  padding: 0 0.5rem 0 0.5rem;
  .item-remove {
    transition: all 0.5s ease;
    display: flex;
    :hover {
      color: #f00;
    }
    margin-left: -1rem;
    opacity: 0;
    color: #888;
  }
  .user-name {
    font-size: 10px;
    color: #888;
    width: 80%;
  }
}
.user-avatar-container {
  margin: 0 1rem 0 0;
  display: flex;
  .user-avatar {
    height: 40px;
    width: 40px;
    border-radius: 50%;
  }
}
</style>
