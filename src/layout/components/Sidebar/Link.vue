
<template>
  <div>
    <router-link v-if="!isExternal" :to="to">
      <slot />
    </router-link>
    <a v-else :href="to" target="_blank" rel="noopener">
      <slot />
    </a>
  </div>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  data: () => ({
    isExternal: false
  }),
  watch: {
    to: {
      handler(val) {
        this.isExternal = val && isExternal(val)
      },
      immediate: true
    }
  }
}
</script>
