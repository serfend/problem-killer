<template>
  <div>
    <el-card>
      <slot name="header">忍者必须死3 礼品码领取工具</slot>
    </el-card>
    <el-collapse v-model="colMainSelect" style="padding:10px">
      <el-collapse-item name="profile">
        <template slot="title">
          <el-tag :type="userinfo.enable?'success':'info'">{{ userinfo.nickName }}</el-tag>个人信息
        </template>
        <UserProfile :userinfo.sync="userinfo" />
      </el-collapse-item>

      <el-collapse-item name="share">
        <template slot="title">
          <el-button v-show="!contains(colMainSelect,'share')" style="width:100%" type="success">分享</el-button>
        </template>
        <el-form>
          <el-form-item label="礼品码">
            <el-input v-model="giftcode.userinput" />
          </el-form-item>
        </el-form>
        <el-button
          :loading="sharingCodeLoading"
          :disabled="!giftcode.userinput"
          style="width:100%"
          type="success"
          @click="shareNewCode"
        >分享礼品码</el-button>
      </el-collapse-item>
    </el-collapse>

    <UserShareCode :code-api="giftcodes" :code-list.sync="giftcode.mainlist" title="忍忍们分享的礼品码" />
    <UserShareCode
      :code-api="giftCodeHistory"
      :code-list.sync="giftcode.historylist"
      title="近期领取记录"
    />
  </div>
</template>

<script>
import UserShareCode from './UserShareCode'
import UserProfile from './UserProfile'
import { sharecode, giftcodes, giftCodeHistory } from '@/api/game'
export default {
  name: 'GameR3',
  components: {
    UserShareCode,
    UserProfile
  },
  data() {
    return {
      sharingCodeLoading: false,
      colMainSelect: ['profile'],
      userinfo: {
        gameid: '',
        nickName: '',
        level: '',
        enable: true,
        lastHandleStamp: 0
      },
      giftcode: {
        userinput: '',
        mainlist: [],
        historylist: []
      },
      userinfoLoading: false
    }
  },
  methods: {
    giftcodes(pageIndex) {
      return giftcodes(null, pageIndex, 10)
    },
    giftCodeHistory(pageIndex) {
      return giftCodeHistory(null, null, pageIndex, 10)
    },
    contains(arr, val, cb) {
      for (var i in arr) {
        if (arr[i] === val) {
          if (cb) {
            cb(arr, i)
          }
          return true
        }
      }
      return false
    },
    shareNewCode() {
      this.sharingCodeLoading = true
      sharecode(this.userinfo.gameid, this.giftcode.userinput).then(d => {
        var code = d.code
        if (code.valid) {
          this.$message.success('分享成功，感谢大佬')
          if (new Date() - new Date(code.shareTime) > 30 * 1000) {
            setTimeout(() => {
              this.$message.success('不过之前有大佬分享过啦~~')
            }, 2000)
            setTimeout(() => {
              this.$message.success(
                `${code.shareBy}于${code.shareTime}第一次分享`
              )
            }, 4000)
          }
        } else {
          this.$message.error(code.statusDescription)
          if (code.shareTime !== code.invalidTime) {
            setTimeout(() => {
              this.$notify.error(
                `礼品码:${code.code}于${code.shareTime}分享,于${code.invalidTime}失效`
              )
            }, 5000)
          }
        }
        this.contains(this.colMainSelect, 'share', (arr, i) => {
          this.giftcode.userinput = ''
          arr.splice(i, 1)
          setTimeout(() => {
            this.colMainSelect.push('share')
          }, 1000)
        })

        this.sharingCodeLoading = false
      })
    }
  }
}
</script>
