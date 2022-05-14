<template>
  <el-button :disabled="!canRefresh" :class="['btn-refresh',canRefresh?'active':'disactive']" type="text" @click="$emit('click')">{{ placeholder }}</el-button>
</template>

<script>
export default {
  name: 'BtnActivatable',
  props: {
    placeholder: { type: String, default: '数据变化 点击刷新' },
    canRefresh: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
.btn-refresh{
  transition: all ease 0.5s;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  font-size: 1.5rem;
  &:hover{
    color:#00ff2a;
  }
  opacity: 0.1;
  &.active{
    animation:flashing-opacity 1s infinite;
  }
}
@keyframes flashing-opacity
{
    0% {opacity: 1;}
    50% {
      opacity: 0;
      transform: translateX(1rem);
    }
    100% {opacity: 1;}
}
</style>
