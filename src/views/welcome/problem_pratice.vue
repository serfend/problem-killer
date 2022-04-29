<template>
  <Welcome />
</template>

<script>
export default {
  name: 'TsWelcome',
  components: {
    Welcome: () => import('./index')
  }
}
</script>
