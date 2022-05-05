<template>
  <div v-if="id" v-infinite-scroll="load_page" v-loading="loading_whole">
    <slot v-if="$slots.sender" name="sender" />
    <CommentSender v-show="!$slots.sender" :id="id" ref="default_sender" @newContent="newContent" />
    <el-divider />
    <SingleComment
      v-for="(i,index) in list"
      :key="i.id"
      :data.sync="list[index]"
      @requireDelete="newContent"
      @newContent="newContent"
    />
    <div class="footer">
      <el-button
        v-loading="loading_next"
        :disabled="!hasNextPage"
        type="text"
        @click="load_page(false)"
      >{{ hasNextPage?'查看更多':'没有更多啦~' }}</el-button>
    </div>
    <div v-if="list.length>10">
      <slot v-if="$slots.sender" name="sender" />
      <CommentSender v-else :id="id" @newContent="newContent" />
    </div>
  </div>
</template>

<script>
import CommentSender from './CommentSender'
import SingleComment from './SingleComment'
import { getComments } from '@/api/apply/attach_info'
export default {
  name: 'BiliComment',
  components: { SingleComment, CommentSender },
  props: {
    id: {
      type: String,
      default: null
    },
    totalCount: {
      type: [Number, String],
      default: null
    },
    order: {
      type: String,
      default: null
    }
  },
  data: () => ({
    loading_whole: false,
    loading_next: false,
    list: [],
    beenLoadInit: false,
    current_page: -1,
    current_page_size: 5
  }),
  computed: {
    hasNextPage() {
      return (
        !this.beenLoadInit ||
        this.totalCount > (this.current_page + 1) * this.current_page_size
      )
    }
  },
  watch: {
    id: {
      handler(val) {
        this.reload_page()
      },
      immediate: true
    }
  },
  methods: {
    send_content(content, cb) {
      console.log(this.$refs.default_sender)
      this.$refs.default_sender.send_to({ content, cb })
    },
    newContent(item) {
      this.reload_page()
    },
    async reload_page() {
      this.loading_whole = true
      this.beenLoadInit = false
      this.current_page = -1
      this.list = []
      await this.load_page(true)
      this.loading_whole = false
    },
    async load_page(need_clear) {
      if (!this.id || !this.hasNextPage) return
      this.beenLoadInit = true
      this.loading_next = true
      this.current_page++
      getComments({
        id: this.id,
        pageIndex: this.current_page,
        pageSize: this.current_page_size,
        order: this.order
      })
        .then(data => {
          if (need_clear) this.list = []
          this.list = this.list.concat(data.list)
          this.$emit('update:totalCount', data.totalCount)
        })
        .finally(() => {
          this.loading_next = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: center;
}
</style>
