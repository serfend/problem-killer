<template>
  <span>
    <el-popover
      v-if="v"
      v-model="show"
      trigger="hover"
      :placement="placement"
      @hide="onHide"
      @show="hasShow = true"
    >
      <component :is="`${entityType}TypeDetail`" v-if="hasShow" v-model="v" style="width:15rem" />
      <span slot="reference">
        <el-tag v-if="showTag" size="mini" :type="v.primary?'success':'danger'">{{ v.alias }}</el-tag>
        <span v-else-if="plain">{{ v.alias }}</span>
        <span v-else>
          <span style="float: left">{{ v.alias }}</span>
          <span v-if="isVacation">
            <span v-if="!v.allowBeforePrimary&&!v.primary&&leftLength>0" class="warning">正休假未完成</span>
            <span v-else-if="v.primary&&leftLength==0" class="warning">已无假可休</span>
          </span>
        </span>
      </span>
    </el-popover>
    <span v-else>{{ !type?'无类别':type }}</span>
  </span>
</template>

<script>
export default {
  name: 'VacationType',
  components: {
    vacationTypeDetail: () => import('./VacationTypeDetail'),
    vacTypeDetail: () => import('./VacationTypeDetail'),
    indayTypeDetail: () => import('./IndayRequestTypeDetail')
  },
  model: {
    prop: 'type',
    event: 'change'
  },
  props: {
    type: { type: String, default: null },
    showTag: { type: Boolean, default: true },
    plain: { type: Boolean, default: false },
    leftLength: { type: Number, default: 0 },
    directShow: { type: Boolean, default: false },
    entityType: { type: String, required: true },
    placement: { type: String, default: 'top' }
  },
  data: () => ({
    show: false,
    hasShow: false
  }),
  computed: {
    isVacation() {
      return this.entityType === 'vacation' || this.entityType === 'vac'
    },
    v() {
      const dict = this.vacationTypesDic
      if (!dict) return null
      const s = dict[this.type]
      return s
    },
    vacationTypes() {
      const types = this.vacationTypesDic
      if (!types) return null
      const keys = Object.keys(types)
      return keys.map(i => types[i])
    },
    vacationTypesDic() {
      return this.isVacation
        ? this.$store.state.vacation.vacationTypes
        : this.$store.state.vacation.requestTypes
    }
  },
  watch: {
    directShow: {
      handler(val) {
        this.show = val
      }
    }
  },
  methods: {
    onHide() {
      this.$emit('update:directShow', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.warning {
  float: right;
  color: #ff92a6;
  font-size: 0.7rem;
}
</style>
