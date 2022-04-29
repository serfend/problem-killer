<template>
  <index entity-type="vacation" />
</template>

<script>
export default {
  name: 'VacationMyApply',
  components: {
    index: () => import('./index')
  }
}
</script>
