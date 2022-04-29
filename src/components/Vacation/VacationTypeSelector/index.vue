<template>
  <div v-loading="loading">
    <el-link
      v-show="innerHide&&urlDict"
      type="primary"
      @click="innerHide = false"
    >{{ iType||'未选择' }}</el-link>
    <ul
      v-if="!loading"
      class="card-list"
      :style="{top:innerHide?'-17rem':0,transform: innerHide?'scale(0)':null,opacity:innerHide?0:1,position:innerHide?'absolute':null}"
    >
      <li
        v-for="(v,i) in list"
        :key="i"
        class="card-item"
        :style="getStyle(v)"
        @click="selectType(v)"
      >
        <div class="item-content">
          <span class="item-title text-gradient">{{ v.alias }}</span>
          <div class="outer-description">
            <component
              :is="`${entityType}TypeDetail`"
              v-model="list[i]"
              :show-tag="false"
              :left-length="leftLength"
              class="inner-description"
            />
          </div>
        </div>
      </li>
    </ul>
    <el-link v-show="innerHide&&iType" @click="cancelSelect">取消选择</el-link>
  </div>
</template>

<script>
const bgPath = 'dataview/vacationtype'
const staticfile = 'file/staticfile/'
import { requestFile } from '@/api/common/file'
export default {
  name: 'VacationTypeSelector',
  components: {
    vacationTypeDetail: () => import('../VacationType/VacationTypeDetail'),
    indayTypeDetail: () => import('../VacationType/IndayRequestTypeDetail')
  },
  model: {
    prop: 'nowSelect',
    event: 'change'
  },
  props: {
    nowSelect: { type: String, default: null },
    types: { type: Array, default: null },
    leftLength: { type: Number, default: 0 },
    entityType: { type: String, required: true },
    checkFilter: { type: Boolean, default: true },
    hide: { type: Boolean, default: false }
  },
  data: () => ({
    loading: false,
    iType: null,
    defaultUrl: null,
    urlDict: {},
    innerHide: true
  }),
  computed: {
    nowVacationType() {
      const dict = this.requestTypesDic
      const s = dict[this.iType]
      return s
    },
    requestTypes() {
      const types = this.requestTypesDic
      if (!types) return null
      const keys = Object.keys(types)
      const r = keys.map(i => types[i])
      this.$emit('update:types', r)
      return r
    },
    requestTypesDic() {
      const r =
        this.entityType === 'vacation'
          ? this.$store.state.vacation.vacationTypes
          : this.$store.state.vacation.requestTypes
      return r
    },
    list() {
      return (
        this.requestTypes &&
        this.requestTypes
          .filter(i => !i.disabled)
          .map(i => {
            i.backgroundUrl = this.getBackground(i)
            i.invalid = this.checkDisabled(i)
            return i
          })
      )
    }
  },
  watch: {
    hide: {
      handler(val) {
        console.log('hide', val)
        if (val !== this.innerHide) this.innerHide = val
      },
      immediate: true
    },
    innerHide(val) {
      this.$emit('update:hide', val)
    },
    vacationType: {
      handler(val) {
        this.iType = val
      },
      immediate: true
    },
    types: {
      handler(val) {
        this.$nextTick(() => {
          this.loadBgUrl()
        })
      },
      immediate: true
    },
    nowSelect: {
      handler(val) {
        this.iType = val
      },
      immediate: true
    }
  },
  mounted() {
    requestFile({ filePath: bgPath, fileName: 'default.jpg' }).then(data => {
      const item = data.model || data.file
      const id = item.id
      const url = `${staticfile}${id}`
      this.defaultUrl = require('@/utils/website').getWebUrlPath(url)
    })
  },
  methods: {
    getStyle(v) {
      const iType = this.iType
      const invalid = v.invalid
      return {
        background: v.backgroundUrl,
        transition: 'all 0.5s ease',
        'box-shadow':
          v.name === iType ? '0 0 0.5rem 0.5rem rgba(0, 139, 255, 0.5)' : '',
        cursor: invalid ? 'no-drop' : 'pointer',
        filter: invalid ? 'grayscale(1)' : null,
        opacity: invalid ? 0.2 : 1
      }
    },
    getBackground(v) {
      const bg = this.urlDict[v.name] || this.defaultUrl
      if (bg) {
        return `url(${bg}) center center/cover no-repeat`
      }
      return 'gray'
    },
    loadBgUrl() {
      const types = this.requestTypes
      if (!types) {
        return setTimeout(() => {
          this.loadBgUrl()
        }, 200)
      }
      const cb = (data, type) => {
        const item = data.model || data.file
        const id = item.id
        this.urlDict[type.name] = id
          ? require('@/utils/website').getWebUrlPath(`${staticfile}${id}`)
          : null
      }
      const null_data = {
        file: {
          id: null
        }
      }
      const loader = []
      for (let i = 0; i < types.length; i++) {
        const type = types[i]
        if (type.background && !this.urlDict[type.name]) {
          loader.push(
            new Promise(res => {
              requestFile({ filePath: bgPath, fileName: type.background })
                .then(d => res(d))
                .catch(e => {
                  console.warn('加载失败', type.background, e)
                  res(null_data)
                })
            })
          )
        }
      }
      if (this.loading) return
      if (loader.length > 0) this.loading = true
      Promise.all(loader).then(result => {
        for (let i = 0; i < result.length; i++) {
          cb(result[i], types[i])
        }
        this.loading = false
      })
    },
    checkDisabled(v) {
      if (!this.checkFilter) return false
      const leftLength = this.leftLength
      if (v.primary && leftLength === 0) return '已无假可休'
      if (!v.allowBeforePrimary && !v.primary && leftLength > 0) {
        return '正休假未休完'
      }
      return false
    },
    cancelSelect() {
      this.$emit('change', null)
      this.iType = null
    },
    selectType(v) {
      if (v.invalid) {
        this.$notify.error({
          title: '无法休此类型假期',
          message: v.invalid
        })
        return
      }
      this.iType = v.name
      this.$emit('change', this.iType)
      this.requireHide()
    },
    requireHide() {
      this.innerHide = true
    }
  }
}
</script>
<style lang="scss" scoped>
.card-list {
  transition: all 1s ease;
  text-align: center;
  font-size: 1.5rem;
  justify-content: space-between;
  li {
    list-style: none;
  }
}
.card-item {
  height: 17rem;
  width: 12rem;
  float: left;
  margin: 0.5rem 0.7rem;
  overflow: hidden;
  .item-content {
    transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
    height: 100%;
    background-color: rgba(0, 139, 204, 0.5);
    margin-top: 14rem;
    &:hover {
      margin-top: 0;
      background-color: rgba(0, 139, 255, 0.9);
    }
  }
  .outer-description {
    font-size: 0.9rem;
    line-height: 1rem;
    color: #fff;
    text-align: left;
  }
  .item-title {
    overflow-wrap: normal;
    color: #fff;
    padding-top: 0.5rem;
  }
  .inner-description {
    padding: 0 0.5rem;
  }
}
.text-gradient {
  display: inline-block;
  color: #fff;
}
</style>
