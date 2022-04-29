<template>
  <el-card header="二维码生成">
    <el-form label-width="60px">
      <el-container>
        <el-aside width="400px" style="background:#fff">
          <el-form-item label="内容">
            <el-input v-model="file.data" type="textarea" autosize />
          </el-form-item>
          <el-form-item label="分辨率">
            <el-slider v-model="setting.pixel" :max="1280" :step="1" />
          </el-form-item>
          <el-form-item label="边框">
            <el-switch v-model="setting.margin" />
          </el-form-item>
          <el-form-item>
            <el-collapse>
              <el-collapse-item>
                <template slot="title">
                  <i class="el-icon-picture-outline" />
                  <span>图标设置</span>
                </template>
                <el-form-item label="文件">
                  <el-input v-model="setting.icon" placeholder="需要使用系统内部文件名" />
                </el-form-item>
                <el-form-item label="占比">
                  <el-slider v-model="setting.iconSize" :step="1" />
                </el-form-item>
                <el-form-item label="外宽">
                  <el-slider v-model="setting.iconBorderSize" :step="1" />
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>

          <el-form label="二维码">
            <ContactMe
              ref="qrCode"
              :content="file.data"
              :pixel="setting.pixel"
              :size="setting.size"
              :icon="setting.icon"
              :icon-size="setting.iconSize"
              :icon-border-size="setting.iconBorderSize"
              :margin="setting.margin"
              description
            />
          </el-form>
        </el-aside>
        <el-main>
          <el-form-item>
            <el-upload
              drag
              :before-upload="beforeAvatarUpload"
              :on-success="onUploadSuccess"
              :action="uploadurl"
              :data="file"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item style="width:420px">
            <el-image :src="file.imgraw" />
          </el-form-item>
        </el-main>
      </el-container>
    </el-form>
  </el-card>
</template>

<script>
import ContactMe from '@/components/ContactMe'
import { fileToBase64 } from '@/utils/file'
import { qrCodeScan } from '@/api/common/qrCode'
export default {
  name: 'QrCodeScan',
  components: { ContactMe },
  data() {
    return {
      uploadurl: '',
      file: {
        img: '',
        imgraw: '',
        data: ''
      },
      setting: {
        pixel: 5,
        size: 200,
        icon: null,
        iconSize: 15,
        iconBorderSize: 6,
        margin: false
      }
    }
  },
  watch: {
    setting: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.qrCode.refresh()
          })
        }
      },
      deep: true
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const cfile = this.file
      var self = this
      fileToBase64(file).then(b64 => {
        cfile.imgraw = b64
        cfile.img = cfile.imgraw.substring('data:image/jpeg;base64,'.length)
        qrCodeScan(cfile.img).then(data => {
          cfile.data = data.data
          self.$message.success(`加载${file.name}成功`)
        })
      })
      return false
    },
    onUploadSuccess(data, status, arr) {
      if (data.status !== 0) {
        this.$message.error(data.message)
      } else {
        this.$message.success(`${status.name}识别成功`)
      }
    }
  }
}
</script>

<style>
</style>
