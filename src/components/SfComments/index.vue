<template>
  <el-main>
    <comment-item
      v-for="comment in comments"
      :key="comment.id"
      :avatar="comment.avatar"
      :author="comment.author"
      :content="comment.content"
      :time="comment.create"
      :has-reply="comment.replies && comment.replies.length > 0"
      @clickAvatar="handleClickAvatar(comment)"
      @clickAuthor="handleClickAuthor(comment)"
      @addReply="handleAddReply(comment)"
    >
      <reply-item
        v-for="reply in comment.replies"
        :key="reply.id"
        :avatar="reply.avatar"
        :author="reply.author"
        :content="reply.content"
        :time="reply.create"
        @clickAuthor="handleClickAuthor"
        @clickTool="handleClickTool"
      />
    </comment-item>
  </el-main>
</template>
<script>
import CommentItem from './packages/CommentItem'
import ReplyItem from './packages/ReplyItem'

export default {
  name: 'SfComments',
  components: { ReplyItem, CommentItem },
  props: {
    comments: { type: Array, default() { return this.innerComments } }
  },
  data() {
    return {
      innerComments: []
    }
  },
  methods: {
    handleClickAvatar(item) {
      console.log('点击了头像')
    },
    handleClickAuthor(item) {
      console.log('点击了用户')
    },
    handleAddReply(item) {
      console.log(item)
    },
    handleClickTool(item, tool) {
      console.log(item)
    }
  }
}
</script>
