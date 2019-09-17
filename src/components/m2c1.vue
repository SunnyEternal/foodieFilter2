<template>
  <div id="p6">
    <div class="slide">
      <img :src="this.cdnPrefix + item.mediaUrl" @load="imgSize" alt="">
    </div>

    <div style="text-align:center;">
      <div class="btn1" @click="tapLike">
        <em v-if="item.ilike"><img v-lazy="require('@/static/img/likes2.png')"  alt=""> {{item.liked}}</em>
        <em v-else><img v-lazy="require('@/static/img/likes1.png')"  alt=""> {{item.liked}}</em>
      </div>
    </div>
    <div class="btns">
      <Button :sty="btn3Stlye" :eventName="'sRegisterFn'" @sRegisterFn="showLists" />
    </div>
  </div>
</template>

<script>
import Button from '@/components/common/button.vue'
// import 'swiper/dist/idangerous.swiper.css'
import '@/static/css/swiper.css'

export default {
  components: {
    Button
  },
  data() {
    return {
      actStars: 0,
      actImgId: 0,
      actSwipeIndex: 0,
      cdnPrefix: '',
      ownerToken: '',
      btn3Stlye: {
        color:'#657c5e',
        sColor:'#ffd852',
        eColor:'#ffe99b',
        value:'返 回'
      },
      item: {}
    }
  },
  methods: {
    showLists() {

    },
    tapLike() {
      if(this.item.ilike) {
        return this.$reminderMsg.show({text: '您已经给此图点过赞啦'})
      }

      this.$ajax.tapLike({token: this.$ut.lStorageGet('token'), id: this.item.id})
      .then(res => {
        if(res.code == 200) {
          let oldLiked = this.item.liked
          let newItem = Object.assign(this.item, {liked: oldLiked + 1, ilike: true})
          // this.actStars = this.swiperSlides[this.actSwipeIndex].liked
          // this.actImgId = this.swiperSlides[this.actSwipeIndex].id
          this.$set(this, 'item', newItem)
        } else {
          throw new Error('$ajax.tapLike')
        }
      })
    },
    imgSize(e) {
      console.log(e.currentTarget.width, e.currentTarget.height)
      if(e.currentTarget.width >= e.currentTarget.height) {
        e.currentTarget.style.width = '100%'
      } else {
        e.currentTarget.style.height = '100%'
      }
    }
  },
  beforeMount() {
    console.log(this.$route.params);
    // let params = this.$route.params.cdnPrefix ? this.$route.params : this.$ut.lStorageGet('myPics')
    // if(this.$userState.)
    if(this.$route.params.id){
      let id = this.$route.params.id
      this.$ajax.imgList({token: this.$ut.lStorageGet('token')})
      .then(res => {
        console.log(res, id);
        if(res.code == 200) {
          this.cdnPrefix = res.result.cdnPrefix

          console.log(this.cdnPrefix);
          let arr = res.result.images
          let item = arr.filter((ite, ind) => {
            return ite.id == id
          })[0]
          console.log(item);
          // this.btn3Stlye.value = `${item.userName}的作品`
          this.item = item
        }
      })
    } else {

    }
  }
}
</script>

<style lang="scss">
#p6{
  background: url('../static/img/bg-bot1.jpg') center bottom no-repeat;background-size: 100% auto;
  height:100%;overflow: hidden;
  .slide{
    height:6.8rem;margin:.2rem .5rem 0;box-sizing: border-box;
    border-radius: .2rem;transition: all .4s;background-color: #fff;
    padding:.1rem;box-shadow: 0 0 .13rem 0 rgba(0, 0, 0, .15);
    // width:2rem;height:2rem;float:left;display: inline;
    img{
      position: relative;left:50%;top:50%;transform: translate(-50%, -50%);
    }
    &.swiper-slide-active {
      padding:.1rem;box-shadow: 0 0 .13rem 0 rgba(0, 0, 0, .15);
    }
  }

  .btn1{
    position: relative;display:inline-block;margin-top:.28rem;
    em{
      display:block;transition: all 1.4s;
      font-size: .34rem;width:2.02rem;line-height:.8rem;
      position: relative;z-index: 2;text-align: center;
      background-color:#60594e;
      color:#ffeca9;
    }
    em.tap{
      top:.03rem;left:.03rem;
    }
    &:before{
      content:"";display: block;position: absolute;z-index: 1;background-color: rgba(203, 187, 112, .5);
      width:100%;height:100%;top:.1rem;left:.1rem;
    }
    img{
      width:.4rem;vertical-align: baseline;position: relative;top:.02rem;
    }
  }
  .btns{
    text-align: center;margin-top:.65rem;
    .btn{
    }
  }
}
</style>
