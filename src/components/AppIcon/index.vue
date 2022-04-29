<template>
  <el-tooltip placement="top" effect="dark" :content="description">
    <div
      :style="{ width:size+'rem',height:size+'rem',cursor:disabled?'not-allowed':'pointer',filter:disabled?'grayscale(1)':'',opacity:disabled?0.5:1}"
    >
      <el-image
        v-if="icon"
        :class="isActive?'icon-buttonactive':'icon-button'"
        :src="icon"
        @click="onClick"
        @mouseenter="activeMe"
        @mouseleave="disactiveMe"
      />
      <svg-icon
        v-if="svg"
        :icon-class="svg"
        :class="isActive?'icon-buttonactive':'icon-button'"
        @click="onClick"
        @mouseenter="activeMe"
        @mouseleave="disactiveMe"
      />
      <div
        :class="isActive?'icon-labelactive':'icon-label'"
        :style="{'font-size':(size/5)+'rem',cursor:'pointer'}"
        @click="onClick"
        @mouseenter="activeMe"
        @mouseleave="disactiveMe"
      >{{ label }}</div>
    </div>
  </el-tooltip>
</template>

<script>
export default {
  name: 'AppIcon',
  props: {
    svg: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: '无'
    },
    size: {
      type: Number,
      default: 3
    },
    description: {
      type: String,
      default: '无'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    onClick() {
      if (this.disabled) return this.$message.error('选项被禁用')
      this.$emit('click')
    },
    activeMe() {
      if (this.disabled) return
      this.isActive = true
      this.$forceUpdate()
    },
    disactiveMe() {
      if (this.disabled) return
      this.isActive = false
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-button {
  border-radius: 10%;
  color: #fff;
  background-color: #33f;
  opacity: 0.7;
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 1);
  transition: all 0.5s;
  user-select: none;
}
.icon-buttonactive {
  border-radius: 10%;
  color: #fff;
  background-color: #009;
  opacity: 1;
  width: 100%;
  height: 100%;
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
  transform: translateY(4px);
  transition: all 0.2s;
  cursor: pointer;
  user-select: none;
}
.icon-label {
  border-radius: 0.2rem;
  background-color: #33f;
  opacity: 0.8;
  text-align: center;
  color: #fff;
  transition: all 0.5s;
  box-shadow: 2px 2px 1px 1px rgba(0, 0, 0, 0.7);
  margin: 1rem 0;
  user-select: none;
}

.icon-labelactive {
  border-radius: 0.1rem;
  background-color: #33a;
  opacity: 0.8;
  text-align: center;
  color: #fff;
  transform: translateY(1rem) scale(1.2);
  transition: all 0.5s;
  user-select: none;
}
</style>
