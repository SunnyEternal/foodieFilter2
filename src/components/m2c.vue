<template>
  <div id="p4">
    <!-- <div class="tip" @click="showActRules(1)">
      活动规则
    </div> -->
    <div class="countDown">活动时间：{{actLastTime}}</div>
    <div class="p-r">
      <img :src="require('@/static/img/act_top.jpg')" width="100%" style="display:block;" alt="">
      <div class="userName">{{swiperSlides[actSwipeIndex].userName}}的作品</div>
    </div>
    <div class="wpr">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(slide, index) in swiperSlides" :key="index">
          <img class="mediaImg"  :src="cdnPrefix + slide.mediaUrl" @load="imgSize" alt="" />
          <div class="btn1"><em><img :src="require('@/static/img/likes1.png')"  alt=""> {{slide.liked}}</em></div>
        </swiper-slide>
      </swiper>

      <div class="gifts">
        <img :src="require('@/static/img/gifts.jpg')" style="width:6.67rem" alt="">
      </div>
      <!-- <div class="top">
        <em>活动日期:6月7日-6月10日<br />倒计时：5天</em>
        <div class="topWpr">
          <img src="https://dummyimage.com/420x315/b293a4/fff&text=someImg" @load="imgSize" alt="">
        </div>
      </div> -->
      <!-- <div style="text-align:center;padding:.26rem 0 .14rem;">
        <div class="btn1">
          <em><img :src="require('@/static/img/likes1.png')" alt=""> {{actStars}}</em>
        </div>
      </div> -->
      <!-- <div class="items">
        <div class="item">
          <img v-lazy="require('@/static/img/prize1.jpg')" alt="">
          <h5>拍立得相机眼部美容仪</h5>
          <h4>一等奖</h4>
        </div>
        <div class="item">
          <img v-lazy="require('@/static/img/prize1.jpg')" alt="">
          <h5>拍立得相机眼部美容仪</h5>
          <h4>一等奖</h4>
        </div>
        <div class="item">
          <img v-lazy="require('@/static/img/prize1.jpg')" alt="">
          <h5>拍立得相机眼部美容仪</h5>
          <h4>一等奖</h4>
        </div>
      </div> -->
      <div class="btns" style="margin-top:.4rem">
        <Button :sty="btn1Stlye" :eventName="'sToRegister'" @sToRegister="toJoin" />
        <div style="height:.3rem"></div>
        <Button :sty="btn2Stlye" :eventName="'sToM2M'" @sToM2M="toJoin" />
      </div>
    </div>
  </div>
</template>

<script>
// import {config, tryToApp} from '@/config/commonConfig'
// import showToast from '@/bag/vueCommon/toast/1/t'
import * as requestSupport from '@/static/js/requestSupport'
import loading from '@/bag/vueCommon/loading/1/loading'
import Button from '@/components/common/button.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import '@/static/css/swiper.css'

let _that

export default {
  props:{
    propUserInfo: Object
  },
  components:{
    Button, swiper, swiperSlide
  },
  data(){
    return {
      cdnPrefix: '',
      actImgId: '',
      actStars: '',
      actSwipeIndex: 0,
      actRulesState: false,
      actLastTime: '',
      btn1Stlye: {
        color:'#60594e',
        sColor:'#ffea02',
        eColor:'#fff373',
        value:'给Ta点赞'
      },
      btn2Stlye: {
        color:'#ffffd9',
        sColor:'#60594e',
        eColor:'#908b80',
        value:'我也要参与'
      },
      swiperOption: {
        spaceBetween: 10,
        on: {
          init: () => {
            console.log(this);
            _that = this
          },
          slideChangeTransitionEnd: function() {
            _that.actStars = _that.swiperSlides[this.activeIndex].liked
            _that.actImgId = _that.swiperSlides[this.activeIndex].id
            _that.actSwipeIndex = this.activeIndex
          }
        }
      },
      swiperSlides: [{ilike: false}]
    }
  },
  beforeMount() {
    console.log(this.$route.params);
    let params = this.$route.params
    if(params.hasOwnProperty('token')) {
      this.$ajax.imgList({token: params.token, alone: 'true'})
      .then(res => {
        console.log(res);
        if(res.code == 200) {
          let result = res.result
          // 分享者没有作品  不可能存在这种情况
          if(result.images.length == 0) {
            this.$router.push({name: '404'})
          } else if (result.images.length == 1){
            $('#p4 .swiper-container').css('margin', '0 auto')
          }
          this.swiperSlides = result.images
          this.cdnPrefix = result.cdnPrefix
          this.actStars = this.swiperSlides[0].liked
          this.actImgId = this.swiperSlides[0].id
        }
      })
    } else {
      this.$router.push({name: '404'})
    }
    // console.log(this.propUserInfo);
    // return

  },
  mounted (){
    console.log('1');

  },
  methods: {
    toJoin() {
      // console.log('去个人中心');
      window.location.href = 'https://lnk0.com/easylink/ELcEN1Eh'
    },
    imgSize(e) {
      // console.log(e.currentTarget.width, e.currentTarget.height)
      if(e.currentTarget.width >= e.currentTarget.height) {
        e.currentTarget.style.width = '100%'
      } else {
        e.currentTarget.style.height = '100%'
      }
    }
  },
  watch: {
    'propUserInfo'() {
      // let startDate = this.propUserInfo.startDate
      // let oindex = startDate.split('至')
      // let startTime = oindex[0].split('.')[0] + '月' + oindex[0].split('.')[1] + '日'
      // let endTime = oindex[1].split('.')[0] + '月' + oindex[1].split('.')[1] + '日'
      // console.log(startTime, endTime)
      this.actLastTime = this.propUserInfo.startDate
    }
  }
}
</script>

<style lang='scss'>
#p4{
  background: url('../static/img/bg-bot1.jpg') center bottom no-repeat;background-size: 100% auto;
  min-height: 12.2rem;
  padding-bottom:2rem;overflow: hidden;
  // .tip{
  //   position: absolute;top:.18rem;right:.18rem;background: url('../static/img/index-tip.jpg') 0 -.01rem no-repeat;background-size: .32rem;
  //   padding-left:.36rem;color:#93ad94;height:.32rem;line-height: .32rem;font-size: .26rem;
  // }
  .userName {
    color:#60594e; font-size: .32rem;text-align: center;position: absolute;bottom:.32rem;width:100%;
    font-family: 'simHei';font-weight: 450;
  }
  .countDown{
    font-size: .28rem;font-weight: bold;left:.12rem;top:.1rem;right:auto;background: none;color:#c5a309;
    position: absolute;top:.14rem;left:.12rem;z-index:2;
  }
  .gifts{
    width:7rem;height:1.55rem;border-radius: .2rem;background-color: #fff;margin:.28rem auto 0;
    display: flex;align-items: center;justify-content: center;
    box-shadow: 0 0 .1rem 0 rgba(0, 0, 0, .2);
  }
  .wpr{
    // display: flex;align-items: center;justify-content: top;flex-direction: column;height:100%;
  }
  .swiper-container{
    margin:0;
    width:5.72rem;height:5.72rem;padding:0 .3rem 0 .1rem;overflow: initial;box-sizing: border-box;
  }
  .swiper-slide{
    background-color: #fff;padding:.3rem;box-sizing: border-box;
    border-radius: .2rem;transition: all .4s;
    box-shadow: 0 0 .13rem 0 rgba(0, 0, 0, .15);
    width:auto;max-width: 100%;text-align: left;
    // width:2rem;height:2rem;float:left;display: inline;
    .mediaImg{
      position: relative;left:50%;top:50%;transform: translate(-50%, -50%);max-width:100%;max-height:100%;
    }
    &.swiper-slide-active {
      padding:.1rem;
    }
  }
  .btns{
    text-align: center;
  }
  // .top{
  //   margin-top:3.42rem;position: relative;
  //   .topWpr{
  //     box-shadow: 0 .1rem .23rem 0 rgba(159, 176, 130, .69);
  //     background-color: #fff;width:5.9rem;height:5.9rem;position: relative;margin-top:1.2rem;
  //     box-sizing: border-box;padding:.12rem;
  //   }
  //   img{
  //     position: relative;left:50%;top:50%;transform: translate(-50%, -50%);
  //   }
  //   em{
  //     position: absolute;background-color: #ffeca1;font-size: .28rem;color:#889e89;line-height: .38rem;top:-.55rem;
  //     width:100%;padding:.14rem .45rem;box-sizing: border-box;border-radius: 3rem;width:4.2rem;text-align: center;
  //     box-shadow: 0 0 .13rem 0 rgba(0, 0, 0, .25);left:50%;transform: translateX(-50%);
  //   }
  // }
  // .items{
  //   display: flex;justify-content: space-between;margin:.46rem 0 .4rem;
  // }
  // .item{
  //   width:1.98rem;background-color: #fffee4;box-shadow: 0 .1rem .23rem 0 rgba(159, 176, 130, .69);margin:0 .11rem;
  //   img{
  //     width:1.86rem;display:block;margin:.1rem auto;
  //   }
  //   h5{
  //     width:100%;display: block;font-size: .24rem;line-height: .38rem;color:#8ca582;font-weight: bolder;padding:0 .3rem;box-sizing: border-box;
  //   }
  //   h4{
  //     font-size: .34rem;color:#fee384;background-color:#879d88;font-weight: bolder;
  //     width:1.32rem;line-height: .44rem;margin:.24rem auto .18rem;font-style: italic;position: relative;text-align: center;
  //     &:before, &:after{
  //       content: "";position: absolute;width:0;height:0;line-height: 0;overflow: hidden;
  //       border-top:.22rem transparent solid;border-bottom: .22rem transparent solid;
  //       border-right:.1rem #879d88 solid;left:-.1rem;
  //     }
  //     &:after{
  //       border-right:none;left:auto;border-left:.1rem #879d88 solid;right:-.1rem;
  //     }
  //   }
  // }
  .btn1{
    position: absolute;display:block;right:.1rem;bottom:.1rem;
    em{
      display:block;transition: all 1.4s;
      font-size: .34rem;width:1.38rem;line-height:.6rem;
      position: relative;z-index: 2;text-align: center;
      background-color:#60594e;
      color:#ffffd5;
    }
    img{
      width:.4rem;vertical-align: baseline;position: relative;top:.02rem;
    }
  }
}
</style>
