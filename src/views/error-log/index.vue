<template>
  <div class="errPage-container">
    <ErrorA />
    <ErrorB />
    <!-- $t is vue-i18n global function to translate lang -->
    <h3>{{ $t('errorLog.title') }}</h3>
    <aside>暂无错误</aside>
  </div>
</template>

<script>
import ErrorA from './components/ErrorTestA'
import ErrorB from './components/ErrorTestB'

export default {
  name: 'ErrorLog',
  components: { ErrorA, ErrorB }
}
</script>

<style scoped>
  .errPage-container {
    padding: 30px;
  }
</style>
