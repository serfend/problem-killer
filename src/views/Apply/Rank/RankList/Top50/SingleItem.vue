<template>
  <li class="item normal-item">
    <a :href="data.href" target="_blank">
      <dl>
        <dt>
          <div :class="`rank-number my-info ${isInvalid?'':data.direction}`">
            {{ formatIndex }}
            <span />
          </div>
        </dt>
        <dd>
          <div class="name-info">
            <UserAvatar :user="data.user" class="name-info-avatar">
              <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
            </UserAvatar>
            <span v-if="data.company" style="color:#ccc">{{ data.company }}</span>
            <span v-if="data.title" class="uname">{{ data.title }}</span>
            <i v-if="data.status" class="live">{{ data.status }}</i>
          </div>
          <em class="score">
            <span>{{ data.levelDesc }}</span>
          </em>
        </dd>
      </dl>
    </a>
  </li>
</template>

<script>
export default {
  name: 'SingleItem',
  components: {
    UserAvatar: () => import('@/components/User/UserAvatar')
  },
  props: {
    index: { type: Number, default: 0, require: true },
    data: { type: Object, default: null, require: true }
  },
  computed: {
    formatIndex() {
      const { index } = this
      if (this.isInvalid) return '>50'
      return index && index.toString().padStart(2, '0')
    },
    isInvalid() {
      const { index } = this
      return index > 50 || index <= 0
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style';
@import './style/single-item';
.my-info {
  font-size: 22px;
  font-style: italic;
  position: relative;
  background: #ececec;
  width: 86px;
  height: 34px;
  line-height: 34px;
  border-radius: 20px;
  color: #999;
  padding-left: 10px;
  margin: 7px 0 0 7px;
}
</style>
