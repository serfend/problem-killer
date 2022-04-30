<template>
  <transition name="el-fade-in-linear">
    <div v-if="showAnswer">
      <el-divider />
      <el-button type="text" icon="el-icon-hide" class="analysis-btn-hide" @click="$emit('update:showAnswer',false)">隐藏解析</el-button>
      <el-row>
        <el-col :span="16">
          <el-form label-width="5rem">
            <el-form-item label="答案">
              <div>{{ data.answer }}</div>
            </el-form-item>
            <el-form-item label="解析">
              <div>{{ data.analysis||'无' }}</div>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form label-width="5rem">
            <el-form-item label="刷题数">
              <div>0</div>
            </el-form-item>
            <el-form-item label="正确数">
              <div>0</div>
            </el-form-item>
            <el-form-item label="平均用时">
              <div>0</div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ProblemAnalysis',
  props: {
    data: { type: Object, default: null },
    showAnswer: { type: Boolean, default: false }
  }
}
</script>
<style lang="scss" scoped>
.analysis-btn-hide{
  width:100%;
}
</style>
