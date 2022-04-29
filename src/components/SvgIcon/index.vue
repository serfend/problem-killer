<template>
  <svg :class="svgClass" :style="styleNormal" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    defaultIconClass: {
      type: String, // 默认图标，当iconClass不存在时生效
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    styleNormal: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: null
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  vertical-align: -0.15em;
  fill: currentColor;
  width: 1em;
  height: 1em;
}
.svgLink {
  cursor: pointer;
  transition: all 0.5s;
  &:hover {
    color: #25f;
  }
}
</style>
