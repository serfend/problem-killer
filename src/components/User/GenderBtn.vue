<template>
  <el-radio-group v-model="innerGender" size="small" fill="#ccc">
    <el-radio-button
      v-for="btn in genderButton"
      :key="btn.value"
      :label="btn.value"
      :disabled="disabled"
    >
      <i :class="btn.icon" :style="{color:btn.background}" />
      <span :style="{color:btn.background}">{{ btn.name }}</span>
    </el-radio-button>
  </el-radio-group>
</template>

<script>
export default {
  name: 'GenderBtn',
  model: {
    prop: 'gender',
    event: 'change',
  },
  props: {
    gender: { type: Number, default: 1, },
    disabled: { type: Boolean, default: true, },
    data: { type: Object, default: () => ({}), },
  },
  data: () => ({
    innerGender: 0,
    genderButton: [
      {
        value: 1,
        name: '男',
        icon: 'el-icon-male',
        background: '#46B6ef',
      },
      // {
      //   value: 0,
      //   name: '未知',
      //   icon: 'el-icon-question',
      //   background: '#777777'
      // },
      {
        value: 2,
        name: '女',
        icon: 'el-icon-female',
        background: '#f37e7d',
      },
    ],
  }),
  watch: {
    gender: {
      handler(val) {
        this.innerGender = val
      },
      immediate: true,
    },
    innerGender: {
      handler(val) {
        this.$emit('update:gender', val)
        this.$emit('change', val)
        const datas = this.genderButton.filter((i) => i.value === val)
        const data = datas.length === 1 ? Object.assign(datas[0]) : null
        this.$emit('update:data', data)
      },
    },
  },
}
</script>

<style>
</style>
