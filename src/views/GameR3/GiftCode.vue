<template>
  <el-card :body-style="cardBackground">
    <el-form label-width="80px">
      <el-form-item label="礼品码">{{ code }}</el-form-item>
      <el-form-item label="分享人">
        <el-tag>{{ from }}</el-tag>
      </el-form-item>
      <el-form-item label="分享时间">{{ shareTime }}</el-form-item>
      <el-card v-if="!valid">{{ invalidDes }}</el-card>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'GiftCode',
  props: {
    code: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: ''
    },
    shareTime: {
      type: String,
      default: ''
    },
    valid: {
      type: Boolean,
      default: false
    },
    invalidDes: {
      type: String,
      default: ''
    },
    gainDate: {
      type: Number,
      default: 0
    },
    gainUser: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    cardBackground() {
      var bck = ''
      if (this.gainDate !== '') {
        bck = '#8fec8f'
      } else {
        bck = '#cccccc'
      }
      return `background:${bck}`
    }
  }
}
</script>
