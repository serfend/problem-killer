<template>
  <div v-if="data">
    <el-row>
      <el-col :span="3">
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          icon="el-icon-info"
          icon-color="red"
          title="确定要删除这个翻牌器吗"
          @confirm="confirmDelete"
        >
          <i slot="reference" class="el-icon-delete delete-btn" />
        </el-popconfirm>
        <el-color-picker :value.sync="data.color" />
      </el-col>
      <el-col :span="6">
        <el-input :value.sync="data.title" placeholder="标题" />
      </el-col>
      <el-col :span="5">
        <el-select :value.sync="data.collection" placeholder="使用集合">
          <el-option
            v-for="opt in opts"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-input :value.sync="data.filter" placeholder="条件" />
      </el-col>
      <el-col :span="5">
        <el-select :value.sync="data.binding" placeholder="绑定到">
          <el-option
            v-for="opt in props[data.collection]"
            :key="opt.key"
            :label="opt.name"
            :value="opt.key"
          />
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { apiOption } from '../../Engine/dataDriverApiOption'
export default {
  name: 'MembersCardSetting',
  model: {
    prop: 'data',
    event: 'change',
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    opts: [],
    props: {},
  }),
  created() {
    const keys = Object.keys(apiOption)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      this.opts.push({ label: apiOption[key].name, value: key })
      this.props[key] = apiOption[key].props
    }
  },
  methods: {
    confirmDelete() {
      this.$emit('deleted')
    },
  },
}
</script>

<style lang="scss" scoped>
.delete-btn {
  font-size: 0.3rem;
  top: -0.15rem;
  position: relative;
  transition: all 0.5s;
  cursor: pointer;
}
</style>
