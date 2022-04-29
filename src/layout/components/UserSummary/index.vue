<template>
  <div v-if="data" class="SummaryContainer" :style="{'min-height':minHeight}">
    <el-image
      :src="avatar"
      :preview-src-list="[avatar]"
      class="avatar"
      :style="{transform:showout?'':'scale(0)'}"
    />
    <div class="userinfo">
      <div class="username">{{ data.realName }}</div>
      <el-tag class="userduties">{{ data.dutiesName }}</el-tag>
      <el-tag class="userduties">{{ data.userTitle }}</el-tag>
    </div>
    <div v-if="vacation" style="width:100%">
      <div style="height:0.7em" />
      <div class="menu-divider" />
      <VacationSummary style="margin:0.3em" :data="vacation" />
      <div class="menu-divider" />
    </div>
  </div>
</template>

<script>
import VacationSummary from './VacationSummary'
export default {
  name: 'UserSummary',
  components: { VacationSummary },
  model: {
    prop: 'data',
    event: 'changed'
  },
  props: {
    avatar: {
      type: String,
      default: null
    },
    data: {
      type: Object,
      default: null
    },
    vacation: {
      type: Object,
      default: null
    },
    showout: {
      type: Boolean,
      default: false
    },
    minHeight: {
      type: String,
      default: '20rem'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../menu-divider.scss';
.SummaryContainer {
  min-height: 3rem;
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-align: center;
  align-items: center;
  .userinfo {
    margin-top: 1.5rem;
    font-weight: 600;
    text-align: center;
    .username {
      color: --color-primary;
      font-size: 2rem;
    }
    .userduties {
      color: --color-primary;
    }
  }

  .avatar {
    transition: all 0.5s ease;
    position: absolute;
    cursor: pointer;
    top: -3.5rem;
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 50%;
  }
}
</style>
