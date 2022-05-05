<template>
  <span class="clickable" @dblclick="clipBoard(content||label,$event)">{{ label }}</span>
</template>

<script>
import clipBoard from '@/utils/clipboard'
export default {
  name: 'CopyableLabel',
  props: {
    label: {
      type: String,
      default: null
    },
    content: {
      type: String,
      default: null
    }
  },
  methods: {
    clipBoard
  }
}
</script>
<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
</style>
