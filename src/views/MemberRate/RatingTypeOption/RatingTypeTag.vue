<template>
  <span>{{ desc }}</span>
</template>

<script>
import { ratingTypeCycleToString } from './converter'
export default {
  title: 'RatingTypeTag',
  props: {
    ratingType: {
      type: Number,
      default: 0
    },
    ratingCycleCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    desc() {
      const { ratingType, ratingCycleCount } = this
      return ratingTypeCycleToString(ratingType, ratingCycleCount)
    }
  }
}
</script>
