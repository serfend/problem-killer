<template>
  <el-card>
    <SvgIcon icon-class="edit" @click="edit" />
    <SvgIcon icon-class="delete" @click="remove" />
  </el-card>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'SingleFile',
  components: { SvgIcon },
  methods: {
    edit() {},
    remove() {}
  }
}
</script>

<style>
</style>
