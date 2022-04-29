<template>
  <span>{{ value||'未归队' }}</span>
</template>

<script>
export default {
  name: 'ExecuteStatus',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: { type: String, default: null }
  }
}
</script>
