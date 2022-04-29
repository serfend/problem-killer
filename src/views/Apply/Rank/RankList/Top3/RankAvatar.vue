<template>
  <li :class="`rank-${index} ${data.direction}`">
    <a :href="data.href" target="_blank">
      <div class="content-detail">
        <div :class="`img-contain rank-${index}`">
          <UserAvatar :user="data.user" size="80px">
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
          </UserAvatar>
        </div>
        <h3>
          <span class="name t-over-hidden t-nowrap">{{ data.title }}</span>
          <em v-if="data.status" class="live" style>{{ data.status }}</em>
          <div v-if="data.company" style="font-size:9px;">{{ data.company }}</div>
        </h3>
        <p style="color: #888888;">
          <span>{{ data.levelDesc }}</span>
        </p>
        <div :class="`rank-number ${data.direction}`">
          <a>0{{ index }}</a>
          <span />
        </div>
      </div>
    </a>
  </li>
</template>

<script>
export default {
  name: 'RankAvatar',
  components: {
    UserAvatar: () => import('@/components/User/UserAvatar')
  },
  props: {
    index: { type: Number, default: 1 },
    data: { type: Object, default: null, require: true }
  }
}
</script>
<style lang="scss" scoped>
.t-no-wrap,
.t-nowrap {
  white-space: nowrap;
}
.t-over-hidden {
  overflow: hidden;
  text-overflow: ellipsis;
}
@import '../style';
li {
  width: 200px;
  float: left;
  margin-right: 30px;
  height: 335px;
  position: relative;
  list-style: none;
  h3 .name {
    max-width: 95px;
    display: inline-block;
    vertical-align: middle;
  }
  .rank-number {
    text-align: left;
    font-style: italic;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  div.content-detail {
    bottom: 4px;
    height: 180px;
    position: absolute;
    text-align: center;
    background: #f8f8f8;
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.12);
    width: 200px;
    border-radius: 10px;
    p {
      text-align: center;
      margin: 5px 0 15px;
    }
    .rank-number {
      width: 80px;
      height: 34px;
      line-height: 34px;
      margin: 0 auto;
      font-size: 24px;
      border-radius: 20px;
      padding-left: 10px;
    }
    h3 {
      text-align: center;
      margin: 10px 0;
      font-size: 17px;
    }
  }
}
li.rank-2.down .rank-number span,
li.rank-2.up .rank-number span {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAAAkElEQVR4AZ2SMQ4CMQwE3dFBR8knoKRMIvG18L8YBPACOh6wZBGkAG0gZ2l1OetmJF9sqtIZy+TYh4LMs41UuGAVHdcKg+GZvUnwkETBWjIAa0kfvjNdCf+whI/YMkpC1nhVCrZXCQmTm0DBPyT5PYI/G47bN/wh4TccoaC0BdudMEuOdX3O/9iTRTxgQ4bvD6u0PJHteRJ0AAAAAElFTkSuQmCC)
    no-repeat;
}

li.rank-2.down .rank-number span {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

li.rank-2.balance .rank-number span {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAALCAYAAAByF90EAAAAoUlEQVR4AWIY2qDh/3+W0P//2UAY0BpVHSAAAtEJHMP+kw3s3kdXYClHMMlPd7D1eYfdScML4I7XN4SCQbOgoAoaM+qdkkf6HC855PMaPcLWeQWErrGhvWZtIBU1BB2sGDx02o+bBhHGqxoxEk0P2J2+LClk2EjeI9B5I7xWo32B3efKl0Y0t941Evy8X77GHm8Fu2CRuxts1pD2/+n/R9kC6YckCEXf5Q0AAAAASUVORK5CYII=)
    no-repeat;
}

li.rank-2 .img {
  border: 2px solid #44d6ff;
  overflow: hidden;
}

li.rank-2 .img img {
  width: 100%;
  height: 100%;
}

li.rank-2 div.content-detail .img-contain {
  position: relative;
  margin-top: -52px;
}

li.rank-2 div.content-detail .img-contain .deco {
  top: -29px;
  left: 21px;
  position: absolute;
}

li.rank-2 div.content-detail h3 {
  color: #44d6ff;
}

li.rank-2 div.content-detail .rank-number {
  position: relative;
  color: #44d6ff;
  border: 1px solid #44d6ff;
}

li.rank-2 div.content-detail .rank-number span {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 20px;
  height: 12px;
}

li.rank-1 div.content-detail {
  height: 200px;
}

li.rank-1.down .rank-number span,
li.rank-1.up .rank-number span {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAAAjklEQVR4AWPABf5nuIn9z3Tr/p/u0gViM5AC/ue7yP1Pd70H1PwfhEFskBhZmtENIUMzpiFkasY0hLDmDJfPIIzLEHho49Sc5WIDwrgMAccOKKpwaYa5ELchLl1gA/BpJmBIF8wL16Ga32BoxjTkDUSt6zV4Avuf68kOdIkxkOYjmE7KXfj/57iagPSA+ADEkgv8aktzjQAAAABJRU5ErkJggg==)
    no-repeat;
}

li.rank-1.down .rank-number span {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

li.rank-1.balance .rank-number span {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAALCAYAAAByF90EAAAAlklEQVR4AWMY2uB/QwPL/4ZQNhAGsTEVZLr6/c9wvQbEP4D4wP9sd21UeXeX/xkuF4Fyf/+nu/yH4n//012vg/RCFbkZAwX+gCQR2PXx/zI/XrB8tpcaUOw7VA4TZ7j8BlpsBDKoG6uCLDdfqGurQHx8GGQGYYPS3SqJNcgY5DxKvAYyg7jAznZ1xhbYID0gvZRHPy0AAC+x92mVCYQRAAAAAElFTkSuQmCC)
    no-repeat;
}

li.rank-1 .img {
  border: 2px solid #ff6744;
}

li.rank-1 div.content-detail p {
  margin-bottom: 35px;
}

li.rank-1 div.content-detail .img-contain {
  position: relative;
  margin-top: -52px;
}

li.rank-1 div.content-detail .img-contain .deco {
  top: -39px;
  left: 14px;
  position: absolute;
}

li.rank-1 div.content-detail h3 {
  color: #ff6744;
}

li.rank-1 div.content-detail .rank-number {
  position: relative;
  color: #ff6744;
  border: 1px solid #ff6744;
}

li.rank-1 div.content-detail .rank-number span {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 20px;
  height: 12px;
}

li.rank-3 {
  margin-right: 0;
}

li.rank-3.down .rank-number span,
li.rank-3.up .rank-number span {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAAAiElEQVR4AZ2RAQYCQRiFPyCggABdogCdcLtNs0W6RwF7ggU6wGsfP4Ins49nxs/3MfOTogd7jVzUGHynJ2ocdGVaqurk2Vo4SzrgLOmAsyTDfKpZ4h+OcOPsJolZvKoEU4mSxlCCDJMlJfATGu8azr9wkMwFv8zi6M5GI8fl3PInerLTjZMZgC86iQ6TWZ9e/gAAAABJRU5ErkJggg==)
    no-repeat;
}

li.rank-3.down .rank-number span {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

li.rank-3.balance .rank-number span {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAALCAYAAAByF90EAAAAjUlEQVR4AWMY2uD/fgaW/1cZ2EAYxMZUsIXB7/9mhmtA/AOID/zfwaCNJu/yfxPDRSD+C8T/QRio7h8QXwfphSkyBkr8AUsiFD3+f4SBFyy/lUENyP+OLI+m9jcQG4EM6sahwBdqURWIjw+DzCBoEJCuJNYgY5DzKPEayAyiAhso5owjsK+B9FIe/bQAAB3l+KZGi6STAAAAAElFTkSuQmCC)
    no-repeat;
}

li.rank-3 .img {
  border: 2px solid #ffb200;
}

li.rank-3 div.content-detail .img-contain {
  position: relative;
  margin-top: -52px;
}

li.rank-3 div.content-detail .img-contain .deco {
  top: -39px;
  left: 14px;
  position: absolute;
}

li.rank-3 div.content-detail h3 {
  color: #ffb200;
}

li.rank-3 div.content-detail .rank-number {
  position: relative;
  color: #ffb200;
  border: 1px solid #ffb200;
}

li.rank-3 div.content-detail .rank-number span {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 20px;
  height: 12px;
}

li .img {
  overflow: hidden;
  position: relative;
  width: 104px;
  height: 104px;
  border-radius: 50%;
  margin: 0 auto;
}

li .img img {
  width: 100%;
  height: 100%;
}
</style>
