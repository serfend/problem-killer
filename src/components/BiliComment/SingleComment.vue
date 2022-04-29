<template>
  <div v-if="data" v-loading="loading" style="margin-top:0.5rem">
    <el-row :gutter="20">
      <el-col v-loading="loading_avatar" :span="2.5" style="justify-content:center;display:flex">
        <el-image
          v-if="avatar||defaultAvatar"
          :src="avatar||defaultAvatar"
          :preview-src-list="[avatar]"
          class="avatar"
          :style="isMini?{height:'40px',width:'40px'}:null"
        />
      </el-col>
      <el-col :span="21">
        <el-popover trigger="hover" placement="left" @show="userIsActive=true">
          <User v-if="data.from" :data="data.from" :can-load-avatar="userIsActive" />
          <span v-else>
            <div>此用户以匿名方式发表</div>
            <el-button
              :disabled="iwannaTryDisabled"
              type="text"
              @click="()=>{$message.info('隐藏功能，无法尝试'),iwannaTryDisabled=true}"
            >我也试试</el-button>
          </span>
          <span slot="reference" class="user">
            <span v-if="data.from" class="user-name">{{ data.from.realName }}</span>
            <span v-else class="user-name-unknow">
              <span style="font-size:10px;color:#ccc;">匿名</span>
              <span style="color:#aaa">{{ data.anonymousNick }}</span>
            </span>
          </span>
        </el-popover>
        <div v-if="isMarkdown" style="margin:1rem 0">
          <MarkdownViewer :content="data.content" />
        </div>
        <span v-else style="color:#333;font-size:10px;">
          <div v-for="(line,index) in data.content.split('\n')" :key="index">
            <span>{{ line }}</span>
          </div>
        </span>
        <div class="footer">
          <el-tooltip effect="light" :content="parseTime(data.create)">
            <span class="time">{{ formatTime(new Date(data.create)) }}</span>
          </el-tooltip>
          <span class="like" @click="handle_like">
            <SvgIcon :icon-class="liked?'like_filled':'like'" style-normal="color:#c33" />
            <span>{{ like_count }}</span>
          </span>
          <span
            v-if="currentUser === data.from && data.from.id"
            class="like"
            @click="handle_delete"
          >
            <SvgIcon icon-class="delete" style-normal="color:#c33" />
            <span>删除</span>
          </span>
          <span class="like" @click="replyComment()">回复</span>
        </div>
        <div v-if="data.replies && data.replies.item1">
          <SingleComment
            v-for="(i,index) in data.replies.item1"
            :key="i.id"
            :data.sync="data.replies.item1[index]"
            :is-mini="true"
            @requireDelete="$emit('requireDelete')"
            @newContent="$emit('newContent')"
            @requireReply="v=>replyComment(v)"
          />
          <div v-if="data.replies.item2>data.replies.item1.length&&!showAllApplies.enable">
            <span style="color:#888">共{{ data.replies.item2 }}回复</span>
            <el-button type="text" @click="loadAllReplies">点击查看</el-button>
          </div>
          <Pagination
            v-else-if="showAllApplies.enable"
            :pagesetting.sync="showAllApplies.page"
            :total-count="data.replies.item2"
            :small="true"
            :layout="'total, prev, pager, next'"
          />
        </div>
        <div v-if="!isMini" style="margin-top:1rem">
          <transition name="el-fade-in-linear">
            <CommentSender
              v-if="replying"
              :id="data.apply"
              ref="sender"
              :reply="data.id"
              :default-content="content"
              @newContent="v=>$emit('newContent',v)"
            />
          </transition>
        </div>
      </el-col>
    </el-row>
    <el-divider v-if="!isMini" />
  </div>
</template>

<script>
import defaultAvatar from '@/assets/plain/defaultAvatar.js'
import { formatTime, parseTime } from '@/utils'
import { getUserAvatar } from '@/api/user/userinfo'
import { likeComments, postComments, getReplies } from '@/api/apply/attach_info'
import SvgIcon from '@/components/SvgIcon'
import User from '@/components/User'
import MarkdownViewer from '@/components/MarkdownEditor/InnerViewer'
export default {
  name: 'SingleComment',
  components: {
    SvgIcon,
    User,
    MarkdownViewer,
    Pagination: () => import('@/components/Pagination'),
    CommentSender: () => import('./CommentSender')
  },
  props: {
    data: { type: Object, default: null },
    isMini: { type: Boolean, default: false },
    isMarkdown: { type: Boolean, default: true }
  },
  data: () => ({
    defaultAvatar,
    avatar: '',
    liked: false,
    like_count: 0,
    loading_avatar: false,
    loading: false,
    userIsActive: false,
    replying: false,
    content: '',
    showAllApplies: {
      enable: false,
      page: { pageIndex: 0, pageSize: 10 }
    },
    iwannaTryDisabled: false
  }),
  computed: {
    currentUser() {
      const u = this.$store.state.user
      return u && u.userid
    }
  },
  watch: {
    data: {
      handler(val) {
        const d = this.data || {}
        this.like_count = d.like || 0
        this.liked = d.myLike
        if (d.from) this.load_avatar()
      },
      immediate: true,
      deep: true
    },
    'showAllApplies.page': {
      handler(val) {
        this.loadReplies(val)
      },
      deep: true
    }
  },
  methods: {
    formatTime,
    parseTime,
    loadReplies(page) {
      page = page || this.showAllApplies.page
      this.loading = true
      const id = this.data.id
      getReplies(Object.assign({ id }, page))
        .then(data => {
          this.$emit('update:data', data.model)
        })
        .finally(() => {
          this.loading = false
        })
    },
    loadAllReplies() {
      this.showAllApplies.enable = true
      this.loadReplies()
    },
    replyComment(id) {
      if (this.isMini) {
        const from = this.data.from
        const nick = this.data.anonymousNick
        return this.$emit('requireReply', (from && from.id) || nick)
      }
      if (id) this.content = `@${id} `
      else this.content = ''
      this.replying = true
      setTimeout(() => {
        const s = this.$refs.sender
        s.focus()
      }, 5e2)
    },
    load_avatar() {
      const user = this.data.from
      this.loading_avatar = true
      getUserAvatar(user.id, user.avatar, true)
        .then(d => {
          this.avatar = d.url
        })
        .finally(() => {
          this.loading_avatar = false
        })
    },
    sending_like() {
      if (this.loading_like) return
      this.loading_like = true
      const this_time_like = this.liked
      likeComments({ id: this.data.id, like: this_time_like }).finally(() => {
        setTimeout(() => {
          this.loading_like = false
          if (this_time_like !== this.liked) this.sending_like()
        }, 2000)
      })
    },
    handle_like() {
      this.liked = !this.liked
      this.like_count += this.liked ? 1 : -1
      this.sending_like()
    },
    async handle_delete() {
      const check = await this.$confirm('确定要删除评论吗', {
        type: 'warning'
      }).catch(e => {})
      if (!check) return
      this.loading = true
      postComments({ id: this.data.id, isRemove: true })
        .then(() => {
          this.$message.success('已删除')
          this.$emit('requireDelete')
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.user {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  .user-name {
    color: rgb(95, 159, 255);
  }
}

.footer {
  user-select: none;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  opacity: 0.5;
  transition: all ease 0.5s;
  margin-top: 0.5rem;
  &:hover {
    opacity: 1;
  }
  .time {
    color: #aaa;
  }
  .like {
    color: #bbb;
    cursor: pointer;
    margin-left: 1rem;
  }
}
</style>
