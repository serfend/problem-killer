<template class="mainbox">
  <div class="panel">
    <div class="h2-title">
      <slot name="title" />
    </div>
    <slot name="chart" />
    <div class="panel-footer" />
  </div>
</template>

<script>
export default {
  name: 'Square'
}
</script>

<style lang="scss" scoped>
.h2-title {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  margin: auto;
}
</style>
