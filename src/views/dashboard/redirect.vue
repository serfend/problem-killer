<template>
  <span />
</template>

<script>
export default {
  name: 'DashboardRedirect',
  beforeCreate() {
    this.$router.push('/dashboard')
  }
}
</script>
