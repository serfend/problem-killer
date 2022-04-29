<template>
  <el-card>
    <slot name="header">
      <el-badge
        :hidden="validGiftcodeCount==0"
        :value="validGiftcodeCount"
        type="primary"
        style="width:100%"
      >
        <el-button
          :loading="refreshingGiftCodeLoading"
          style="width:100%"
          @click="refreshGiftCode"
        >{{ title }}</el-button>
      </el-badge>
    </slot>
    <el-collapse>
      <el-collapse-item v-for="item in innerList" :key="item.code.id">
        <template slot="title">
          <div v-if="item.gainDate>0">{{ format(item.gainDate) }}</div>
          <el-tag v-if="item.gainUser" effect="dark">{{ item.gainUser }}</el-tag>
          <el-tag :type="item.gainDate==0?(item.valid?'success':'danger'):'info'">{{ item.code }}</el-tag>
        </template>
        <GiftCode
          :code="item.code"
          :from="item.from"
          :share-time="item.time"
          :valid="item.valid"
          :invalid-des="item.invalidDes"
          :gain-date="item.gainDate"
        />
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script>
import { formatTime } from '@/utils'
import GiftCode from './GiftCode'
import { parseTime } from '@/utils'

export default {
  name: 'UserShareCode',
  components: {
    GiftCode
  },
  props: {
    title: { type: String, default: '' },
    codeApi: { type: Function, default: () => () => {} },
    codelist: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      refreshingGiftCodeLoading: false,
      innerList: []
    }
  },
  computed: {
    validGiftcodeCount() {
      if (!this.innerList) return 0
      return this.innerList.filter(f => f.valid && f.gainDate === '').length
    }
  },
  watch: {
    codeList: {
      handler(val) {
        this.innerList = val
      },
      immediate: true,
      deep: true
    },
    innerList: {
      handler(val) {
        this.$emit('update:codeList', val)
      },
      deep: true
    }
  },
  mounted() {
    this.refreshGiftCode()
  },
  methods: {
    format(time) {
      var date = new Date(time)
      return formatTime(date)
    },
    parseTime,
    refreshGiftCode(pageIndex) {
      this.refreshingGiftCodeLoading = true
      this.codeApi(pageIndex).then(d => {
        this.refreshingGiftCodeLoading = false
        this.innerList = d.list.map(i => {
          var c = i.code
          return {
            from: c.shareBy,
            code: c.code,
            time: c.shareTime,
            valid: c.valid,
            invalidDes: c.statusDescription,
            gainDate: i.gainStamp,
            gainUser: i.user
          }
        })
      })
    }
  }
}
</script>
