<template>
  <div>
    <el-form-item label="个性签名">
      <el-input
        v-model="innerForm.about"
        :style="{ width: '18rem' }"
        placeholder="可填写个人描述"
        type="textarea"
        maxlength="50"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="头像">
      <span>未开放设置</span>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'Diy',
  props: {
    form: {
      type: Object,
      default() {
        return this.innerForm
      }
    }
  },
  data() {
    return {
      innerForm: {
        about: '',
        avatar: '' /* TODO提供上传头像的方式 */
      },
      invalid: {
        about: {
          status: false,
          des: ''
        }
      }
    }
  },
  watch: {
    form: {
      handler(val) {
        this.innerForm = val
      },
      deep: true,
      immediate: true
    },
    innerForm: {
      handler(val) {
        this.$emit('update:form', val)
      },
      deep: true
    }
  },
  methods: {}
}
</script>

<style>
</style>
