<template>
  <el-form>
    <el-collapse>
      <el-form-item v-for="i in innerData" :key="i.key" :label="i.label">
        <el-collapse-item>
          <el-tooltip slot="title" content="启用后将跟随父级默认值">
            <el-switch
              v-if="i.__setting&&i.__setting.useParent!==undefined"
              v-model="i.__setting.useParent"
            />
          </el-tooltip>
          <el-form-item v-if="i.__setting&&i.__setting.type" label="默认值">
            <component :is="i.__setting.type" v-model="i.__setting.default" />
          </el-form-item>
          <component
            :is="i.type"
            v-show="!i.__setting||(i.__setting&&!i.__setting.useParent)"
            v-model="i.value"
            :alias="i.key"
            v-bind="i.__setting&&i.__setting.props?i.__setting.props:$props"
          />
        </el-collapse-item>
      </el-form-item>
    </el-collapse>
  </el-form>
</template>

<script>
export default {
  name: 'MagicForm',
  model: {
    prop: 'data',
    event: 'changed'
  },
  props: {
    /* prop to defined formitems,for example you can use:
  {
    color:{
      label:'theme primary color',
      value:['#ff00ffff','#ff0000ff'],
      type:'el-color-picker' // would generate a color picker list,also you can use ()=>import(`components`)
    },
    server:{
      label:'api server',
      value:{
        __default:'server.com', // default value when child use `__useParent` it would effect
        server1:{
          label:'server primary',
          value:'google.com',
          type:'el-input',
          __useParent:false
        },
        server2:{
          label:'server emergency',
          value:'m1.google.com',
          type:'el-input',
          __useParent:true
        }
      }
    } // would generate 2 items in item `server`
  }
  to generate 2 formitems on which user can input custome value in it,
  and its would be emit by update:data
   */
    data: {
      type: Object,
      default: null
    },
    alias: {
      type: String,
      default: null
    },
    // leaf node will not emit change when setting modify
    // only root node will
    isLeafNode: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    innerData: null,
    setting: {
      useParent: false,
      default: null,
      type: null,
      attrs: null
    },
    loading: false
  }),
  watch: {
    innerData: {
      handler(val) {
        this.$nextTick(() => {
          this.updateValue()
        })
      },
      deep: true
    },
    default: {
      handler(val) {
        this.$nextTick(() => {
          this.updateValue()
        })
      }
    },
    data: {
      handler(val) {
        if (this.innerData) return
        this.loading = true
        val = val || {}
        if (val.__setting) {
          this.setting = val.__setting
          delete val.__setting
        }
        var list = Object.keys(val)
        this.innerData = list.map(i => {
          var item = Object.assign({ key: i }, val[i])
          if (!item.type) {
            var isObj =
              Object.prototype.toString.call(item.value) === '[object Object]'
            if (isObj) {
              item.type = 'MagicForm'
            } else {
              throw new Error(
                `form item invalid:${item.key} is leaf node but its type not defined`
              )
            }
          }
          return item
        })
        setTimeout(() => {
          this.loading = false
        }, 500)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    updateValue() {
      if (this.isLeafNode) {
        console.log('leaf not change')
        return
      }
      this.$nextTick(() => {
        if (this.loading) return
        var val = this.innerData
        var changedItem = {}
        for (var item of val) {
          changedItem[item.key] = Object.assign({}, item)
          var setting = changedItem[item.key].__setting
          if (setting) {
            if (setting.useParent) {
              changedItem[item.key].value = this.setting.default
            }
            if (setting.freezing) {
              // console.log('freezing')
              return
            }
            // console.log('update', setting)
          }
        }
        changedItem.__setting = {
          useParent: this.setting.useParent,
          default: this.setting.default,
          type: this.setting.type
        }
        this.$emit('changed', changedItem)
      })
    }
  }
}
</script>

<style>
</style>
