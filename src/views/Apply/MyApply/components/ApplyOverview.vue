<template>
  <el-card v-loading="loading">
    <el-form>
      <el-form-item label="休假率">
        <VacationDescription
          :userid="userid"
          :this-time-vacation-length="0"
          :loading-result.sync="loading_result"
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import VacationDescription from '@/components/Vacation/VacationDescription'
export default {
  name: 'ApplyOverview',
  components: { VacationDescription },
  props: {
    userid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      loading_result: null
    }
  },
  watch: {}
}
</script>

<style>
</style>
