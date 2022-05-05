<template>
  <div style="overflow:scroller">
    <el-form-item label="身份证号">
      <el-input v-model="innerForm.cid" class="normal-form-item" @change="fetchUserInfoes" />
      <el-tooltip :content="invalid.cid.des">
        <i v-if="invalid.cid.status" class="el-icon-error" style="color:#F56C6C" />
        <i v-else class="el-icon-success" style="color:#67C23A" />
      </el-tooltip>
    </el-form-item>
    <el-form-item label="真实姓名">
      <el-input v-model="innerForm.realName" class="normal-form-item" />
    </el-form-item>
    <el-form-item label="籍贯">
      <CascaderSelector
        :child-getter-method="locationChildren"
        :value-name="'code'"
        :label-name="'name'"
        :place.sync="innerForm.hometown"
        :placeholder="innerForm.hometown"
        class="normal-form-item"
      />
    </el-form-item>
    <el-form-item label="民族">
      <el-select
        v-model="innerForm.nation"
        :placeholder="innerForm.nation"
        class="normal-form-item"
      >
        <el-option v-for="i in nations" :key="i" :label="i" :value="i" />
      </el-select>
    </el-form-item>
    <el-form-item label="学历">
      <el-select
        v-model="innerForm.education"
        class="normal-form-item"
        :placeholder="innerForm.education"
      >
        <el-option v-for="i in educations" :key="i" :label="i" :value="i" />
      </el-select>
    </el-form-item>
    <el-form-item label="工作时间">
      <el-date-picker
        v-model="innerForm.time_Work"
        format="yyyy年MM月dd日"
        value-format="yyyy-MM-dd"
        class="normal-form-item"
        :editable="false"
      />
    </el-form-item>
    <el-form-item label="党团时间">
      <el-date-picker
        v-model="innerForm.time_Party"
        format="yyyy年MM月dd日"
        value-format="yyyy-MM-dd"
        class="normal-form-item"
      />
    </el-form-item>
    <el-form-item label="性别">
      <GenderBtn v-model="innerForm.gender" />
    </el-form-item>
    <el-form-item label="生日">
      <el-date-picker
        v-model="innerForm.time_Birthday"
        format="yyyy年MM月dd日"
        value-format="yyyy-MM-dd"
        class="normal-form-item"
        placeholder="根据身份证计算"
        disabled
      />
    </el-form-item>
  </div>
</template>

<script>
import { locationChildren } from '@/api/common/static'
import { educations, nations } from './dictionary'
import { cidValid } from '@/utils/validate'
import { getUserIdByCid } from '@/api/user/userinfo'
export default {
  name: 'Base',
  components: {
    GenderBtn: () => import('@/components/User/GenderBtn'),
    CascaderSelector: () => import('@/components/CascaderSelector')
  },
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
      educations,
      nations,
      innerForm: {
        cid: '',
        realName: '',
        gender: 0,
        hometown: '',
        time_Work: '',
        time_Birthday: '',
        time_Party: ''
      },
      invalid: {
        cid: {
          status: false,
          des: '用户已存在'
        }
      }
    }
  },
  watch: {
    form: {
      handler(val) {
        this.innerForm = val
        if (this.innerForm.id) delete this.innerForm.id
      },
      deep: true,
      immediate: true
    },
    innerForm: {
      handler(val, oldVal) {
        this.$emit('update:form', val)
      },
      deep: true
    }
  },
  methods: {
    locationChildren,
    fetchUserInfoes() {
      const id = this.innerForm.cid
      const invalid = this.invalid
      const invalid_cid = invalid.cid
      invalid_cid.status = false
      invalid_cid.des = '验证通过'
      if (!id || id.length !== 18) {
        invalid_cid.status = true
        invalid_cid.des = '非正确身份号码,正确格式为18位法定身份证号码'
        return
      }
      const vcid = cidValid(id)
      if (!vcid.valid) {
        this.invalid.cid.status = true
        this.invalid.cid.des = vcid.msg
        return
      }
      getUserIdByCid(id, true)
        .then(data => {
          this.invalid.cid.status = true
          this.invalid.cid.des = `此身份证号已被${data.base.realName}使用`
        })
        .catch(() => {
          this.invalid.cid.status = false
          const arrRaw = [[6, 10], [10, 12], [12, 14]]
          const arr = arrRaw.map(i => id.substring(i[0], i[1]))
          const dateStr = `${arr[0]}-${arr[1]}-${arr[2]}`
          this.innerForm.time_Birthday = dateStr
          this.innerForm.gender = parseInt(id[16]) % 2 === 0 ? 2 : 1
          this.$forceUpdate()
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../common';
</style>
