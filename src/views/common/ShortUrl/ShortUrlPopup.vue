<template>
  <el-dialog
    v-loading="loading"
    :visible.sync="show"
    append-to-body
    modal-append-to-body
    class="dialog-popup"
  >
    <el-row v-if="data" :gutter="20" class="center-text">
      <el-col :lg="16" :sm="24" class="item-put-center">
        <UserFormItem :direct-show-card="true" :userid="data.createBy" />
      </el-col>
      <el-col :lg="8" :sm="24" style="margin-top:2rem">
        <h2>分享的链接</h2>
        <el-button type="text" style="font-size:2rem" @click="go_to_url">点击访问</el-button>
        <p>
          <span>点击将跳转到:</span>
          <span>{{ data.target }}</span>
        </p>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { loadDwz } from '@/api/common/dwz'
import UserFormItem from '@/components/User/UserFormItem'
export default {
  name: 'ShortUrlPopUp',
  components: { UserFormItem },
  props: {
    urlKey: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    show: false,
    loading: false,
    data: null,
  }),
  watch: {
    urlKey: {
      handler(val) {
        if (val) {
          this.show = true
          this.load_dwzInfo()
        }
      },
    },
  },
  methods: {
    load_dwzInfo() {
      this.loading = true
      loadDwz({ key: this.urlKey })
        .then((data) => {
          const list = data.list
          if (list.length === 0) {
            this.show = false
            this.$message.error('无效的链接')
          } else {
            this.data = list[0]
          }
        })
        .catch((e) => {
          this.show = false
          this.$message.error('加载短网址信息失败')
        })
        .finally(() => {
          this.loading = false
        })
    },
    go_to_url() {
      window.open(this.data.target)
    },
  },
}
</script>
<style lang="scss" scoped>
@keyframes popup {
  0% {
    transform: scale(0) rotateY(540deg);
    filter: blur(0.1rem);
  }

  60% {
    transform: rotateY(180deg);
  }

  100% {
  }
}
.center-text {
  text-align: center;
}
.item-put-center {
  display: flex;
  justify-content: center;
}
</style>
