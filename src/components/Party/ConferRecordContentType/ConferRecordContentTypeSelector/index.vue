<template>
  <div>
    <el-select v-show="filtedTypes && filtedTypes.length" v-model="inner_value" clearable>
      <el-option
        v-for="(item) in filtedTypes"
        :key="item.id"
        :value="item.value"
        :label="item.alias"
        :disabled="isDisabled(item)"
      >
        <Index :type="item.value" />
      </el-option>
    </el-select>
    <div v-show="!filtedTypes || !filtedTypes.length">当前无任何类型可选,请先限定会议记录类型</div>
  </div>
</template>

<script>
import { distinct } from '@/utils'
export default {
  name: 'ConferRecordContentTypeSelector',
  components: {
    Index: () => import('./index')
  },
  model: {
    event: 'change',
    prop: 'value'
  },
  props: {
    value: { type: Number, default: 0 },
    valueRange: { type: Array, default: () => [1, 999] },
    except: { type: Array, default: null },
    conferType: { type: Number, default: 0 },
    recordTypes: { type: Array, default: null }
  },
  data: () => ({
    inner_value_value: null
  }),
  computed: {
    inner_value: {
      set(val) {
        val = val || 0
        this.inner_value_value = val
        this.$emit('update:value', val)
        this.$emit('change', val)
      },
      get() {
        return this.inner_value_value
      }
    },
    shouldDisabledByCrash() {
      const { recordTypes } = this // 当前限定范围
      const target = this.conferRecordContentTypesTarget // 使用缓存的命中
      const list = recordTypes.map(i => target.records[i]).flat()
      const dict = {}
      list.forEach(i => {
        if (!dict[i]) dict[i] = 0
        dict[i]++
      })
      const shouldDisables = Object.keys(dict).filter(
        i => dict[i] < recordTypes.length
      )
      const result = {}
      shouldDisables.forEach(i => {
        result[i] = true
      })
      return result
    },
    filtedTypes() {
      const { recordTypes, conferType } = this // 当前限定范围
      const target = this.conferRecordContentTypesTarget // 使用缓存的命中
      const list = recordTypes.map(i => target.records[i]).flat()
      const typesForRecord = distinct(list)
      const typesForRecordDict = {}
      typesForRecord.forEach(v => {
        typesForRecordDict[v] = true
      })
      const typesForConfer = target.confer.get(conferType)
      const dict = this.conferRecordContentTypesDict
      const types = typesForConfer // 本会议所含类型
        .filter(i => typesForRecordDict[i]) // 本类型们所含类型
        .map(i => dict[i]) // 转换为实体
      const v = this.valueRange // 用户筛选
      const userFilter = types.filter(i => i.value >= v[0] && i.value <= v[1])
      return userFilter
    },
    conferRecordContentTypesTarget() {
      return this.$store.state.party.conferRecordContentTypesTarget
    },
    conferRecordContentTypesDict() {
      return this.$store.state.party.conferRecordContentTypesDict
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
      const userDisabled = this.exceptDict[item.value]
      const crashDisabled = this.shouldDisabledByCrash[item.value]
      return userDisabled || crashDisabled
    }
  }
}
</script>
