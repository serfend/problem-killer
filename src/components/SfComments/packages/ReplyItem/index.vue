<template>
  <div class="reply-item">
    <div class="pull-left">
      <el-image v-if="avatar" class="avatar-32" :src="avatar" alt @click="handleClickAuthor" />
    </div>
    <div class="comments-box">
      <div class="comment-func inline-block">
        <span class="pull-right comment-tools ml15">
          <span
            v-for="item in tools"
            :key="item.name"
            class="ml10"
            data-placement="top"
            :title="item.title"
            @click="handleClickTool($event, item)"
          >
            <i v-if="item.icon" :class="item.icon" />
            <span v-if="item.text">{{ item.text }}</span>
          </span>
        </span>
        <span class="comment-meta inline-block">
          <span class="comment-author" @click="handleClickAuthor($event)">{{ author }}</span>
          <span class="comments-date">{{ time }}</span>
        </span>
        <div class="reply-content">
          <p>{{ content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReplyItem',
  props: {
    avatar: {
      type: String,
      default: ''
    },
    author: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    tools: {
      type: Array,
      default() {
        return []
      }
    },
    time: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    handleClickTool(event, tool) {
      event.stopPropagation()
      this.$emit('clickTool', this, tool)
    },
    handleClickAuthor(event) {
      event.stopPropagation()
      this.$emit('clickAuthor', this)
    }
  }
}
</script>

<style scoped>
.avatar-32 {
  width: 32px;
  height: 32px;
  border-radius: 10%;
}
.comments-box {
  padding-left: 47px;
}
.comments-box strong {
  font-weight: bold;
}
.ml10 {
  margin-left: 10px !important;
}
.ml15 {
  margin-left: 15px !important;
}
.pull-left {
  float: left !important;
}
.pull-right {
  float: right !important;
}
.reply-item {
  padding-bottom: 10px;
  padding-top: 10px;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.09);
  word-break: break-word;
}
.comment-author {
  color: #009a61;
  text-decoration: none;
  background: transparent;
}
.comment-author:hover,
.comment-author:active,
.comment-author:focus {
  outline: 0;
}
.reply-item p {
  margin-bottom: 5px;
}
.comment-meta {
  color: #999;
}
.inline-block {
  display: inline-block;
}
</style>
