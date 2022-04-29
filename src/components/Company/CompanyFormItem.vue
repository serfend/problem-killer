<template>
  <el-popover
    v-if="inner_id||(data&&data.code)"
    v-loading="loading"
    placement="right"
    trigger="hover"
    @show="canLoad = true"
  >
    <Company
      v-model="inner_id"
      :loading.sync="loading"
      :error-msg.sync="errorMsg"
      :data.sync="form"
      :can-load="canLoad"
      @formUpdate="handleChange"
    />
    <template #reference>
      <el-tag v-if="form">{{ form.name }}</el-tag>
      <span v-else>
        <el-tooltip :content="errorMsg">
          <span>{{ inner_id }}无效</span>
        </el-tooltip>
      </span>
    </template>
  </el-popover>
</template>

<script>
import Company from './index'
export default {
  name: 'CompanyFormItem',
  components: { Company },
  model: {
    prop: 'id',
    event: 'change'
  },
  props: {
    data: {
      type: Object,
      default: () => ({
        realName: 'null'
      })
    },
    id: {
      type: String,
      default: null
    }
  },
  data: () => ({
    form: null,
    canLoad: false,
    inner_id: null,
    errorMsg: null,
    loading: false
  }),
  watch: {
    data: {
      handler(val) {
        this.form = val
      },
      immediate: true
    },
    id: {
      handler(val) {
        if (val) this.canLoad = true
        this.inner_id = val
      },
      immediate: true
    }
  },
  methods: {
    handleChange() {
      this.$emit('update:data', this.form)
      this.$emit('change', this.inner_id)
    }
  }
}
</script>

<style></style>
