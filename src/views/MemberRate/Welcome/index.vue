<template>
  <Welcome menu-name="xjxt.member-rate" :show-title="false" style="height:55rem" main-style="margin-top:14rem" />
</template>

<script>
import { default_pages } from './setting'
export default {
  name: 'MemberRateWelcome',
  components: {
    Welcome: () => import('@/views/welcome')
  },
  data: () => ({ routes: default_pages })
}
</script>
