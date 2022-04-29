<template>
  <div />
</template>

<script>
import { downloadByPath } from '@/api/common/file'
import { downloadBlob, exportXlsByTemplate } from '@/utils/file'
export default {
  name: 'Test',
  mounted() {
    this.test()
  },
  methods: {
    test() {
      downloadByPath({
        path: 'tmp',
        filename: 'template-zkyp.xlsx',
        ignoreError: false,
        responseType: 'arraybuffer'
      }).then(data => {
        const values = {
          create: '2021年度3月份',
          member: [
            {
              realName: '用户一',
              rank: 1,
              level: '优秀',
              idcard: '111111',
              company: '单位一',
              remark: '233'
            },
            {
              realName: '用户二',
              rank: 2,
              level: '优秀',
              idcard: '111111',
              company: '单位一',
              remark: '223133'
            },
            {
              realName: '用户三',
              rank: 3,
              level: '称职',
              idcard: '111111',
              company: '单位二',
              remark: '231113'
            }
          ]
        }
        const outdata = exportXlsByTemplate(data, values)
        downloadBlob(outdata, 'demp.xlsx')
      })
    }
  }
}
</script>
