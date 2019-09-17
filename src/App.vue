<template>
  <div id="app">
    <loadingDom />
    <router-view class="child-view" :propUserInfo="userInfo" />
    <!-- <keep-alive >
      <router-view class="child-view":propUserInfo="userInfo"></router-view>
    </keep-alive> -->
    <!-- <router-view class="child-view" :propUserInfo="userInfo" v-if="!$route.meta.keepAlive"></router-view> -->
  </div>
</template>

<script>
import Handlers from '@/static/js/handlers'
import loadingDom from '@/bag/vueCommon/loading/2/loading.vue'

export default {
  name: 'App',
  components: {
    loadingDom
  },
  data() {
    return {
      isInApp: false,
      userInfo:{}
    }
  },
  beforeMount () {

    // 暂时注释
    // http://foodie-beta.kajicam.com/fs/api/home?hToken=0&topicId=0
    // let that = this
    // let token = this.$ut.lStorageGet('token') ? this.$ut.lStorageGet('htoken') : ''
    // this.$ajax.home(token)
    // .then(res => {
    //   that.$ut.lStoragePut('token', res.result.token)
    //   that.$userState = Object.assign(that.$userState, res.result)
    //   that.userInfo = Object.assign({}, that.userInfo, res.result)
    // })
  },
  mounted() {
    Handlers.checkAppInfo()
    window.addEventListener('offline', () => {
      alert('请检查网络链接')
    })
    // setTimeout(() => {
    //   $('.log').text(JSON.stringify(Handlers.myApp) + '-1455')
    //   console.log(window.navigator.userAgent)
    // }, 1000)
  },
  watch: {
    '$route' (to, from) {
      // console.log('>>> AppVue $route', to, from)
      if (to.path == '/') {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
      window.scrollTo(0, 0)
    },
    'userInfo'() {
      this.$userState = Object.assign({}, this.$userState, this.userInfo)
    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss">
body,html {
  height:100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
#app{
    width:100%;max-width: 750px;height:100%;
    // background:url('./static/img/bg-top1.jpg') left top no-repeat;
    // background-size: 3.35rem auto;
}
// .slide-left-enter, .slide-right-leave-active {
//   opacity: 0;
// }
// .slide-left-leave-active, .slide-right-enter{
//   opacity: 0;
// }
.reminder{
  opacity: 0;
  .wpr{
    width:5.3rem;background-color: #fff;padding:.8rem 0 .6rem;border-radius: .2rem;
  }
  p{
    text-align: center;color:#2d2d2d;font-size: .32rem;line-height: 1.6;box-sizing: border-box;
  }
  button{
    border:none;width:2.6rem;line-height: .9rem;color:#171717;font-size: .34rem;font-weight: bold;
    background-color: #ffd753;border-radius: .1rem;display: block;margin:.35rem auto 0;
  }
}
.v-enter{opacity: 0;}
.v-enter-active{transition: .3s linear;}
.v-leave-active{opacity: 0; transition: .3s linear;}

</style>
