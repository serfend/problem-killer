<template>
  <el-card class="child-nav">
    <transition-group name="slide-fade" tag="ul" class="slide-container" @enter="enter" @before-enter="beforeEnter">
      <li v-for="(i,index) in types" :key="i.name" :index="index" :class="i.class" @click="setActive(i)">
        <VacationType v-model="i.name" :entity-type="vacType" plain :show-tag="false" placement="left" />
      </li>
    </transition-group>
    <div class="nav-remind" style>可按单位/周期/申请类型/排序类型等方式排名</div>
    <div class="nav-remind" style>标记的[休假中]和[请假中]状态为排名产生时的状态，除非筛选为今日，否则与今天实际状态无关。</div>
  </el-card>
</template>

<script>
import Velocity from 'velocity-animate'

export default {
  name: 'TypeNav',
  components: {
    VacationType: () => import('@/components/Vacation/VacationType')
  },
  props: {
    vacType: { type: String, default: null },
    entityType: { type: String, default: null }
  },
  data: () => ({
    types: []
  }),
  computed: {
    v () {
      return this.$store.state.vacation
    }
  },
  watch: {
    vacType: {
      handler (val) {
        if (!val) return
        this.refresh()
      },
      immediate: true
    }
  },
  methods: {
    beforeEnter (el) {
      el.style.opacity = 0
      el.style['right'] = '-20px'
    },
    enter (el, done) {
      const delay = Number(el.getAttribute('index')) * 150
      setTimeout(() => {
        Velocity(el, { right: '0px', opacity: 1 }, { complete: done })
      }, delay)
    },
    focus (v) { },
    setActive (item) {
      this.$emit('update:entityType', item.name)
      this.types.map(i => {
        i.class = ''
      })
      item.class = 'active'
      this.$forceUpdate()
    },
    refresh () {
      const v = this.v
      const items = this.vacType === 'vac' ? v.vacationTypes : v.requestTypes
      const types = Object.values(items)
      this.types = types.map(i => Object.assign(i, { class: '' }))
      this.setActive(this.types[0])
    }
  }
}
</script>
<style lang="scss" scoped>
.nav-remind {
  color: #ff4c4c;
  background: snow;
  padding: 9px 27px;
  border-radius: 8px;
  font-size: 12px;
  margin: 10px 0 0;
}
.child-nav {
  float: left;
  width: 272px;
  background: #fff;
  border-radius: 10px;
  li {
    position: relative;
    text-align: center;
    list-style: none;
    font-size: 14px;
    color: #666;
    padding: 10px;
    border-radius: 13px;
    cursor: pointer;
    &:hover {
      color: #23ade5;
    }
  }

  .active {
    transition: background 0.5s ease;
    background: #23ade5;
    color: #fff;
    &:hover {
      color: #fff;
    }
  }
}
</style>
