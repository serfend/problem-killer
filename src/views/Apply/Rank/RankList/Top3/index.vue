<template>
  <div>
    <ul class="top3">
      <RankAvatar v-for="(i,index) in formatList" :key="index" :data="i" :index="[2,1,3][index]" />
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Top3',
  components: {
    RankAvatar: () => import('./RankAvatar')
  },
  props: {
    list: { type: Array, default: null, comments: 'require list length === 3' }
  },
  computed: {
    formatList() {
      const need_padding = 3 - ((this.list && this.list.length) || 0)
      const list = this.list.slice(0, 3).concat(this.buildList(need_padding))
      return [list[1], list[0], list[2]]
    }
  },
  methods: {
    buildList(count) {
      const list = new Array(count).fill(0).map(i => ({
        title: '虚位以待',
        direction: 'balance'
      }))
      return list
    }
  }
}
</script>

<style lang="scss" scoped>
.top3 {
  width: 666px;
  overflow: hidden;
  margin: 0 auto;
}
</style>
