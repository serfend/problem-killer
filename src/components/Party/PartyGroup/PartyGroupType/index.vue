<template>
  <BaseDictionaryType :type="type" :dictionary="dict" />
</template>

<script>
export default {
  name: 'PartyGroupType',
  components: {
    BaseDictionaryType: () => import('../../BaseDictionaryType')
  },
  model: {
    prop: 'type',
    event: 'change'
  },
  props: {
    type: { type: [Number, Array], default: -1 },
    aliasMapFunc: { type: Function, default: name => name }
  },
  computed: {
    dict() {
      let func = this.aliasMapFunc
      if (!func) func = i => i
      const dict = Object.assign({}, this.$store.state.party.partyGroupTypeDict)
      if (!func || !dict) return {}
      for (const key in dict) {
        dict[key].alias = func(dict[key].alias)
      }
      return dict
    }
  }
}
</script>
