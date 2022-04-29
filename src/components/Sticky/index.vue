<template>
  <div :style="{zIndex:zIndex}">
    <div
      :class="className"
      :style="{top:(isSticky ? stickyTop +'px' : ''),zIndex:zIndex,position:position,width:width}"
    >
      <slot>
        <div>sticky</div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sticky',
  props: {
    stickyTop: {
      type: [Number, String],
      default: 0
    },
    zIndex: {
      type: Number,
      default: 1
    },
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      position: '',
      width: undefined,
      isSticky: false
    }
  },
  mounted() {
    const element = this.$root.$el // only on scrolling element can it works
    element.addEventListener('scroll', this.handleScroll)
    element.addEventListener('resize', this.handleResize)
  },
  activated() {
    this.handleScroll()
  },
  destroyed() {
    const element = this.$root.$el // same to above
    element.removeEventListener('scroll', this.handleScroll)
    element.removeEventListener('resize', this.handleResize)
  },
  methods: {
    sticky() {
      if (this.isSticky) return
      this.$emit('sticky')
      this.position = 'fixed'
      this.width = this.width + 'px'
      this.isSticky = true
    },
    handleReset() {
      if (!this.isSticky) return
      this.$emit('reset')
      this.reset()
    },
    reset() {
      this.position = ''
      this.width = 'auto'
      this.isSticky = false
    },
    handleScroll() {
      const width = this.$el.getBoundingClientRect().width
      this.width = width || 'auto'
      const offsetTop = this.$el.getBoundingClientRect().top
      if (offsetTop < this.stickyTop) {
        return this.sticky()
      }
      this.handleReset()
    },
    handleResize() {
      if (this.isSticky) {
        this.width = this.$el.getBoundingClientRect().width + 'px'
      }
    }
  }
}
</script>
