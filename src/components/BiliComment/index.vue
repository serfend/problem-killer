<template>
  <el-card v-if="id">
    <span style="font-size:1.5rem">{{ totalCount }} 评论</span>
    <el-tabs v-model="active_tab" @tab-click="handleClick">
      <el-tab-pane v-for="i in comment_pan" :key="i.name" :label="i.alias" :name="i.name">
        <Comment
          v-if="active_tab==i.name"
          :id="id"
          :ref="i.name"
          :order="i.name"
          :total-count.sync="totalCount"
          @requireDelete="totalCount--"
          @requireAdd="totalCount++"
        >
          <slot v-if="$slots.sender" slot="sender" name="sender" />
        </Comment>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import Comment from './Comment'
const comment_pan = [
  { name: 'as_popularity', alias: '按热度排序' },
  { name: 'as_date', alias: '按时间排序' }
]
export default {
  name: 'Comments',
  components: { Comment },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data: () => ({
    totalCount: '...',
    active_tab: 'as_date',
    comment_pan: comment_pan
  }),
  methods: {
    comp() {
      const mapper = i => this.$refs[i.name] && this.$refs[i.name].length > 0
      const t = comment_pan.find(mapper)
      return this.$refs[t.name]
    },
    handleClick(tab) {
      // const c = this.$refs[tab.name][0]
      // if (!c || !c.reload_page) {
      //   this.$message.error('评论加载失败')
      //   return
      // }
      // c.reload_page()
    }
  }
}
</script>
