<template>
  <span
    v-waves
    :class="['single-item',isSelector?'selector':null,inner_selected?'selected':null]"
    @click="handleClick"
  >
    <el-tag
      v-if="type"
      :style="{'margin-right':'0.5rem','background-color':type.color}"
      effect="dark"
    >{{ type.alias }}</el-tag>
    <el-tag v-else type="info">未知类型</el-tag>
    <el-tooltip class="item" effect="dark" :content="item.alias" placement="top">
      <span class="item-alias">{{ item.alias }}</span>
    </el-tooltip>
  </span>
</template>

<script>
import waves from '@/directive/waves'
import { groupDetail } from '@/api/zzxt/party-group'
export default {
  name: 'PartyGroup',
  directives: {
    waves
  },
  model: {
    prop: 'id',
    event: 'change'
  },
  props: {
    id: { type: String, default: null },
    data: { type: Object, default: null },
    isSelector: { type: Boolean, default: false },
    selected: { type: Boolean, default: false }
  },
  data: () => ({
    inner_data: null,
    loading: false,
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
    partyGroupTypeDict() {
      return this.$store.state.party.partyGroupTypeDict
    },
    type() {
      const type = this.partyGroupTypeDict
      if (!type || !type[this.item.level]) return null
      return type[this.item.level]
    },
    item() {
      return (
        this.data ||
        this.inner_data || {
          alias: '未选择'
        }
      )
    }
  },
  watch: {
    selected: {
      handler(val) {
        this.inner_selected_value = val
      },
      immediate: true
    },
    id: {
      handler(val) {
        if (!val) return
        this.refresh()
      },
      immediate: true
    }
  },
  methods: {
    refresh() {
      const id = this.id
      this.loading = true
      groupDetail({ group: id })
        .then(data => {
          this.inner_data = data.model
          this.$emit('update:data', this.inner_data)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleClick() {
      if (!this.isSelector) return
      this.inner_selected = !this.inner_selected
      this.$emit('click')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/element-variables';
.single-item {
  transition: all 0.5s ease;
  border-radius: 5px;
  box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.5);
  padding: 0.5rem;
  width: 12rem;
  display: flex;
  align-items: center;
  color: $--color-text-regular;
}
.selector {
  cursor: pointer;
  user-select: none;
}
.selected {
  box-shadow: 0 2px 12px 0 rgba(24, 118, 224, 0.5);
  background-color: $--color-primary;
  color: $--border-color-light;
}
.item-alias {
  color: #555;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
