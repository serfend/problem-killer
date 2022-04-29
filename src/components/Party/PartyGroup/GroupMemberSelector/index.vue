<template>
  <el-form label-width="5rem">
    <el-form-item label="党组织">
      <PartyGroupSelector v-model="group" :code.sync="company" />
    </el-form-item>
    <el-form-item label="成员">
      <el-card v-loading="loading" style="width:30rem">
        <div v-if="users.length">
          <SingleItem
            v-for="u in users"
            :key="u.id"
            :data="u"
            :selected.sync="u.selected"
            :disabled="exceptDict[u.userName]"
          />
        </div>
        <NoData v-else />
      </el-card>
    </el-form-item>
    <el-button type="success" style="width:100%" @click="handleSubmit">确定</el-button>
  </el-form>
</template>

<script>
import { members } from '@/api/zzxt/party-group'
import { debounce } from '@/utils'
export default {
  name: 'GroupMemberSelector',
  components: {
    PartyGroupSelector: () => import('../PartyGroupSelector'),
    SingleItem: () => import('./SingleItem'),
    NoData: () => import('@/views/Loading/NoData')
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    width: { type: String, default: '15rem' },
    value: { type: [String, Array], default: null },
    multi: { type: Boolean, default: false },
    except: { type: Array, default: () => [] }
  },
  data: () => ({
    company: null,
    options: [],
    loading: false,
    group: null,
    code: null,
    users: []
  }),
  computed: {
    requireRefresh() {
      return debounce(() => {
        this.refresh()
      }, 1e2)
    },
    userCompany() {
      return this.$store.state.user.globalCompany
    },
    exceptDict() {
      const dict = {}
      const list = this.except
      if (!list) return dict
      list.forEach(i => {
        dict[i] = true
      })
      return dict
    }
  },
  watch: {
    company: {
      handler(val) {
        this.requireRefresh()
      },
      immediate: true
    },
    group: {
      handler(val) {
        this.requireRefresh()
      },
      immediate: true
    }
  },
  mounted() {
    this.requireRefresh()
  },
  methods: {
    refresh() {
      this.loading = true
      const company = this.company
      members({ company, groupid: this.group })
        .then(data => {
          this.users = data.list
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSubmit() {
      this.$emit('submit', this.users.filter(i => i.selected), () => {
        this.users.map(i => {
          i.selected = false
        })
      })
    }
  }
}
</script>
