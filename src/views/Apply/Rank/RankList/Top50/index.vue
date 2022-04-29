<template>
  <div class="top50-container">
    <div class="scroll-container ps ps--theme_default ps--active-y">
      <ul class="top50">
        <SingleItem v-for="(i) in formatList" :key="i.user" :index="i.rank" :data="i" />
        <SingleItem v-if="formatSelf" :data="formatSelf" :index="formatSelf.rank" />
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Top50',
  components: {
    SingleItem: () => import('./SingleItem')
  },
  props: {
    list: { type: Array, default: null },
    self: { type: Object, default: null }
  },
  data: () => ({}),
  computed: {
    formatList() {
      return this.list
    },
    formatSelf() {
      return this.self
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.top50-container {
  margin-top: 20px;
  border-radius: 10px;
  overflow: scroll;
  height: 336px;
}

.scroll-container {
  position: relative;
  overflow: hidden;
  // height: 288px;
}

.top50 {
  background: #fff;
}
</style>
