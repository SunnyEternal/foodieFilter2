<template>
  <div id="p3">
    <swiper :options="swiperOption">
      <swiper-slide v-for="(slide, index) in swiperSlides" :key="index">
        <!-- I'm Slide {{ slide.stars }} -->
        <img  :src="cdnPrefix + slide.mediaUrl" class="mediaImg" @load="imgSize" alt="">
      </swiper-slide>
      <!-- <div class="swiper-pagination" slot="pagination"></div> -->
    </swiper>
    <div style="text-align:center;padding:.26rem 0 0;">
      <div class="btn1" @click="tapLike" v-if="swiperSlides[actSwipeIndex].ilike">
        <em><img :src="require('@/static/img/likes4.png')"  alt=""> {{actStars}}</em>
      </div>
      <div class="btn1" @click="tapLike" v-else>
        <em><img :src="require('@/static/img/likes1.png')"  alt=""> {{actStars}}</em>
      </div>
    </div>
    <div class="tip">
      去邀请你的好友给你点赞吧<br />
    </div>
    <div class="btns">
      <Button :sty="btn1Stlye" :eventName="'sRegisterFn'" @sRegisterFn="inviteFriend" /><br />
      <Button :sty="btn2Stlye" :eventName="'sRegisterFn'" @sRegisterFn="reChoose" /><br />
      <Button :sty="btn3Stlye" :eventName="'sRegisterFn'" @sRegisterFn="showLists" />
    </div>
    <p class="bot">
      <b>关注微博：Foodie相机 获取进度</b><br />
      客服微信：Cattemii
    </p>
    <Toast />

    <div class="shareMask mask" v-if="shareMaskState">
      <div class="wpr">
        <img :src="require('@/static/img/close.png')" class="close" @click="showShareMask(0)" alt="">
        <div class="p-r">
          <img :src="require('@/static/img/act_top1.jpg')" width="100%" alt="">
          <var>{{actAuthorName}}的作品</var>
        </div>
        <div class="img">
          <img :src="actImgUrl" :style="actStyle" alt="">
        </div>
        <div class="qr">
          扫描二维码 查看作品<img id="distQrImg" src="" alt="">
        </div>
      </div>
      <div class="shareMaskbot">
        截图分享至微信朋友圈<br />邀请好友给你点赞
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/common/button.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import '@/static/css/swiper.css'
import loading from '@/bag/vueCommon/loading/1/loading'
import Toast from '@/bag/vueCommon/toast/1/t.vue'
import showToast from '@/bag/vueCommon/toast/1/t'
import imgSupport from '@/bag/utils/imgSupport'

let _that
export default {
  components: {
    swiper,
    swiperSlide,
    Button,
    Toast
  },
  data() {
    return {
      actStars: 0,
      actImgId: 0,
      actSwipeIndex: 0,
      cdnPrefix: '',
      ownerToken: '',
      actImgUrl: '',
      actAuthorName: '',
      shareMaskState: false,
      btn1Stlye: {
        value:'邀请好友点赞'
      },
      btn2Stlye: {
        color:'#ffffd9',
        sColor:'#98cef2',
        eColor:'#98cef2',
        value:'再传一张'
      },
      btn3Stlye: {
        color:'#ffffd9',
        sColor:'#98cef2',
        eColor:'#98cef2',
        value:'查看其他作品'
      },
      swiperOption: {
        spaceBetween: 10,
        // slidesPerView: 'auto',
        // freeMode : true,
        on: {
          init: () => {
            _that = this
          },
          slideChangeTransitionEnd: function() {
            _that.actStars = _that.swiperSlides[this.activeIndex].liked
            _that.actImgId = _that.swiperSlides[this.activeIndex].id
            _that.actSwipeIndex = this.activeIndex
          }
        }
      },
      swiperSlides: [{ilike: false}],
      actStyle: {'maxWidth': '100%'}
    }
  },
  methods: {
    inviteFriend() {
    this.showShareMask(1)
    },
    showShareMask(state) {
      let that = this
      this.shareMaskState = !this.shareMaskState
      if(this.shareMaskState) {
        let img = new Image()
        img.src = that.cdnPrefix + that.swiperSlides[that.actSwipeIndex].mediaUrl
        that.actAuthorName = that.swiperSlides[that.actSwipeIndex].userName
        img.onload = function() {
          if(this.width >= this.height) {
            that.actStyle = {width: '100%'}
          } else {
            that.actStyle = {height: '100%'}
          }
          that.actImgUrl = this.src
        }
        let canvas2Qr =  Canvas2Image.convertToJPEG($('#qrcode canvas')[0], 140 * window.devicePixelRatio / 2, 140  * window.devicePixelRatio / 2)
        canvas2Qr.onload = function() {
          console.log(this);
          document.querySelector('#distQrImg').src = this.src
        }

      }

    },
    reChoose() {
      this.$router.push({name: 'register'})
    },
    showLists() {
      this.$router.push({name: 'list'})
    },
    tapLike() {
      if(this.swiperSlides[this.actSwipeIndex].ilike) {
        return this.$reminderMsg.show({text: '您已经给此图点过赞啦'})
      }

      this.$ajax.tapLike({token: this.$ut.lStorageGet('token'), id: this.actImgId})
      .then(res => {
        if(res.code == 200) {
          let oldLiked = this.swiperSlides[this.actSwipeIndex].liked
          let newItem = Object.assign(this.swiperSlides[this.actSwipeIndex], {liked: oldLiked + 1, ilike: true})
          this.actStars = this.swiperSlides[this.actSwipeIndex].liked
          this.actImgId = this.swiperSlides[this.actSwipeIndex].id
          this.$set(this.swiperSlides, this.actSwipeIndex, newItem)
        } else {
          throw new Error('$ajax.tapLike')
        }
      })
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
  beforeMount() {
    // let params = this.$route.params.cdnPrefix ? this.$route.params : this.$ut.lStorageGet('myPics')
    let params = ''
    // if(this.$userState.)
    if(this.$route.params.cdnPrefix){
      if (this.$route.params.images.length == 1) {
        setTimeout(() => {
          $('#p3 .swiper-container').css('margin', '.2rem auto 0')
        }, 200)
      }
      params = this.$route.params
      this.swiperSlides = Object.assign(this.swiperSlides, params.images)
      this.cdnPrefix = params.cdnPrefix
      this.actStars = this.swiperSlides[0].liked
      this.actImgId = this.swiperSlides[0].id
    } else {
      this.$ajax.imgList({token: this.$ut.lStorageGet('token'), alone: 'true'})
      .then(res => {
        if(res.code == 200) {
          params = res.result
          if(params.images.length == 0) {
            this.$router.push({name: 'list'})
          }  else if (params.images.length == 1){
            $('#p3 .swiper-container').css('margin', '.2rem auto 0')
          }
          this.swiperSlides = params.images
          this.cdnPrefix = params.cdnPrefix
          // this.actStars = this.swiperSlides[0].liked
          // this.actImgId = this.swiperSlides[0].id // TODO 暂时注释掉
        }
      })
    }

    // let pathName = `${window.location.origin}${window.location.pathname}#/m2c/${this.$ut.lStorageGet('token')}`
    let pathName = `${window.location.origin}${window.location.pathname}?1=${this.$ut.lStorageGet('token')}`
    // $('.log').text(`${pathName}-1658`)
    // imgSupport.createQr(document.querySelector("#qrcode"), `${window.location.origin}${window.location.pathname}#/m2c/${this.$ut.lStorageGet('token')}`)
    imgSupport.createQr(document.querySelector("#qrcode"), pathName)
  },
  mounted() {
    if(this.$route.params.cdnPrefix) {
      showToast('上传成功')
    }
  }
}
</script>

<style lang="scss">
#p3{
  // background: url('../static/img/bg-bot1.jpg') center bottom no-repeat;background-size: 100% auto;
  height:100%;min-height:14.25rem;overflow: hidden;
  .swiper-container{
    margin:.2rem 0 0 0;
    width:5.72rem;height:5.72rem;padding:0 .3rem 0 .1rem;overflow: initial;box-sizing: border-box;
  }
  .swiper-slide{
    background-color: #fff;padding:.3rem;box-sizing: border-box;
    border-radius: .2rem;transition: all .4s;
    box-shadow: 0 0 .13rem 0 rgba(0, 0, 0, .15);
    width:auto;max-width: 100%;text-align: left;
    // width:2rem;height:2rem;float:left;display: inline;
    .mediaImg{
      position: relative;left:50%;top:50%;transform: translate(-50%, -50%);max-width: 100%;max-height: 100%;
    }
    &.swiper-slide-active {
      padding:.1rem;
    }
  }
  .tip{
    font-size: .28rem;color:#60594e;text-align: center;margin:.4rem 0 .3rem;line-height: 1.5;font-weight: bold;
  }
  .btn1{
    position: relative;display:inline-block;margin-top:.2rem;
    em{
      display:block;transition: all 1.4s;
      font-size: .34rem;width:2.02rem;line-height:.8rem;
      position: relative;z-index: 2;text-align: center;
      background-color:#5a9ae1;
      color:#ffeca9;
    }
    em.tap{
      top:.03rem;left:.03rem;
    }
    // &:before{
    //   content:"";display: block;position: absolute;z-index: 1;background-color: rgba(100, 100, 100, .5);
    //   width:100%;height:100%;top:.1rem;left:.1rem;
    // }
    img{
      width:.4rem;vertical-align: baseline;position: relative;top:.02rem;
    }
  }
  .btns{
    text-align: center;
    .btn{
      margin:.17rem 0;
    }
  }
  .bot{
    text-align: center;color:#60594e;line-height: 1.8;margin-top:.7rem;
  }
}

.shareMask {
  flex-direction: column;
  .shareMaskbot{
    color: #fff;font-weight: bold;line-height: 1.6;text-align: center;margin-top: .15rem;
  }
  .wpr{
    width:6.8rem;background-color: #fff;overflow:hidden;border-radius: .2rem;position: relative;
  }
  .close{
    width:.52rem;position: absolute;right:.16rem;top:.15rem;z-index:3;
  }
  .qr{
    font-weight: bold;color:#60594e;text-align: right;padding:.2rem 0 .28rem;
    img{
      width:1.4rem;margin-bottom: .1rem;vertical-align: bottom;position: relative;
      margin:0 .28rem 0 .22rem;
    }
  }
  var{
    position: absolute;bottom:.2rem;color:#60594e;font-size: .28rem;width:100%;text-align: center;font-weight: bold;
  }
  .img{
    width:5rem;height:5rem;margin:auto;position:relative;z-index:2;
    background-color: #fff;padding:.1rem;box-sizing: border-box;
    border-radius: .2rem;
    box-shadow: 0 0 .13rem rgba(0, 0, 0, .15);
    img{
      position: relative;left:50%;top:50%;transform: translate(-50%, -50%);
    }
  }
}
</style>
