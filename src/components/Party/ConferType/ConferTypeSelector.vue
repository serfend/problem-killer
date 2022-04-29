<template>
  <el-select v-model="inner_value" :multiple="multi" clearable collapse-tags>
    <el-option
      v-for="(item) in types.filter(i=>i.value>=valueRange[0] && i.value<=valueRange[1])"
      :key="item.id"
      :value="item.value"
      :label="item.alias"
      :disabled="isDisabled(item)"
      style="width:auto;"
    >
      <Index :type="item.value" />
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ConferTypeSelector',
  components: {
    Index: () => import('./index')
  },
  model: {
    event: 'change',
    prop: 'value'
  },
  props: {
    value: { type: [Number, Array], default: null },
    valueRange: { type: Array, default: () => [1, 999] },
    except: { type: Array, default: null },
    multi: { type: Boolean, default: false }
  },
  data: () => ({
    inner_value_value: null
  }),
  computed: {
    inner_value: {
      set(val) {
        val = val || (this.multi ? [] : 0)
        this.inner_value_value = val
        this.$emit('update:value', val)
        this.$emit('change', val)
      },
      get() {
        return this.inner_value_value
      }
    },
    types() {
      return this.$store.state.party.conferTypes || []
    },
    exceptDict() {
      const dict = {}
      if (!this.except) return dict
      this.except.forEach(i => {
        dict[i] = true
      })
      return dict
    }
  },
  watch: {
    value: {
      handler(val) {
        this.inner_value_value = val
      },
      immediate: true
    }
  },
  methods: {
    isDisabled(item) {
      return this.exceptDict[item.value]
    }
  }
}
</script>
