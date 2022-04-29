<template>
  <div>
    <sf-comments :comments.sync="comments" />
  </div>
</template>

<script>
import SfComments from '@/components/SfComments'
export default {
  name: 'Comments',
  components: { SfComments },
  data() {
    return {
      comments: [
        {
          id: '1',
          avatar: '',
          author: '管理员',
          content: '测试朋友圈功能',
          create: '2020-1-6 16:32',
          likes: 142,
          replies: [
            {
              author: '群众',
              content: '测试评论功能',
              create: '2020-1-6 03:14',
              avatar: ''
            }
          ]
        }
      ]
    }
  },
  methods: {}
}
</script>

<style>
</style>
