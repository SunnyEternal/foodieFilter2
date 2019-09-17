<template>
  <div class="loading mask" style="display:none;z-index:600;">
    <div class="cricle">
      <em v-if="!!showMsgBg.src" class="showMsgBg bgImgSize" :style="{backgroundImage : 'url('+ showMsgBg.src + ')', backgroundColor : msgColor}"></em>
      <div class="cricleWpr">
        <img v-if="!!loadingImg" :src="loadingImg.src" class="loadingIcon" style="width:1.4rem" alt="" />
        <!-- <var :style="{color: msgColor}"> -->
          <!-- 正面拍照 效果更佳 -->
          <!-- 拍摄正脸照片，效果更佳 -->
          <!-- <img :src="loadingText.src" style="width:2.6rem" alt=""> -->
        <!-- </var> -->
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

  export default {
    mounted () {
      console.log(this.$store.state.modA);
    },
    computed: {
      // ...mapState({
      //   loadingImg: state => state.modA.commonConfigData.loadingImg,
      //   showMsgBg: state => state.modA.page1.p1_showMsgBg,
      //   msgColor: state => state.modA.page1.msgColor,
      // }),
      // distImg:this.myApp.distImg
    }
  }
</script>
<style lang="scss">
.mask{
  position: fixed;left:0;top:0;width:100%;bottom:0;background-color: rgba(0,0,0,.2);
  display: flex;align-items: center;justify-content: center;
  .showMsgBg{
      position: absolute;left:0;top:0;right:0;bottom:0;z-index:1;
      background-size: 100%;
  }
}
.loading{
  flex-direction: column;
  .cricle{
    width:4.5rem;height:4.5rem;text-align: center;background-color: grey;border-radius: .3rem;position: relative;overflow: hidden;
    background-color:#3c486e;
    var{
     display: block;font-size: .32rem;margin-top:.66rem;color:#fff;font-weight: normal;letter-spacing: .02rem;
    }
  }
  .cricleWpr{
    height: 100%;position: relative;z-index:2;
    display: flex;flex-direction: column;align-items: center;justify-content:center;
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
