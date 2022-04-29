<template>
  <BaseDictionaryType :type="type" :dictionary="dict" />
</template>

<script>
export default {
  name: 'ConferRecordContentType',
  components: {
    BaseDictionaryType: () => import('../BaseDictionaryType')
  },
  model: {
    prop: 'type',
    event: 'change'
  },
  props: {
    type: { type: Number, default: -1 }
  },
  computed: {
    dict() {
      return this.$store.state.party.conferRecordContentTypesDict
    }
  }
}
</script>
