<template>
  <div class="avatar">
    <div class="avatar-content clearfix">
      <div class="img-clip-wrap">
        <div class="container-bg">
          <div class="img-container">
            <img id="clip_src_img" />
            <div class="shadow-box"></div>
            <div class="crop-wrap">
              <div class="shadow-box" style="width: 0px; height: 0px; left: 0px; top: 0px;">
                <el-image class="shadow-img" style="width: 0px; height: 0px; top: 0px; left: 0px;" />
              </div>
              <ImageCropper
                v-model="showUpload"
                :width="300"
                :height="300"
                url="/api/users/avatar"
                :params="{}"
                :headers="{}"
                img-format="png"
                field="url"
                @crop-success="cropSuccess"
                @crop-upload-success="cropUploadSuccess"
                @crop-upload-fail="cropUploadFail"
              />
            </div>
          </div>
        </div>
        <label for="file_input" class="first-change-lb">
          <i></i>
          <span>选择图片</span>
        </label>
        <div class="reset-img" :style="{display: selected?'block':'none'}">
          <label for="file_input">
            <i></i>&nbsp;重新选择
          </label>
        </div>
        <input type="file" id="file_input" accept="image/png, image/jpg, image/jpeg" />
      </div>
      <div class="border-line"></div>
      <div class="img-preview-wrap">
        <div
          class="pre-container"
          style="background-image: url(&quot;https://i2.hdslb.com/bfs/face/7579a7b80c4e71e11e8b00d0a7a0aec08a75a4c0.jpg@150w_150h.jpg&quot;);"
        >
          <img id="clip_res_img" style="display: none;" />
        </div>
        <div class="pre-info">当前头像</div>
      </div>
    </div>
    <p class="descript">请选择图片上传：大小180 * 180像素支持JPG、PNG等格式，图片需小于2M</p>
    <div class="avatar-footer">
      <el-button type="primary" :disabled="!selected" :class="['avatar-btn']">更新</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  label: '我的头像',
  icon: 'patriarch',
  index: 2,
  components: {
    ImageCropper: () => import('vue-image-crop-upload')
  },
  data: () => ({
    selected: false,
    showUpload: false
  }),
  methods: {
    cropSuccess() {
      debugger
    },
    cropUploadSuccess() {},
    cropUploadFail() {}
  }
}
</script>
<style lang="scss" scoped>
.avatar {
  text-align: center;
}
.cropper-avatar .avatar {
  width: 830px;
  text-align: center;
}
.avatar-head {
  position: relative;
  text-align: center;
  padding: 0 20px;
  border-bottom: 1px solid #e5e9ef;
}
.avatar-head a {
  color: #6d757a;
}
.avatar-head a:hover {
  color: #00a1d6;
}
.head-wrap {
  position: relative;
  font-size: 14px;
  color: #222;
  height: 50px;
  line-height: 50px;
  text-align: left;
}
.avatar-content {
  padding: 80px 20px 56px;
  display: inline-block;
}
.img-clip-wrap {
  float: left;
  position: relative;
  margin-right: 40px;
}
.border-line {
  height: 182px;
  width: 1px;
  background: #e5e9ef;
  float: left;
}
.container-bg {
  width: 180px;
  height: 180px;
  background-color: #000;
  border-radius: 4px;
  border: 1px solid #e5e9ef;
}
.img-container {
  position: relative;
  height: 0;
  margin: auto;
}
.img-container img {
  position: relative;
  width: 100%;
  height: 100%;
}
.img-container .shadow-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
.reset-img {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translate(-50%);
}
.reset-img label {
  font-size: 12px;
  color: #6d757a;
  cursor: pointer;
}
.reset-img label i {
  display: inline-block;
  width: 18px;
  height: 18px;
  vertical-align: bottom;
  background-image: url(https://s1.hdslb.com/bfs/static/account-fe/static/img/icons_m_2.57e5263.png);
  background-position: -23px -1303px;
  cursor: pointer;
}
.reset-img label:hover {
  color: #00b5e5;
}
.reset-img label:hover i {
  background-position: -87px -1303px;
}
#file_input {
  display: none;
}
.first-change-lb {
  cursor: pointer;
  background: #f1f2f5;
  width: 180px;
  height: 180px;
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #e5e9ef;
  border-radius: 4px;
  transition: all 0.6s ease;
  text-align: center;
}
.first-change-lb:hover {
  background: #e5e9ef;
}
.first-change-lb span {
  display: block;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  color: #6d757a;
  line-height: 20px;
  margin-top: 10px;
  padding: 0 12px;
  letter-spacing: 0;
}
.first-change-lb i {
  margin: 52px auto 0;
  width: 54px;
  height: 46px;
  display: block;
  background: url(https://s1.hdslb.com/bfs/static/account-fe/static/img/icons_m_2.57e5263.png);
  background-position: -101px -1065px;
}
.img-preview-wrap {
  margin-left: 40px;
  margin-top: 30px;
  float: left;
}
.pre-container {
  width: 96px;
  height: 96px;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid #e6eaf0;
  background-size: cover;
}
.pre-container img {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
.pre-info {
  margin-top: 20px;
  font-size: 12px;
  color: #99a2aa;
}
.clearfix:after,
.clearfix:before {
  content: ' ';
  display: table;
}
.clearfix:after {
  clear: both;
}
.avatar-footer {
  text-align: center;
  margin-top: 40px;
}
.avatar-btn {
  width: 140px;
}
.descript {
  line-height: 16px;
  color: #99a2aa;
}
</style>
<style lang="scss" scoped>
</style>
