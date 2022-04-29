<template>
  <div class="list-nav">
    <ul class="nav">
      <li
        v-for="i in list"
        :key="i.name"
        :class="`${i.class}`"
        style="transition:all 0.3s ease"
        @click="setActive(i)"
      />
    </ul>
  </div>
</template>

<script>
const types = ['vac-length', 'vac-times', 'inday-times', 'inday-length']
export default {
  name: 'EntityTypeNav',
  props: {
    vacType: { type: String, default: null },
    levelType: { type: String, default: null }
  },
  data: () => ({
    list: []
  }),
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.list = types.map(i => ({ name: i, class: i }))
      this.setActive(this.list[0])
    },
    setActive(item) {
      this.list.map(i => {
        i.class = i.name
      })
      item.class += ` ${item.name}-active`
      const newVac = item.name.indexOf('vac') >= 0 ? 'vac' : 'inday'
      this.$emit('update:vacType', newVac)
      const newLev = item.name.indexOf('times') >= 0 ? 'c' : 'l'
      this.$emit('update:levelType', newLev)
    }
  }
}
</script>
<style lang="scss" scoped>
.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 1160px;
  margin: 0 auto;
  overflow: hidden;
  li {
    list-style: none;
    height: 184px;
    width: 272px;
    float: left;
    cursor: pointer;
  }
  .vac-length {
    background: url(~@/assets/pngs/nav/nav-vac-length.png) no-repeat bottom;
    background-size: contain;
  }
  .vac-length-active {
    background: url(~@/assets/pngs/nav/nav-vac-length-active.png) no-repeat
      bottom;
    background-size: contain;
  }
  .vac-times {
    background: url(~@/assets/pngs/nav/nav-vac-times.png) no-repeat bottom;
    background-size: contain;
  }

  .vac-times-active {
    background: url(~@/assets/pngs/nav/nav-vac-times-active.png) no-repeat
      bottom;
    background-size: contain;
  }

  .inday-times {
    background: url(~@/assets/pngs/nav/nav-inday-times.png) no-repeat bottom;
    background-size: contain;
  }
  .inday-times-active {
    background: url(~@/assets/pngs/nav/nav-inday-times-active.png) no-repeat
      bottom;
    background-size: contain;
  }
  .inday-length {
    background: url(~@/assets/pngs/nav/nav-inday-length.png) no-repeat bottom;
    background-size: contain;
  }
  .inday-length-active {
    background: url(~@/assets/pngs/nav/nav-inday-length-active.png) no-repeat
      bottom;
    background-size: contain;
  }
}
</style>
