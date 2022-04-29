<template>
  <BaseDictionaryType :type="type" :dictionary="dict" :config="{props:{alias:'name'}}" />
</template>

<script>
export default {
  name: 'PartyDuty',
  components: {
    BaseDictionaryType: () => import('../BaseDictionaryType')
  },
  model: {
    prop: 'type',
    event: 'change'
  },
  props: {
    type: { type: [Number, Array], default: -1 }
  },
  computed: {
    dict() {
      return this.$store.state.party.partyDutiesDict
    }
  }
}
</script>
