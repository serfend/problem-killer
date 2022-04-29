<template>
  <div>
    <el-card>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :timestamp="activity.timestamp"
        >
          <ActiveContent />
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ActiveHistory',
  label: '轨迹',
  icon: 'GPS',
  index: 0.9,
  components: {
    ActiveContent: () => import('./ActiveContent')
  },
  data: () => ({
    activities: [{}]
  }),
  methods: {}
}
</script>
