<template>
  <div>
    <el-color-picker
      v-if="Object.prototype.toString.call(innerData)==='[object String]'"
      v-model="innerData"
    />
    <div v-else style="display:flex;">
      <div v-for="(item,index) in innerData" :key="index" class="color-selector">
        <el-color-picker v-model="innerData[index]" />
        <i class="el-icon-close delete-btn" @click="innerData.splice(index,1)" />
      </div>
      <el-button icon="el-icon-plus" style="height:36px" @click="innerData.push('#000000')" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorsPicker',
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: {
      type: [Array, String],
      default: () => []
    }
  },
  data: () => ({
    innerData: []
  }),
  watch: {
    data: {
      handler(val) {
        this.innerData = val
      },
      immediate: true
    },
    innerData: {
      handler(val) {
        this.$emit('change', this.innerData)
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.list-picker {
  display: inline-flex;
  align-items: center;
}
.color-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  .delete-btn {
    transition: all 0.5s;
    transform: scale(0);
  }
  &:hover {
    .delete-btn {
      transform: scale(1);
      &:hover {
        cursor: pointer;
        color: #800;
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
