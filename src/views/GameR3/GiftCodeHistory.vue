<template>
  <el-card>123</el-card>
</template>

<script>
import { giftCodeHistory } from '@/api/game'
import GiftCode from './GiftCode'
export default {
  name: 'GiftCodeHistory',
  compoents: {
    GiftCode
  },
  data() {
    return {}
  },
  mounted() {
    giftCodeHistory().then(d => console.log(d))
  }
}
</script>
