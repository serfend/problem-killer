<template>
  <el-select v-if="types" v-model="innerValue" :multiple="multi" clearable>
    <el-option
      v-for="(item) in types.filter(i=>i.value>=valueRange[0] && i.value<=valueRange[1])"
      :key="item.id"
      :value="item.value"
      :label="item.alias"
      :disabled="isDisabled(item)"
    >
      <Index :type="item.value" />
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'TypeInPartySelector',
  components: {
    Index: () => import('./index')
  },
  model: {
    event: 'change',
    prop: 'value'
  },
  props: {
    value: { type: [Number, Array], default: 0 },
    valueRange: { type: Array, default: () => [1, 999] },
    except: { type: Array, default: null },
    multi: { type: Boolean, default: false }
  },
  data: () => ({
    inner_value: null
  }),
  computed: {
    innerValue: {
      set(val) {
        val = val === undefined ? (this.multi ? [] : 0) : val
        this.inner_value = val
        this.$emit('update:value', val)
        this.$emit('change', val)
      },
      get() {
        return this.inner_value
      }
    },
    types() {
      return this.$store.state.party.typeInParty || []
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
        if (Array.isArray(val)) return
        if (Number.isInteger(val)) return
        this.innerValue = null
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
