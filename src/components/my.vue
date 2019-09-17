<template>
  <div id="my">

    <!-- 1. 头部个人信息 -->
    <header>
      <div class="head">
        <div class="headGroup">
          <span class="headImg" :style="{backgroundImage:`url(${cdnPrefix + userInfo.headImg})`}"></span>
          <span class="nickname">{{userInfo.userName}}</span>
        </div>
        <div class="getThumb">
          <span class="thumbNum">122</span>
          <span class="txt">获赞</span>
        </div>
      </div>

      <ul class="tab">
        <router-link class="active" tag="li" style="float: left;" to="/my/dynamic">动态</router-link>
        <router-link tag="li" style="float: left;" to="/my/gallery">相册</router-link>
        <router-link tag="li" style="float: left;" to="/my/myTopic">话题</router-link>
      </ul>
    </header>

    <div>
      <router-view></router-view>
    </div>

    <!--  返回首页 -->
    <div class="goHome">
      <ImgBtn :btnAttr='backBtn' :eventName="'goHome'" @goHome="goListBtn"></ImgBtn>
    </div>

  </div>
</template>

<script>
// import loading from '@/bag/vueCommon/loading/1/loading'
// import Dialog from '@/components/common/useFilterDialog.vue'
// import ImgBtn from '@/components/common/hasImgBtn.vue'
// import ActionBtn from '@/components/common/actionBtn.vue'
// import ConfirmDel from '@/components/common/confirmDialog.vue'

import ImgBtn from '@/components/common/hasImgBtn.vue'

export default {
  components: {
    // loading,
    // Dialog,
    // ImgBtn,
    // ActionBtn,
    // ConfirmDel,

    ImgBtn
  },
  data () {
    return {
      cdnPrefix: '', // CDN路径
      userInfo: {
        userName: '',
        headImg: ''
      }, // 用户信息
      backBtn: {
        btnCon: { // 按钮样式
          width: '5.14rem',
          fontSize: '.34rem'
        },
        btnImg: { // 按钮内图片样式
          bgUrl: ''
        },
        val: '返回首页'
      },
    //   datas: [],
    //   lDatas: [],
    //   rDatas: [],

    //   initFlag: true,

    //   isLoading: false, // 是否上拉刷新，默认否
    //   showDialog: false, // 是否使用滤镜对话框，默认否
    //   filterObj: {
    //     url: require("@/static/img/filter.png"),
    //     name: 'YU3'
    //   }, // 弹窗显示路径图标和名字

    //   showConfirm: false,
    //   deleteId: '',

    //   bigPicObj: {}, // 点击查看大图
    //   bigPicState: false,
    //   actStyle: {},
    //   actImageUrl: '', // 大图地址

    //   filterAction: '', // 滤镜跳转地址

      pageNo: 1,
      pageSize: 10,
    //   isLoading: true, // 是否上拉刷新，默认否
    //   busy: false,

    //   filterBtn: {
    //     btnCon: { // 按钮样式
    //       width: '5.14rem',
    //       fontSize: '.34rem'
    //     },
    //     btnImg: { // 按钮内图片样式
    //       width: '.49rem',
    //       height: '.49rem',
    //       top: '.18rem'
    //     },
    //     showImg: true,
    //     val: '使用YU3滤镜',
    //     imgUrl: require('@/static/img/filter.png'),
    //   },
    //   backBtn: {
    //     btnCon: { // 按钮样式
    //       width: '5.14rem',
    //       fontSize: '.34rem'
    //     },
    //     btnImg: { // 按钮内图片样式
    //       bgUrl: ''
    //     },
    //     val: '返回首页'
    //   }
    }
  },
  // created () {

  // },
  mounted () {
    localStorage.removeItem('page')
    this.sort()
  },
  methods: {
    goUploadFn () {
      this.$router.push({name: 'register'})
    },
    // 删除我的作品
    // deleteMyWork (id) {
    //   this.showConfirm = !this.showConfirm
    //   this.deleteId = id
    //   _hmt.push(['_trackEvent', 'filterAc_deletePic', 'click', '删除我的作品'])
    // },
    // 返回首页
    goListBtn () {
      this.$router.push({name: 'list'})
    },
    // [取消]或[确定]使用同款滤镜
    // filterHand (data) {
    //   this.showDialog = data || false
    //   if (data) {
    //     this.showDialog = false
    //   }
    // },
    // [取消]或[确定]删除我的作品
    // confirmDelete (data) {
    //   this.showConfirm = data || false
    //   this.actImageUrl = ''
    //   if (data) {
    //     this.showConfirm = false
    //     let token = this.$ut.lStorageGet('token')
    //     this.$ajax.deleteWork ({token, id: this.deleteId})
    //     .then(res => {
    //       if (res.code === 200 || res.code === '200') {
    //         this.bigPicState = !this.bigPicState
    //         this.datas = this.datas.filter((item, index) => {
    //           return item.id != this.deleteId
    //         })
    //         if (this.datas.length === 0) {
    //           $('.loadingBg').css({'display': 'none'})
    //           $('.noDataGroup').css({'display': 'block'})
    //         } else {
    //           $('.loadingBg').css({'display': 'block'})
    //           $('.noDataGroup').css({'display': 'none'})
    //         }
    //       } else if (res.code === 400 || res.code === '400') {
    //         this.$reminderMsg.show({text: res.message})
    //       } else {
    //         this.$reminderMsg.show({text: res.message})
    //       }
    //     }).catch(e => {
    //       console.log(e);
    //     })
    //   }
    // },
    // openFilter () {
    //   _hmt.push(['_trackEvent', 'filterAc_useFilter', 'click', '使用同款滤镜总数'])
    //   this.filterAction = this.bigPicObj.filterAction
    // },
    // 使用同款滤镜（弹出弹窗）
    // useFilter (item) {
    //   this.showDialog = true
    //   if (item.filterImage !== '') {
    //     this.filterObj = {
    //       url: this.cdnPrefix + item.filterImage,
    //       name: item.filterName
    //     }
    //   }
    //   this.filterAction = item.filterAction
    // },
    // imgload(e) {
    //   e.currentTarget.style.visibility = 'visible'
    // },
    // 点击查看大图
  //   toM2c1(item, s) {
  //     let that = this
  //     if(!s) {
  //       that.actImageUrl = ''
  //       return this.bigPicState = !this.bigPicState
  //     }
  //     this.filterBtn.val = `使用${item.filterName}滤镜`
  //     if (item.filterImage) {
  //       this.filterBtn.imgUrl = this.cdnPrefix + item.filterImage
  //     } else {
  //       this.filterBtn.imgUrl = require('@/static/img/filter.png')
  //     }
  //     _hmt.push(['_trackEvent', 'filterAc_picDes', 'click', '点击图片详情数'])
  //     this.$loading(1)
  //     this.actItem = item
  //     let img = new Image();
  //     img.src = this.cdnPrefix + this.actItem.picUrl + '?x-oss-process=image/resize,w_720'
  //     img.onload = function() {
  //       if(this.width * 1.5 >= this.height) {
  //         that.actStyle = {width: '100%'}
  //         $('.imgParent').css({width: '100%'})
  //       } else {
  //         that.actStyle = {height: '100%'}
  //         $('.imgParent').css({height: '100%'})
  //       }
  //       that.actImageUrl = this.src
  //       that.bigPicObj = item
  //       // 重点说明：我的作品列表里没有用户头像，在列表数据外面
  //       that.bigPicObj.headImg = that.userInfo.headImg
  //       that.bigPicObj.nickname = that.userInfo.userName
  //       that.$loading(0)
  //     }
  //     this.bigPicState = !this.bigPicState
  //   },
    sort() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0
      this.datas = []
      this.pageNo = 1
      this.busy = false
      setTimeout(() => { window.scrollTo(0, scrollTop + 1) }, 200)
      // return
      // loading(1)
      this.$loading(1)
      // $('#p5 .mediaImg').css('visibility', 'hidden')
      this.$ajax.myWorkList({pageNo: this.pageNo, pageSize: this.pageSize, token: this.$ut.lStorageGet('token')})
      .then(res => {
        if(res.code === 200 || res.code === '200') {
          this.cdnPrefix = res.result.cdnPrefix
          this.userInfo = {userName: res.result.nickname, headImg: res.result.headImageUrl}
          console.log('userInfo')
          console.log(this.userInfo)
          this.$ut.lStoragePut('userInfo', JSON.stringify(this.userInfo))
          this.datas = Object.assign(this.datas, res.result.pictureViews)
          this.$set(this, 'datas', res.result.pictureViews)
          if (res.result.pictureViews.length === 0) {
            $('.loadingBg').css({'display': 'none'})
            $('.noDataGroup').css({'display': 'block'})
          } else if (res.result.pictureViews.length < 10 && res.result.pictureViews.length > 0) {
            this.busy = true
            this.isLoading = false
            $('.loadingBg').css({'display': 'block'})
            $('.noDataGroup').css({'display': 'none'})
          } else {
            this.busy = false
            $('.loadingBg').css({'display': 'block'})
            $('.noDataGroup').css({'display': 'none'})
          }
          this.initFlag = false
        } else if (res.code === 10005 || res.code === '1005') {
          this.$reminderMsg.show({text: res.message})
          setTimeout(() => {
            this.$router.push({name: 'login'})
          }, 1500)
        } else {
          this.$reminderMsg.show({text: res.message})
        }
        this.$loading(0)
      })
    },
  //   loadMore: function() {
      
  //     if (this.initFlag) return
  //     console.log('loadMore')
  //     this.busy = true
  //     this.pageNo ++

  //     let that = this
  //     let timer = setInterval(() => {
  //       clearInterval(timer)
  //       return this.$ajax.myWorkList({pageNo: this.pageNo, pageSize: this.pageSize, token: this.$ut.lStorageGet('token')})
  //       .then(res => {
  //         if(res.code == 200) {
            
  //           that.cdnPrefix = res.result.cdnPrefix
  //           let arr = []
  //           res.result.pictureViews.forEach((item, index) => {
  //             arr.push(item.id)
  //           })
  //           if(arr.length == 0) {
  //             that.isLoading = false;
  //             return setTimeout(() => {
  //               that.busy = true
  //             }, 500)
  //           }
  //           that.datas.push(...res.result.pictureViews)
  //           return setTimeout(() => {
  //             that.busy = false
  //           }, 500)

  //         }
  //       })
  //     }, 50)

  //   },
  // },
  // watch: {
  //   'datas'() {
  //     let that = this
  //     that.lDatas = []
  //     that.rDatas = []
  //     let l_h = 0
  //     let r_h = 0
  //     let itemW = $('.items.l').width()
  //     this.datas.forEach((item, index) => {
  //       let img = new Image()
  //       item.imgH = itemW * item.picHeight / item.picWidth
  //       if(l_h <= r_h) {
  //         l_h += item.imgH
  //         that.lDatas.push(item)
  //       } else {
  //         r_h += item.imgH
  //         that.rDatas.push(item)
  //       }
  //     })
  //   }
  }
}
</script>

<style lang='scss' scoped>
#my{
  background: #f6f7fa;
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  padding-bottom: 1.2rem;
  header{
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    .head{
      display: flex;
      justify-content: space-between;
      padding-bottom: .3rem;
      box-sizing: border-box;
      border-bottom: 1px solid #e5e5e5;
    }
    .headGroup{
      display: flex;
      justify-content: flex-start;
      .headImg{
        width: 1.04rem;
        height: 1.04rem;
        border-radius: 50%;
        margin-left: .28rem;
        margin-top: .24rem;
        margin-right: .1rem;
        overflow: hidden;
        display: block;
        background-size: cover;
        background-repeat: no-repeat;
        background-image: url('../static/img/portrait.png');
        background-position: center center;
      }
      .nickname{
        line-height: 1.04rem;
        margin-top: .24rem;
        color: #333;
        font-size: .4rem;
      }
    }
    .getThumb{
      height: 1.04rem;
      padding-left: .32rem;
      padding-right: .32rem;
      line-height: 1.04rem;
      margin-top: .24rem;
      background-size: .26rem .23rem;
      background-repeat: no-repeat;
      background-image: url('../static/img/thumb-up.png');
      background-position: left .44rem;
      font-size: .26rem;
      color: #333;
      font-weight: bold;
      // display: flex;
      // justify-content: flex-end;
      // align-items: baseline;
      .thumbNum{
        font-size: .44rem;
        color: #333;
      }
      .txt{
        position: relative;
        top: -.02rem;
      }
    }
  }

  .tab{
    display: flex;
    justify-content: flex-start;
    align-items: top;
    height: .88rem;
    padding-left: .1rem;
    box-sizing: border-box;
    li{
      height: .66rem;
      padding: .28rem .22rem 0;
      box-sizing: border-box;
      position: relative;
      &:before{
        content:""; 
        display:block;
        height: .08rem;
        width: inherit;
        position: absolute;
        z-index: 1;
        bottom: 0;
        border-radius: .04rem;
        width: 0;
        transition: all .4s;
        transform: translate(-50%);
        left:50%;
      }
    }
    .router-link-active{
      color: #333;
      font-weight: bold;
      &:before{
        background-color:#ffdf0a;
        width: .45rem;
        height: .08rem;
        border-radius: .04rem;
      }
    }
  }
  
}
  // .noDataGroup{
  //   padding-top: 1.45rem;
  //   box-sizing: border-box;
  //   p{
  //     line-height: .5rem;
  //     text-align: center;
  //     font-size: .3rem;
  //     color: #333;
  //   }
  //   .noData img{
  //     display: inline-block;
  //     width: 1.16rem;
  //     margin-bottom: .25rem;
  //   }
  //   .last{
  //     margin-bottom: .5rem;
  //   }
  //   button{
  //     display: block;
  //     border: none;
  //     width: 3.04rem;
  //     height: .88rem;
  //     line-height: .88rem;
  //     background: #434343;
  //     color: #fff;
  //     border-radius: .44rem;
  //     font-size: .34rem;
  //     margin: 0 auto;
  //   }
  // }
  // .wpr{
  //   margin-top: 1.86rem;
  //   background: #f6f7fa;
  //   overflow: hidden;
  //   color:#333;
  //   font-size: .28rem;
  //   padding: .12rem .1rem;
  //   box-sizing: border-box;
  // }
  // .group{
  //   height: .42rem;
  //   vertical-align: middle;
  //   line-height: .42rem;
  //   display: flex;
  //   justify-content: space-between;
  //   span{
  //     vertical-align: top;
  //   }
  //   .itemHeadImg{
  //     display: inline-block;
  //     width: .3rem;
  //     height: .3rem;
  //     border-radius: 50%;
  //     overflow: hidden;
  //     margin-top: .04rem;
  //     // position: relative;
  //     // img{
  //     //   width: 100%;
  //     //   position: absolute;
  //     //   top: 50%;
  //     //   left: 50%;
  //     //   transform: translate(-50%, -50%);
  //     // }
  //     background-size: cover;
  //     background-repeat: no-repeat;
  //     background-image: url('../static/img/portrait.png');
  //     background-position: center center;
  //   }
  //   .itemUserName{
  //     display: inline-block;
  //     font-weight: 500;
  //   }
  //   var{float: left; height: inherit; line-height: inherit; font-size: .26rem;}
  //   .filterWrap{
  //     width: .98rem;
  //     height: .4rem;
  //     vertical-align: middle;
  //     box-sizing: border-box;
  //     border-radius: .05rem;
  //     line-height: .38rem;
  //     border: 1px solid #c2c2c2; 
  //   }
  //   .filterImg{
  //     border-radius: 50%;
  //     overflow: hidden;
  //     display: inline-block;
  //     width: .28rem;
  //     height: .28rem;
  //     margin-top: .05rem;
  //     margin-left: .06rem;
  //     background-size: cover;
  //     background-repeat: no-repeat;
  //     background-image: url('../static/img/portrait.png');
  //     background-position: center center;
  //     // position: relative;
  //     // top: .05rem;
  //     // img{
  //     //   width: .28rem;
  //     //   height: .28rem;
  //     // }
  //   }
  //   .filterName{
  //     // position: relative;
  //     // top: -.02rem;
  //   }
  //   em{
  //     float: right;
  //     font-size: .3rem;
  //     img{
  //       position: relative;
  //       top: .07rem;
  //       width: .29rem;
  //       margin-right: .05rem;
  //     }
  //   }
  // }
  // .items{
  //   width: 3.6rem; 
  //   float: left;
  //   display: inline;
  // }
  // .items.r{
  //   float:right;
  // }
  // .item{
  //   background-color: #fff;
  //   margin-bottom: .08rem;
  //   border-radius: .1rem;
  //   overflow: hidden;
  //   position: relative;
  //   img{
  //     width:100%;
  //   }
  //   var {
  //     overflow: hidden;text-overflow: ellipsis;display: inline-block; -webkit-line-clamp:1;-webkit-box-orient:vertical;
  //     width:1.5rem;white-space: nowrap;text-overflow: ellipsis;
  //   }
  //   .thumbs{
  //     position: absolute;
  //     bottom: .16rem;
  //     right: .18rem;
  //     color: #fff;
  //     img{
  //       width: .29rem;
  //     }
  //   }
  //   .top{
  //     position: relative;
  //     .recommend{
  //       position: absolute;
  //       top: .08rem;
  //       left: .08rem;
  //       width: .74rem;
  //       height: .42rem;
  //     }
  //   }
  //   .bot{
  //     line-height: .64rem;font-size: .24rem;color:#333;
  //     box-sizing: border-box;
  //     padding: .14rem;
  //     .content{
  //       line-height: .38rem;
  //       font-size: .28rem;
  //       font-weight: 500;
  //     }
  //     .topic{
  //       line-height: .44rem;
  //       font-size: .24rem;
  //       font-weight: 500;
  //     }
  //     .noTopic{
  //       margin-bottom: .14rem;
  //     }
  //   }
  // }

  // .loadingBg{
  //   padding-top: .25rem;
  //   text-align: center;
  //   .loadImg{
  //     width: .27rem;
  //   }
  //   .loadTxt{
  //     font-size: .24rem;
  //     color: #c6c6c6;
  //     margin-top: .15rem;
  //   }
  // }
  // .bigPic{
  //   flex-direction: column;background-color: rgba(0, 0, 0, .9);
  //   .close{
  //     width: .62rem; position: absolute; right: .16rem; top: .16rem;
  //   }
  // }
  // .bigPicWpr{
  //   width: 6.3rem;
  //   // max-height: 8.8rem;
  //   height: 8.8rem;
  //   display: flex;align-items: center;justify-content: center;
  //   .imgParent{
  //     position: relative;
  //     text-align: center;
  //     // width: auto;
  //     // max-width: 6.3rem;
  //   }
  //   .big{
  //     // max-width: 6.3rem;
  //     // max-height: 8.8rem;
  //   }
  // }
  // .bigPicBot{
  //   width: 6.3rem;
  //   line-height: .44rem;
  //   color: #fff;
  //   padding-top: .18rem;
  //   .content{
  //     font-size: .28rem;
  //   }
  //   .filterBtnWpr{
  //     text-align: center;
  //     margin-top: .44rem;
  //   }
  // }

// .delete{
//   position: absolute;
//   right: .24rem;
//   bottom: .24rem;
//   width: 1.2rem;
//   height: .6rem;
//   box-shadow: 0 0 .1rem 0 rgba(0, 0, 0, .2);
//   background: #fff;
//   border-radius: .06rem;
//   text-align: center;
//   line-height: .64rem;
//   font-size: .26rem;
//   color: #333;
// }


.goHome{
  position: fixed;
  bottom: .6rem;
  left: 50%;
  transform: translate(-50%);
  .btnCon{
    box-shadow: 0 0 .1rem 0 rgba(0, 0, 0, .2);
  }
}

.dialog-enter{opacity: 0;}
.dialog-enter-active{transition: .3s linear;}
.dialog-leave-active{opacity: 0; transition: .3s linear;}

.confirmDel-enter{opacity: 0;}
.confirmDel-enter-active{transition: .3s linear;}
.confirmDel-leave-active{opacity: 0; transition: .3s linear;}
</style>
