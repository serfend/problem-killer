<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane v-for="(p,i) in models" :key="i">
        <ul class="list">
          <li v-for="(item,j) in p.files" :key="j" class="item">
            <SingleFile class="item-card" />
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SingleFile from './SingleFile'
export default {
  name: 'ApplyExportXls',
  components: { SingleFile },
  data: () => ({
    models: [{ alias: '???' }]
  })
}
</script>

<style lang="scss" scoped>
.list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
}

.list .item {
  width: 320px;
  margin: 10px;
}

.list .item .item-card {
  position: relative;
  cursor: pointer;
}

.list .item .item-card .title {
  margin: 10px 0 0 0;
}

.list .item .item-card .spider-count,
.list .item .item-card .owner {
  font-size: 12px;
  color: grey;
  font-weight: bolder;
}

.list .item .item-card .description-wrapper {
  padding-bottom: 5px;
  margin-bottom: 0;
  border-bottom: 1px solid #ebeef5;
}

.list .item .item-card .description {
  font-size: 12px;
  line-height: 16px;
  color: grey;
}

.list .item .item-card .tags {
  margin-bottom: -5px;
}

.list .item .item-card .tags .tag {
  margin: 0 5px 5px 0;
}

.list .item .item-card .el-row {
  margin-bottom: 5px;
}

.list .item .item-card .el-row:last-child {
  margin-bottom: 0;
}

.list .item .item-card .btn-edit {
  z-index: 1;
  color: grey;
  position: absolute;
  top: 11px;
  right: 40px;
}

.list .item .item-card .btn-close {
  z-index: 1;
  color: grey;
  position: absolute;
  top: 10px;
  right: 10px;
}

.empty-list {
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 240px);
}
</style>
