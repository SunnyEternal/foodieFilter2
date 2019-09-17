<template>
  <div class="loading mask" style="display:none;z-index:600;">
    <div class="cricle">
      <img :src="loadingImg.src" class="loadingIcon" style="width:1.2rem" alt="" />
      <var>
        <!-- 正面拍照 效果更佳 -->
        <img :src="require('./loading_text.png')" style="width:2.6rem" alt="">
      </var>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

  export default {
    computed: {
      ...mapState({
        loadingImg: state => state.modA.commonConfigData.loadingImg,
      }),
      // distImg:this.myApp.distImg
    }
  }
</script>
<style lang="scss">
.mask{
  position: fixed;left:0;top:0;width:100%;bottom:0;background-color: rgba(0,0,0,.2);
  display: flex;align-items: center;justify-content: center;
}
.loading{
  flex-direction: column;
  .cricle{
    width:4.5rem;height:4.5rem;text-align: center;background-color: #fff;border-radius: .3rem;
    background-color:#fff;
    var{
     display: block;font-size: .26rem;margin-top:.52rem;color:#3c639e;font-weight: bolder;letter-spacing: .02rem;
    }
  }
}
.loading.run .loadingIcon{
  will-change: transform;
  animation: loadRun 1.8s linear infinite;
}
@keyframes loadRun{
  0%{
    transform:rotateZ(0deg);
  }
  100%{
    transform:rotateZ(360deg);
  }
}
</style>
