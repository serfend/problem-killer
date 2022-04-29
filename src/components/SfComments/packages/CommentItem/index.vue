<template>
  <div class="comments-item">
    <div class="pull-left">
      <el-image v-if="avatar" class="avatar-32" :src="avatar" alt @click="handleClickAvatar" />
    </div>
    <div class="comments-box">
      <div class="comments-trigger">
        <div class="pull-right comments-option">
          <span
            v-for="item in tools"
            :key="item.name"
            class="comments-author ml10"
            data-placement="top"
            :title="item.title"
            @click="handleClickTool($event, item)"
          >
            <i v-if="item.icon" :class="item.icon" />
            <span v-if="item.text">{{ item.text }}</span>
          </span>
        </div>
        <strong>
          <a target="_blank" href="javascript:void(0)" @click="handleClickAuthor">{{ author }}</a>
        </strong>
        <span class="comments-date">· {{ time }}</span>
      </div>
      <div class="comments-content">
        <p>{{ content }}</p>
      </div>
      <p class="comments-ops">
        <span class="comments-reply-btn ml15" @click="handleLike">
          <svg-icon :icon-class="liked?'like_filled':'like'" />
          <span v-if="likes>0">{{ likes }}</span>
        </span>
        <span class="comments-reply-btn ml15" @click="handleAddReply">
          <svg-icon icon-class="message" />评论
        </span>
      </p>
      <div v-show="hasReply" class="reply-list">
        <slot />
      </div>
      <div class="reply-item reply-item--ops">
        <el-input>
          <svg-icon icon-class="message" />
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: {
    avatar: {
      type: String,
      default: ''
    },
    author: { type: String, default: '' },
    content: { type: String, default: '' },
    liked: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    tools: { type: Array, default: () => [] },
    time: { type: String, default: '' },
    hasReply: { type: Boolean, default: false }
  },
  data() {
    return {
      innerLiked: false
    }
  },
  watch: {
    innerLiked: {
      handler(val) {
        this.$emit('update:liked', val)
      },
      immediate: true
    },
    liked: {
      handler(val) {
        this.innerLiked = val
      },
      immediate: true
    }
  },
  methods: {
    handleClickAvatar(event) {
      event.stopPropagation()
      this.$emit('clickAvatar', this)
    },
    handleClickTool(event, tool) {
      event.stopPropagation()
      this.$emit('clickTool', this, tool)
    },
    handleClickAuthor(event) {
      event.stopPropagation()
      this.$emit('clickAuthor', this)
    },
    handleAddReply(event) {
      event.stopPropagation()
      this.$emit('addReply', this)
    },
    handleLike(event) {
      event.stopPropagation()
      this.innerLiked = !this.innerLiked
    }
  }
}
</script>

<style scoped>
img {
  border: 0;
  vertical-align: middle;
}
.ml10 {
  margin-left: 10px !important;
}
.ml15 {
  margin-left: 15px !important;
}
.comments-item {
  padding: 15px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  font-size: 14px;
}
.pull-left {
  float: left !important;
}
.pull-right {
  float: right !important;
}
.avatar-32 {
  width: 32px;
  height: 32px;
  border-radius: 10%;
}
.comments-author {
  color: #009a61;
  text-decoration: none;
  background: transparent;
}
.comments-author:hover,
.comments-author:active,
.comments-author:focus {
  outline: 0;
}
.comments-box {
  padding-left: 47px;
}
.comments-box strong {
  font-weight: bold;
}
.comments-trigger {
  margin-bottom: 10px;
  color: #999;
  font-size: 13px;
}
.comments-content {
  line-height: 1.6;
  word-wrap: break-word;
  margin-bottom: 10px !important;
}
.comments-content::before,
.comments-content::after {
  display: table;
}
.comments-content::after {
  content: "";
  clear: both;
}
.comments-ops {
  margin: 0;
  color: #999;
  font-size: 13px;
}
.comments-reply-btn {
  cursor: pointer;
}
.comments-like {
  color: rgb(218, 54, 54);
  fill: rgb(218, 54, 54);
}
.reply-list {
  margin-top: 10px;
  font-size: 13px;
  background-color: #fafafa;
  padding: 0 10px;
  color: #666;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
}
.reply-item--ops {
  border-bottom: none;
}
.reply-item {
  padding-bottom: 10px;
  padding-top: 10px;
  word-break: break-word;
}
</style>
