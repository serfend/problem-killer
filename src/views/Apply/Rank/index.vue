<template>
  <div class="ranker">
    <div class="banner">
      <el-image :src="banner_img" />
    </div>
    <div class="container">
      <EntityTypeNav :vac-type.sync="form.vacType" :level-type.sync="form.levelType" style="margin-top:1rem" />
      <div class="rank-main">
        <div class="rank-content">
          <TypeNav :vac-type="form.vacType" :entity-type.sync="form.entityType" />
          <div v-loading="loading" class="rank-content-detail">
            <div class="selector-container">
              <RatingCycleSelector :raw-date.sync="form.date" :rating-type="form.type" :rating-types="types" />
              <el-select v-model="form.type" style="width:7rem;">
                <el-option v-for="item in types" :key="item.code" :label="item.desc" :value="item.code">
                  <span :style="{'float': 'left','color':item.color}">{{ item.desc }}</span>
                  <span style="float: right; color: #f0f0f0; font-size: 10px">{{ item.code }}</span>
                </el-option>
              </el-select>
              <CompanySelector v-model="form.company" style="width:10rem" />
            </div>
            <RankList :loading.sync="loading" :query-form="queryForm" :level-desc-func="levelDescFunc" />
          </div>
        </div>
      </div>
    </div>
    <BiliComment id="7f27df03-bb1e-4a2a-b8cb-04a1039c3d23" />
  </div>
</template>

<script>
import { getRankType } from '@/api/apply/query'
import { parseTime } from '@/utils'
export default {
  name: 'Rank',
  components: {
    BiliComment: () => import('@/components/BiliComment'),
    CompanySelector: () => import('@/components/Company/CompanySelector'),
    RankList: () => import('./RankList'),
    TypeNav: () => import('./TypeNav'),
    EntityTypeNav: () => import('./EntityTypeNav'),
    RatingCycleSelector: () =>
      import('@/views/MemberRate/RatingTypeOption/RatingCycleSelector')
  },
  data: () => ({
    loading: false,
    types: [],
    form: {
      type: 2,
      date: new Date(),
      entityType: null,
      levelType: null,
      vacType: null,
      company: null
    }
  }),
  computed: {
    levelDescFunc () {
      const lev = this.form.levelType
      const vac = this.form.vacType
      if (!lev || !vac) return s => s
      const dict = {
        vac: {
          c: s => `${s}次休假`,
          l: s => `${s}天休假`
        },
        inday: {
          c: s => `${s}次请假`,
          l: s => `${Math.ceil(s / 3600)} 小时请假`
        }
      }
      return dict[vac][lev]
    },
    queryForm() {
      const f = this.form
      return {
        date: parseTime(f.date),
        rankType: f.type,
        vacType: f.vacType,
        company: f.company && f.company.code,
        entityType: this.requestEntityType
      }
    },
    requestEntityType() {
      const { entityType, levelType, vacType } = this.form
      return `${vacType}.${entityType}@${levelType}`
    },
    banner_img() {
      const url =
        'file/frompath?path=client-sfvue&filename=applies_rank.png'
      return require('@/utils/website').getWebUrlPath(url)
    },
    currentUser() {
      return this.$store.state.user.userid
    }
  },
  watch: {
    '$store.state.user.companyid': {
      handler(v) {
        this.form.company = {
          code: v
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.load_types()
  },
  methods: {
    load_types() {
      getRankType().then(data => {
        this.types = data.list.map(i => ({
          code: i.id,
          name: i.name,
          desc: i.alias,
          type: i.shortAlias
        }))
        this.form.type =
          this.types &&
          this.types.reduce((prev, cur) => {
            return prev > cur.code ? cur.code : prev
          }, 1e3)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.entry-half,
.selector-container {
  z-index: 1;
  position: absolute;
  right: 0;
  top: 0;
}
.img-contain {
  position: relative;
}

.img-contain:before {
  width: 100%;
  position: absolute;
  content: '';
  display: block;
  background: no-repeat top;
}

.img-contain.rank-1:before {
  top: -50px;
  height: 105px;
  background-image: url(//s1.hdslb.com/bfs/static/blive/blfe-live-spa/static/img/first.39f7245.png);
}

.img-contain.rank-2:before {
  top: -28px;
  height: 75px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKIAAABLCAYAAADzuVxRAAAIvUlEQVR4Ae2dA5QjWRuGe2Zt27Zt27Zt27Zt27Ztb9vWpt1B1X3/9z/JbG6+qNKd7tlKvuecZzm5g/ucSuFWVUmhAWBDeg/9lv5Nv6DX0qVoifrftJB+M7PT15Eel16gkz6WaojT0i/hjYfolKP4uVag+9JD6bZ0Fg1pkhris8iNkWwZ96B/UUmIPkxn06CKO8T1Ifh7CLioATi6GrihGeiIwCCRQTozLfHoNchOGV1coyreEO+SEW5XCmz5d9y9K4A+JynGgz2Ofwy8004X0rCKM8RvYXFJoxWh5TOdkNzsYexlqQMLA5gf+4EPe1hdGKl4QcMqzhD/gsXxNalDvL0Vkgc8jH0nLHodmKOq42NuRV/sgsSh82tcxRfih7C4pSV1iO8HILnaw9ilCR9oSh53K1oXhGR/jav4QrwCFh1h4MDKxFjOrgccA4NEtvcwdj8sditPHfnL3ZCcr3EVX4hL0Ags+l2YV7qB+9qAT3sRdpEUYS2dwsPYAVjYgdu+E4DkDI2rKEL0fnpl0MWQSQ7xDo/jfgmL57qSI9y7Iho+Etla4yrOECfQG5CCZ7ow+GU/gkjE0L08jHua/NyTncCe5SyNEZ5eB9QMQ9JFp9O4/BviBLoM3Y5uOcKTw0fLr9MXu2EOrowe8SIRh56TZbyZaTOVGKTnNA3LnyFOpKfQSir5VZx49uJrsLi2OfoVemotEDYpA3qTrpJmrBnppxQi7vAvA0jFgxqVP0Ocg36I7DxLp/O4VW2BxRFV8f25q5oAeeBi8TY9lq5KZ6fb0VIIvuqLjvXbIBwk8vzIF1Ook3tL+AG886iHMbeDxbCB2VocXJxRBwQcGIyA2iCwS1l0nJ4IJEtoUP4M8QQIIgbmz0HgL2qQMpYds4z5BizeDlgRWu5TAfw+mHOE/Fz8SFkwQCdoUP4MsQwWjA8HWefpjqkGGoKQvJdhvO0h4BjJIYoT3dzXy8rHPcDOZfHPnVsPybcakz9DXExuCQ+JRWh7Wi0kTpr9sHloOyy4ZeUY3jy6Gri7DfikF2gLAwNOdEHDe4Hor0H++PvbPF23Vn0Q4uawKB9KH0lvBBJ5Wmdh+pcMW24N8ym3kJITNCZ/hrgBLKqH00/6gAPJrnRaOgXdjjZDcF+bHCe/1gchWU9j8meI80JwaoqvwOuakQkHKfimb2wj3JpGkg+kZtSY/Huw8gUs2sPxRa1b0fs7UB42GEAOvN8DbJPv+IQHVELSqiH5O8RdkIKIAVzABXmlGxVPdAADLgwyY57pHKP4hMfVQPKz/0PQKyt3IwPf98Ph1hE7lEYXpX4aO6qdRGc4eqQ7lgcm0jPrIPlIQ/J/iFPSG5GBdFu6bcc+urTnHgXvaEg+D1EcRT9L+yAQS/THXQ9bxHcLMw5dj7i4PCUTNjAn1HiMZfz3EbsL9+Z6XRi7Nh2GRcCB2b9i8oe4fWnKe6QvLNxIdIX2gRBUDoMhjGloDq2gL9Br6bF0e7oWXZTORmeiJf8XwEx0tsK7qV5DlF4FwTuBvIY3SN+m59KN6PS0RB1//9O/OAAT6AsQXNwwqvha6R10azqtRqAhehLADPRvWHRFYGILVL0apE/SLegUOvEa4ogEsDINJ9/amdVmeg6dXSdbQ8yLAC6Vp3T2TX8UXU0Po1PrJOdbDXFaWguLJ5OvurTQo+hUOrka4pgJ4AhY/Nj/b4AhejWdUSd1PNQQ15H3ufC/f0WX18kcTzXEFRAnWBfE6fzvE3Uix1sNcSbq0L/pyrRE1Ssrk8trdWm+hqiqGqKqIaoqxZb0DdpFB+l39Ag6xXiFqKrXIT3f0UXTfG46ugHdii4+mhBV9QhkJ0B3oyV0GroHfYWGqM3ndFkNUc3VKWkDYvw8APeIquiT0R7piN/6a/EeDSAzfXRFDVHNxeUQY9iFK18vd0IN0B6Ggww0huD8mfyowV81RDUXt5fX9qVcG4ov+2Bg0co4H+sA7Ke8HV8DOAYu4qzjNURV3dHrc4VuaI6uEz2pNv2P+bwXNod6DVFVd0KMr2WII/C7ftgcOO4hqhriDqVA0MBBnKW9hqiqZ+crxKubYPOX14OVQ+mPdIg20zvp7EUzAepM9FFYfNI7uhB/6IdBnHO9hHg7UlNPlyr4SVDXo9Xi+ZWO/a7qXN2zHHANDKIYunC2EDdBZprpzfRd+j19gx5QMK93UHeVV0PeDwA7lY1ua3hbC2x+93Jl5W7E+KYfZrfy6JNcQwYOMvOy79+8pC5hRzjowrmicWThSS9rhGSfbCF+hRhn1dmvmvAU45k6mb72IcRoDcHdL88PveI+phGX+ZZMFeJU9FDajxjyF8ITlXgnEL3GeGlj9PLOq92wKdfJ9LX1lMj3y+RHfr2jJQRHPPZ5GjvEjWglLEIGrpfBdy+HTVAn09f2IsZuZfmN0H6jWCTxMt+pk0JclQ7CYtiFc1ert4Gvb4ZNmU6mry1FjBub8xef9O422NRMCvF1a+c08mA74PUBR9uVAl0RRBDnHJ1MX3s1YrgG5uVucKHC2HxFi63iLCX22rGjczxPdEcrbNp8f3edOjNtgCDgIPLmP8CFDfl5UOqOpdHQEWd6DVGqLkp/ybC2MCy/MXP1+a7k3bmEdxwP6FezGnUC3YY+SjsguCHL/iMPdPBUJ/D6P4m+RRtCcJHISZNCXI0O6cGKmsaJdH37yb1fZLnm/PMgXHjjXTrRPn2zMa0ayemb3cphEyrYCVGXQYyggWPfMmB7Txu8MERvpFON+oT2JY3RI6pXumFTUdCToVYgxrn1yREelXyO8DF6rOXRdBu5iivnS3zB7Jf4zi7oiVBvQox3A8nHC/XBhD5+sLd40rFc9PCa/InVgnMdxDCAuaoJ2Cq2xOvnAbiIM+BluWA+l4H9SN+mhxTNMjD1S1iEXLhI5sh8PXLkDl0Ym0Z1YdqM9FyZ72ffHEp/oAO0gd6mLz9UY85B76adiBKhX9MdJsdDmFR1Ip2FTjfasf4HHNcmHUgJlHoAAAAASUVORK5CYII=);
}

.img-contain img {
  width: 104px;
  height: 104px;
}

.rank-content-detail {
  font-size: 14px;
}

.rank-content-detail .status {
  width: 31px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  font-size: 12px;
  margin: 0 auto;
}

.rank-content-detail .status,
.rank-content-detail .status.user {
  border: 1px solid #61c05a;
  color: #61c05a;
}

.rank-content-detail .status.master {
  border: 1px solid #969696;
  color: #969696;
}

.rank-content-detail .href-enable .content-detail h3,
.rank-content-detail .href-enable .img {
  cursor: pointer;
}

.container {
  position: relative;
  top: -20px;
}

.rank-main {
  width: 1160px;
  margin: 0 auto;
  padding: 33px 0;
}

#comment {
  width: 1160px;
  margin-top: 100px;
}

.banner {
  font-size: 0;
  img {
    width: 100%;
  }
}

.rank-content {
  overflow: hidden;
}
.rank-content-detail {
  position: relative;
  overflow: hidden;
  margin-left: 296px;
}
</style>
