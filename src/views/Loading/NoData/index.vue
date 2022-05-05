<template>
  <div class="main">
    <LottieIcon ref="icon" path="/assets/lottie/lottie.empty.json" class="buiding" />
    <div class="title-main">这里没有任何数据...</div>
  </div>
</template>

<script>
export default {
  name: 'DefaultEmpty',
  components: {
    LottieIcon: () => import('@/components/LottieIcon')
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.main {
  background-color: transparent;
  text-align: center;
  display: flex;
  justify-items: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
}
.title-main {
  color: #ccc;
  font-size: 1rem;
}
.buiding {
  width: 5rem;
}
</style>
