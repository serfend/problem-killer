<template>
  <div>
    <div class="mod-new-reg-bg" />
    <div class="mod-new-reg-text">
      <span class="shadow-item">
        <span class="text-title" style="color:#f33">江</span>
        <span class="text-title" style="color:#0082ee">河</span>
      </span>
      <p>用科技</p>
      <p>创造美好生活</p>
    </div>
    <div class="reg-form">
      <RegForm ref="reg" class="reg-form-content" :show-submit-button="false" />
      <div class="reg-submit-button">
        <div>
          <el-button type="info" plain style="width:12rem" @click="next_step(-1)">上一步</el-button>
          <el-button
            type="info"
            plain
            style="width:12rem;margin-left:4rem"
            @click="next_step(1)"
          >下一步</el-button>
        </div>
        <el-button type="primary" plain style="width:28.3rem;margin-top:0.5rem" @click="hdlReg">注册</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import RegForm from './RegForm'
export default {
  name: 'RegisterPage',
  components: { RegForm },
  methods: {
    next_step(step) {
      this.$refs.reg.next_step(step)
    },
    hdlReg() {
      this.$refs.reg.submitRegister(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.reg-form {
  position: absolute;
  right: 139px;
  top: 50%;
  margin-top: -340px;
  width: 480px;
  height: 680px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 1px 1px 1px 1px rgba(255, 255, 255, 0.9);
  .reg-form-content {
    .el-card {
      .el-card__body {
        padding: 0.5rem !important;
      }
    }
  }
}
.mod-new-reg-bg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: url(~@/assets/jpg/app/reg_bg_min.jpg) no-repeat;
  background-size: cover;
}
.reg-submit-button {
  position: absolute;
  margin-left: 1rem;
  bottom: rem;
}

.mod-new-reg-text {
  position: fixed;
  left: 195px;
  top: 314px;
  color: #fff;
  font-size: 3rem;
  .shadow-item {
    text-shadow: #fff 0.2rem 0 0, #fff 0 0.2rem 0, #fff -0.2rem 0 0,
      #fff 0 -0.2rem 0;
  }
  .text-title {
    letter-spacing: 0rem;
    font-weight: 800;
    font-size: 5rem;
  }
}
</style>
