<template>
  <div class="common-sender" @mouseenter="showAnonymous" @mouseleave="requireHideAnonymouse">
    <div class="comment-avatar">
      <el-image :src="avatar" :preview-src-list="[avatar]" class="avatar" />
    </div>
    <div class="comment-content">
      <el-input
        ref="input"
        v-model="content"
        :class="`comment-text dark-base ${useAnonymous && 'dark'}`"
        :disabled="!!sending"
        :autosize="{ minRows: 4, maxRows: 4}"
        type="textarea"
        :placeholder="`${useAnonymous?'悄悄地':''}说些想说的事情`"
      />
      <button
        :disabled="!!sending"
        :type="sending?'info':'primary'"
        class="comment-submit"
        @click="send_to"
      >{{ !!sending?sending:'发表评论' }}</button>
      <span
        class="comment-submit"
        :style="{top:showAnonymousBtn?'81px':'30px',height:'30px','background-color': '#0083c3','z-index':0,transition:'all ease 0.5s'}"
      >
        <el-tooltip :content="anonymousNick?`以[${anonymousNick}]的名义发表`:'匿名发表'">
          <el-switch v-model="useAnonymous" active-color="#00aa00" />
        </el-tooltip>
      </span>
    </div>
    <el-dialog :visible.sync="anonymousDialogShow" append-to-body>
      <template #title>
        <h2>匿名发表评论</h2>
      </template>
      <el-form>
        <el-form-item label="发表名义">
          <el-input v-model="anonymousNick" style="width:60%" />
          <SvgIcon
            icon-class="random"
            style-normal="font-size:30px;cursor:pointer;"
            @click="generateNick"
          />
        </el-form-item>
      </el-form>
      <el-button type="success" style="width:100%" @click="anonymousDialogShow=false">确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
const Mock = require('mockjs')
const Random = Mock.Random
import { postComments } from '@/api/apply/attach_info'
export default {
  name: 'CommentSender',
  components: {
    SvgIcon: () => import('@/components/SvgIcon')
  },
  props: {
    id: { type: String, default: null },
    reply: { type: String, default: null },
    defaultContent: { type: String, default: null }
  },
  data: () => ({
    sending: null,
    content: '',
    showAnonymousBtn: false,
    intentHideAnonymouseBtn: false,
    useAnonymous: false,
    anonymousNick: null,
    anonymousDialogShow: false
  }),
  computed: {
    avatar() {
      return this.$store.state.user.avatar
    }
  },
  watch: {
    useAnonymous: {
      handler(val) {
        if (!val) return
        this.anonymousDialogShow = true
      }
    },
    defaultContent: {
      handler(val) {
        this.content = val
      },
      immediate: true
    }
  },
  methods: {
    generateNick() {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          this.anonymousNick = Random.cname()
        }, 5e1 * i)
      }
    },
    focus() {
      this.$refs.input.focus()
    },
    showAnonymous() {
      this.showAnonymousBtn = true
      this.intentHideAnonymouseBtn = false
    },
    requireHideAnonymouse() {
      this.intentHideAnonymouseBtn = true
      setTimeout(() => {
        if (!this.intentHideAnonymouseBtn) return
        this.showAnonymousBtn = false
      }, 5e3)
    },
    async send_to({ content, cb }) {
      content = content || this.content
      if (!content || content < 1) {
        const f = await this.$confirm('评论没有内容，确定要发送吗？')
        if (!f) return cb && cb()
      }
      this.sending = '发送中...'
      const reply = this.reply
      const apply = this.id
      const item = {
        apply,
        content,
        reply,
        anonymousNick: this.useAnonymous && this.anonymousNick
      }
      postComments(item)
        .then(data => {
          this.sending = '发送成功'
          item.model = data.model
        })
        .catch(e => {
          this.sending = e.message
        })
        .finally(() => {
          setTimeout(() => {
            item.sending = this.sending
            this.$emit('newContent', item)
            this.sending = null
            this.content = ''
            cb && cb(item)
          }, 1e3)
        })
    }
  }
}
</script>

<style lang="scss">
.dark-base {
  .el-textarea__inner {
    transition: all 0.5s ease;
  }
}
.dark {
  .el-textarea__inner {
    background-color: #444;
  }
}
.common-sender {
  margin: 10px 0 35px 0;
}
.comment-avatar {
  float: left;
  margin: 7px 0 0 5px;
  position: relative;
}
.comment-content {
  position: relative;
  margin-left: 85px;
  margin-right: 80px;
  .comment-text {
    font-size: 12px;
    overflow: auto;
    color: #555;
    padding: 0 30px;
    line-height: normal;
  }
  .comment-submit {
    width: 100px;
    height: 80px;
    position: absolute;
    right: -80px;
    top: 0;
    padding: 4px 30px;
    font-size: 15px;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    min-width: 60px;
    vertical-align: top;
    cursor: pointer;
    background-color: #00a1d6;
    border: 1px solid #00a1d6;
    user-select: none;
    outline: none;
    z-index: 1;
  }
}
.avatar {
  transition: all 0.5s ease;
  cursor: pointer;
  width: 4em;
  height: 4em;
  border-radius: 50%;
}
</style>
