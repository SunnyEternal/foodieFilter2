<template>
  <div id="p5">
    <!-- 1. 顶部tab选项卡 -->
    <header class="head">
      <div class="tip" @click="showActRules(1)">
        <img class="activeRule" src="../static/img/activeRule.png">
        <span class="activeTxt">社区规则</span>
      </div>
      <img :src="require('@/static/img/theme.png')" class="theme" @click="clearFn">
      <div class="sort">
        <button type="button" v-for="(item, index) in topicList" :key="index" 
          @click="getInitHome(item.topicId, index, item.topicName)" :class="{active: index == curr}">
          <var :class="{active: index == curr}">{{item.topicName}}</var>
        </button>
      </div>
    </header>

    <!-- 2. 是否使用同款滤镜拍摄对话框 -->
    <transition>
      <Dialog v-show="showDialog" :filterObj="filterObj" :actionUrl="filterAction" @parentHandNo="filterHand"></Dialog>
    </transition>

    <!-- 3. 列表内容区 -->
    <div class="wpr">
      <div class="items l" ref="leftWrp">
        <div class="item" v-for="(item, index) in lDatas" :key="index">
          <div class="top">
            <img :src="cdnPrefix + item.picUrl + '?x-oss-process=image/resize,w_400'" class="mediaImg" 
              @load="imgload" alt="" @click="toM2c1(item, 1)" :style="{'height': item.imgH + 'px'}" />
          </div>
          <div class="bot">
            <p class="content">{{item.picDescription}}</p>
            <p class="topic" v-if="item.topicName">#{{item.topicName}}</p>
            
            <div class="group">
              <aside>
                <span class="itemHeadImg" v-if="item.headImg" :style="{backgroundImage:`url(${cdnPrefix + item.headImg})`}">
                </span>
                <span class="itemHeadImg" v-else>
                </span>
                <span class="itemUserName">
                  <var>{{item.nickname}}</var>
                </span>
              </aside>
              <aside class="filterWrap" v-if="item.filterAction" @click="useFilter(item)">
                <span class="filterImg" v-if="item.filterImage" :style="{backgroundImage:`url(${cdnPrefix + item.filterImage})`}">
                </span>
                <span class="filterImg" v-else>
                </span>
                <span class="filterName">
                  {{item.filterName}}
                </span>
              </aside>
            </div>
          </div>
        </div>
      </div>
      <div class="items r" ref="rightWrp">
        <div class="item" v-for="(item, index) in rDatas" :key="index">
          <div class="top">
            <img :src="cdnPrefix + item.picUrl + '?x-oss-process=image/resize,w_400'" class="mediaImg" @load="imgload" alt="" @click="toM2c1(item, 1)" :style="{'height': item.imgH + 'px'}" />
          </div>
          <div class="bot">
            <p class="content">{{item.picDescription}}</p>
            <p class="topic" v-if="item.topicName">#{{item.topicName}}</p>
            <div class="group">
              <aside>
                <span class="itemHeadImg" v-if="item.headImg" :style="{backgroundImage:`url(${cdnPrefix + item.headImg})`}">
                </span>
                <span class="itemHeadImg" v-else>
                </span>
                <span class="itemUserName">
                  <var>{{item.nickname}}</var>
                </span>
              </aside>
              <aside class="filterWrap" v-if="item.filterAction" @click="useFilter(item)">
                <span class="filterImg" v-if="item.filterImage" :style="{backgroundImage:`url(${cdnPrefix + item.filterImage})`}">
                </span>
                <span class="filterImg" v-else>
                </span>
                <span class="filterName">
                  <!-- {{item.filterName === '' ? '同款' : item.filterName}} -->
                  {{item.filterName}}
                </span>
              </aside>
            </div>
          </div>
        </div>
        <!-- 5. 上拉加载更多 -->
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="-10"></div>
      </div>
    </div>

    <!-- 6. 按钮[上传作品]和[我的作品] -->
    <div class="btnGroup">
      <ImgBtn :eventName="'handPicFn'" @handPicFn="uploadPicFn('register')" :btnAttr="picBtn"></ImgBtn>
      <ImgBtn :eventName="'myPicFn'" @myPicFn="picsFn('work')" v-if="!hasLogin" :btnAttr="myPicBtn1"></ImgBtn> <!-- 我的作品 -->
      <ImgBtn :eventName="'myPicFn'" @myPicFn="picsFn('work')" v-else :btnAttr="myPicBtn2"></ImgBtn> <!-- 我的作品 带头像、昵称 -->
    </div>

    <!-- 7. 活动规则 -->
    <div id="actRules" class="mask" v-if="actRulesState">
      <div class="actRwpr">
        <h4>社区规则</h4>
        <p class="con">Foodie鼓励用户创造、分享自己的图片作品，并通过滤镜效果让作品更有价值！为了建立一个温暖、有爱的社区，和小F一起来了解下相关规则和注意事项吧👇<br />
          1.作品分享：点击“上传作品”上传、分享话题作品，每次只能上传一张，每天可多次上传。<br />
          2.作品要求：用户上传的作品必须使用Foodie拍摄，不良内容将会被过滤。<br />
          3.作品展示：用户在上传作品- 关联话题 后，作品会在“我的作品”中保存，优秀作品不仅会在相关话题标签内展示，还将有机会上官方推荐哦！<br />
          4.滤镜使用：用户可以点击作品右下方的滤镜标识，进行同款滤镜拍摄🌟<br />

          <br />
          任何问题可添加客服微信反馈：Cattemii</p>
          <ImgBtn style="margin-top: .45rem;" :btnAttr="knowBtn" :eventName="'sHideActRules'" @sHideActRules="showActRules(0)" />
      </div>
    </div>

    <!-- 8. 点击查看大图 -->
    <div class="bigPic mask" v-if="bigPicState" @touchmove.prevent="touchPrevent">
      <div class="bigPicWpr">
        <div class="imgParent">
          <img v-show="actImageUrl" :src="require('@/static/img/closeDetail.png')" class="close" @click="toM2c1(actItem, 0)">
          <img class="big" :src="actImageUrl" @click="toM2c1(actItem, 0)" :style="actStyle">
        </div>                    
      </div>
      <div v-show="actImageUrl" class="bigPicBot">
        <p class="content">{{bigPicObj.picDescription}}</p>
        <p class="topic" v-if="bigPicObj.topicName">#{{bigPicObj.topicName}}</p>
        <div class="group">
          <aside @click="goMyWork(bigPicObj.headImg)">
            <span class="itemHeadImg" v-if="bigPicObj.headImg" :style="{backgroundImage:`url(${cdnPrefix + bigPicObj.headImg})`}">
            </span>
            <span class="itemHeadImg" v-else>
            </span>
            <span class="itemUserName">
              <var>{{bigPicObj.nickname}}</var>
            </span>
          </aside>
        </div>
        <div class="filterBtnWpr" v-if="bigPicObj.filterAction">
          <ActionBtn :btnAttr="filterBtn" :eventName="'handFilter'" :btnActionUrl="filterAction" @handFilter="openFilter"></ActionBtn>
        </div>
      </div>
    </div>

    <!-- 9. 新改的上拉刷新 -->
    <div v-if="isLoading" class="loading">
      <img class="loadImg" src="@/static/img/load.png">
      <p class="loadTxt">正在加载更多精彩内容...</p>
    </div>
    <div v-else class="loading">
      <p class="loadTxt">没有更多内容了...</p>
    </div>

  </div>
</template>
<script>
import Handlers from '@/static/js/handlers'
import loading from '@/bag/vueCommon/loading/1/loading'
import Dialog from '@/components/common/useFilterDialog.vue'
import ImgBtn from '@/components/common/hasImgBtn.vue'
import ActionBtn from '@/components/common/actionBtn.vue'
var count = 0;

export default {
  props: {
    propUserInfo: Object
  },
  components:{
    Dialog,
    ImgBtn,
    ActionBtn
  },
  data() {
    return {
      cdnPrefix: '', 
      hasLogin: false,
      actRulesState: false,
      bigPicState: false,
      
      userInfo: {}, // 用户信息
      bigPicObj: {}, // 查看大图信息
 
      datas: [], // 列表总数据 包含左侧数据和右侧数据
      lDatas: [], // 列表左侧数据
      rDatas: [], // 列表右侧数据

      actItem: {ilike: false},

      filterObj: {
        url: require("@/static/img/filter.png"),
        name: 'YU3'
      },

      picBtn: { // 按钮[上传作品]样式
        btnCon: {
          borderColor: '#434343',
          background: '#434343',
          color: '#fff'
        },
        btnImg: {
          bgUrl: ''
        },
        val: '上传作品'
      },
      myPicBtn1: { // 按钮[我的作品]样式 未登录没有“用户头像”和“昵称”
        btnCon: {},
        btnImg: {
          bgUrl: ''
        },
        val: '我的作品'
      },
      myPicBtn2: { // 按钮[我的作品]样式 登录显示“用户头像”和“昵称”
        btnCon: {
          width: '3.44rem',
          fontSize: '.3rem'
        },
        btnImg: {
          display: 'block',
          bgUrl: ''
        },
        val: ''
      },
      knowBtn: { // 按钮[知道了]
        btnCon: {
          width: '3.4rem',
          fontSize: '.34rem',
          background: '#434343',
          color: '#fff'
        },
        btnImg: {
          bgUrl: ''
        },
        val: ' 知道了',
      },
      filterBtn: { // 按钮[使用XX滤镜]
        btnCon: {
          width: '5.14rem',
          fontSize: '.34rem'
        },
        btnImg: {
          bgUrl: ''
        },
        showImg: true, // 是否显示按钮内图片
        val: '使用YU3滤镜',
        imgUrl: require('@/static/img/filter.png')
      },
      sortType: 0,
      pageNo: 1,
      busy: true,
      actStyle: {},
      actImageUrl: '',
      topicList: [{topicId: 0, topicName: '推荐'}], // 话题列表
      topicId: -1, // 话题id，默认推荐项，topicId为0
      topicName: '', // 话题名称

      curr: 0, // 当前选中的话题
      isLoading: true, // 是否上拉刷新，默认否
      showDialog: false, // 是否使用滤镜对话框，默认否

      filterAction: '',
      topics: [],
      topicListL: [],
      topicListR: []
    }
  },
  beforeCreate() {
    // let a = window.location.href.indexOf('?')
    // if(a > -1) {
    //   let b = window.location.href.indexOf('#')
    //   let t = window.location.href.substring(a, b).split('=')[1]
    //   window.location.href = `${window.location.origin}${window.location.pathname}#/m2c/${t}`
    //   console.log(`${window.location.origin}${window.location.pathname}#/m2c/${t}`);
    // }

    // 获取话题
    this.$ajax.topicList()
    .then(res => {
      if (res.code === 200) {
        // this.topicList.push(...res.result)
        const resData = [
          {topicId: 0, topicName: "推荐"},
          {topicId: 1, topicName: "晴天白云"},
          {topicId: 2, topicName: "好看的人喜欢自拍"},
          {topicId: 3, topicName: "一绝食堂"},
          {topicId: 4, topicName: "吃草的日子"},
          {topicId: 5, topicName: "人物"},
          {topicId: 6, topicName: "爱茉莉"},
          {topicId: 7, topicName: "风景"},
          {topicId: 8, topicName: "美食"},
          {topicId: 9, topicName: "奶茶"}
        ]
        this.topics.push(...resData)

        let that = this
      that.topicListL = []
      that.topicListR = []
      let l_sum = 0
      let r_sum = 0
      console.log(this.topics.length)
      this.topics.forEach((item, index) => {
        console.log(item)
        if (l_sum <= r_sum) {
          l_sum += item.topicName.length
          that.topicListL.push(item)
        } else {
          r_sum += item.topicName.length
          that.topicListR.push(item)
        }
      })
      console.log(that.topicListL)
      console.log(that.topicListR)
      } else if (res.code === 400) {
        this.$reminderMsg.show({text: res.message})
      }
    })
    .catch (err => {
      console.log(err);
    })
  },
  mounted() {
    // 从缓存中获取用户信息
    this.userInfo = JSON.parse(this.$ut.lStorageGet('userInfo'))

    // 获取home列表数据
    this.getInitHome(0, 0, '推荐')
  },
  methods: {
    // 清理缓存
    clearFn () {
      localStorage.clear();
    },
    // home页列表
    getInitHome (topicId, index, topicName) {
      this.topicName = topicName
      setTimeout(() => {
        window.scrollTo(0, 2)
      }, 20)

      if (this.topicId === topicId) return
      this.datas = []
      this.busy = true
      this.curr = index
      this.topicId = topicId
      let hToken = this.$ut.lStorageGet('htoken') || 0
      
      this.$loading(1)

      _hmt.push(['_trackEvent', 'filterAc_topicType', 'click', '点击分类数'])
      _hmt.push(['_trackEvent', `filterAc_topicType${topicId}`, 'click', `点击[${topicName}]数`])
      console.log(`filterAc_topicType${topicId}`, `点击[${topicName}]数`)

      let params = {hToken: hToken, topicId: topicId}
      this.$ajax.home(params)
      .then(res => {
        this.$ut.lStoragePut('htoken', res.result.htoken)
        this.cdnPrefix = res.result.cdnPrefix
        this.datas = res.result.pictureViews
        this.busy = false;
        if (this.datas.length === 0) {
          this.isLoading = false
        } else {
          this.isLoading = true
        }
        if (!!this.userInfo) { // 已登录
          this.hasLogin = true
          this.myPicBtn2.val = this.userInfo.userName
          let tmpHeadImg = JSON.parse(JSON.stringify(this.userInfo.headImg))
          if (tmpHeadImg.substring(0, 40).indexOf('base64') != -1) {
            this.myPicBtn2.btnImg.bgUrl = this.userInfo.headImg || ''
          } else {
            if (this.userInfo.headImg != '') {
              this.myPicBtn2.btnImg.bgUrl = this.cdnPrefix + this.userInfo.headImg
            }
          }
        } else { // 未登录
          this.hasLogin = false
        }
        setTimeout(() => {
          this.$loading(0)
        }, 50)

      })
      
    },
    // 加载更多列表数据
    loadMore: function() {
      this.busy = true
      let that = this

      let hToken = this.$ut.lStorageGet('htoken') || 0
      let params = {hToken: hToken, topicId: this.topicId}
      let timer = setInterval(() => {
        clearInterval(timer)
        return this.$ajax.home(params)
        .then(res => {
          if(res.code == 200) {
            _hmt.push(['_trackEvent', 'filterAc_listNext', 'click', '首页翻页数'])
            if (this.topicId === 0) {
              this.topicName = '推荐'
            }
            _hmt.push(['_trackEvent', `filterAc_listNext${this.topicId}`, 'click', `[${this.topicName}]翻页数`])
            
            that.cdnPrefix = res.result.cdnPrefix
            that.$ut.lStoragePut('htoken', res.result.htoken)
            console.log(`[${this.topicName}]翻页数`)

            // 判断是否登录了，登录过显示用户头像
            that.isHasLogin(that.cdnPrefix)

            let arr = []
            res.result.pictureViews.forEach((item, index) => {
              arr.push(item.id)
            })
            if(arr.length == 0) {
              return setTimeout(() => {
                that.busy = true
              }, 500)
            } else {
              that.busy = false
            }
            that.datas.push(...res.result.pictureViews)
            return setTimeout(() => {
              that.busy = false
            }, 500)
          }
        })
      }, 50)
    },
    // [我的作品]，需要判断是否登录过，登录后调到我的作品页：this.$router.push({name: 'work'})
    /**
     * 注册手机号并填写昵称、上传手机号。和手机号，才算
     */
    picsFn (goPage) {
      _hmt.push(['_trackEvent', 'filterAc_myPic', 'click', '点击我的作品'])
      this.$ut.lStoragePut('page', goPage)
      const token = this.$ut.lStorageGet('token')
      if (this.hasLogin) {
        this.$router.push({name: 'work'})
      } else {
        if (token) {
          this.getUserCome(token, goPage)
        } else {
          this.$ut.lStoragePut('page', 'work')
          this.$router.push({name: 'login'})
        }
      }
    },
    // 获取user/come接口返回false可以进入 上传头像和填写昵称页面
    getUserCome (token, goPage) {
      this.$ajax.userCome(token)
      .then(res => {
        if (res.code === 200 || res.code === '200') {
          this.$ut.lStoragePut('userCome', res.result.come)
          if (res.result.come === true || res.result.come === 'true') {
            let pageName = this.$ut.lStorageGet('page') || goPage
            this.$router.push({ name: pageName })
          } else {
            this.$router.push({name: 'user'})
          }
        } else { // token失效，重新登录
          this.$reminderMsg.show({text: res.errMsg})
          setTimeout(() => {
            this.$router.push({name: 'login'})
          }, 1500)
        }
        
      }).catch(e => {
        console.log(e);
      })
    },
    // [上传作品]，需要判断是否登录过，登录后调到我的作品页：this.$router.push({name: 'register'})
    uploadPicFn (goPage) {
      this.$ut.lStoragePut('page', goPage)
      const token = this.$ut.lStorageGet('token')
      if (this.hasLogin) {
        this.$router.push({name: 'register'})
      } else {
        if (token) {
          this.getUserCome(token, goPage)
        } else {
          this.$ut.lStoragePut('page', 'register')
          this.$router.push({name: 'login'})
        }
      }
    },
    // 是否使用同款滤镜拍摄
    filterHand (data) {
      this.showDialog = data || false
      if (data) {
        this.showDialog = false
      }
    },
    // [确定]使用同款滤镜拍摄
    useFilter (item) {
      this.showDialog = true
      if (item.filterImage !== '') {
        this.filterObj = {
          url: this.cdnPrefix + item.filterImage,
          name: item.filterName
        }
      } 
      this.filterAction = item.filterAction
    },
    // 查看大图时，使用同款滤镜拍摄
    openFilter () {
      _hmt.push(['_trackEvent', 'filterAc_useFilter', 'click', '使用同款滤镜总数'])
      this.filterAction = this.bigPicObj.filterAction
    },
    // 点击头像、昵称，跳转到我的作品列表(work.vue)
    goMyWork (headImg) {
      let locHeadImg = JSON.parse(this.$ut.lStorageGet('userInfo')).headImg
      if (headImg == locHeadImg) {
        this.$router.push({name: 'work'})
      }
    },
    touchPrevent(e) {
    },
    // 是否登录过
    isHasLogin (cdnPrefix) {
      let token = this.$ut.lStorageGet('token')
      let userCome = this.$ut.lStorageGet('userCome')
      let userPhone = this.$ut.lStorageGet('userPhone')
      if (!!this.userInfo) { // 已登录
        this.hasLogin = true
        this.myPicBtn2.val = this.userInfo.userName
        let tmpHeadImg = JSON.parse(JSON.stringify(this.userInfo.headImg))
        if (tmpHeadImg.substring(0, 40).indexOf('base64') != -1) {
          this.myPicBtn2.btnImg.bgUrl = this.userInfo.headImg
        } else {
          this.myPicBtn2.btnImg.bgUrl = cdnPrefix + this.userInfo.headImg
        }
      } else { // 未登录
        this.hasLogin = false
      }
    },
    checkFoodieMark(img) {
      return new Promise((resolve, reject) => {
        EXIF.getData(img, _ => {
            var allMetaData = EXIF.getAllTags(img);
            // console.log(allMetaData, allMetaData == true)
            resolve(allMetaData)
        })
      })
    },
    toM2c1(item, s) {
      let that = this
      if(!s) {
        that.actImageUrl = ''
        return this.bigPicState = !this.bigPicState
      }
      this.$loading(1)

      this.filterBtn.val = `使用${item.filterName == '' ? '同款' : item.filterName}滤镜`
      if (item.filterImage) {
        this.filterBtn.imgUrl = this.cdnPrefix + item.filterImage
      } else {
        this.filterBtn.imgUrl = require('@/static/img/filter.png')
      }
      _hmt.push(['_trackEvent', 'filterAc_picDes', 'click', '点击图片详情数'])
      this.actItem = item
      let img = new Image()
      img.src = this.cdnPrefix + this.actItem.picUrl + '?x-oss-process=image/resize,w_720'
      img.onload = function() {
        if(this.width * 1.5 >= this.height) {
          that.actStyle = {width: '100%'}
          $('.imgParent').css({width: '100%'})
        } else {
          that.actStyle = {height: '100%'}
          $('.imgParent').css({height: '100%'})
        }
        that.actImageUrl = this.src
        that.bigPicObj = item
        that.$loading(0)
      }
      this.bigPicState = !this.bigPicState
    },
    showActRules(e) {
      this.actRulesState = !!e
      _hmt.push(['_trackEvent', 'filterAc_actRules', 'click', '点击活动规则'])
      if(e) {
        setTimeout(() => {
          $('#actRules').css({'opacity': e})
        }, 80)
      }
    },
    imgload(e) {
      e.currentTarget.style.visibility = 'visible'
    },
    toUpload() {
      this.$router.push({name: 'register'})
    },
    imgSize(e) {
      if(e.currentTarget.width * 1.5 >= e.currentTarget.height) {
        e.currentTarget.style.width = '100%'
      } else {
        e.currentTarget.style.height = '100%'
      }
    },
    bodySty () {
      $('body').addClass('bodySty')
    }
  },
  watch: {
    showDialog: {
      handler: function (val, oldval) {
        if (val) {
          // 可在此设置弹出层后不滚动 给body、html添加overflow: hidden;
          // $('body').css('overflow', 'hidden')
        } else {
          // $('body').css('overflow', 'scroll')
        }
      },
      immediate: true // 立刻监听
    },
    'datas'() {
      let that = this
      that.lDatas = []
      that.rDatas = []
      let l_h = 0
      let r_h = 0
      let itemW = $('.items.l').width()
      this.datas.forEach((item, index) => {
        let img = new Image()
        item.imgH = itemW * item.picHeight / item.picWidth
        if(l_h <= r_h) {
          l_h += item.imgH
          that.lDatas.push(item)
        } else {
          r_h += item.imgH
          that.rDatas.push(item)
        }
      })
    },
    
  }
}
</script>

<style lang="scss">
#p5_{
  .sort::-webkit-scrollbar{
    width:0; 
    height:0; 
    display: none!important;
  }
  background-color:#f6f7fa;
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  padding-bottom: 1.5rem;
  box-sizing: border-box;
  position: relative;
  .head{
    width: 100%;
    position: fixed;
    background-color: #fff;
    top: 0;
    left: 0;
    z-index: 9;
    height: 2.12rem;
  }
  .tip{
    position: absolute; top: 0; left: 5.9rem; 
    color:#939393; 
    font-size: .26rem;
    line-height: .32rem;
    .activeRule{
      width: .28rem;
      display: inline-block;
      vertical-align: top;
      position: relative;
      top: 0;
    }
    .activeTxt{
      display: inline-block;
      vertical-align: top;
    }
  }
  .theme{
    margin: .06rem 0 .24rem .34rem;
    width: 2.66rem;
  }
  
  .group{
    height: .42rem;
    vertical-align: middle;
    line-height: .42rem;
    display: flex;
    justify-content: space-between;
    span{
      vertical-align: top;
    }
    .itemHeadImg{
      display: inline-block;
      width: .3rem;
      height: .3rem;
      border-radius: 50%;
      overflow: hidden;
      margin-top: .04rem;
      // position: relative;
      // img{
      //   width: 100%;
      //   position: absolute;
      //   top: 50%;
      //   transform: translateY(-50%);
      // }
      background-size: cover;
      background-repeat: no-repeat;
      background-image: url('../static/img/portrait.png');
      background-position: center center;
    }
    .itemUserName{
      font-weight: 500;
      display: inline-block;
    }
    var{float: left; height: inherit; line-height: inherit; font-size: .26rem;}
    .filterWrap{
      width: .98rem;
      height: .4rem;
      vertical-align: middle;
      box-sizing: border-box;
      border-radius: .05rem;
      line-height: .38rem;
      border: 1px solid #c2c2c2; 
    }
    .filterImg{
      border-radius: 50%;
      overflow: hidden;
      display: inline-block;
      width: .28rem;
      height: .28rem;
      margin-top: .04rem;
      margin-left: .06rem;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: url('../static/img/portrait.png');
      background-position: center center;
    }
    .filterName{
      // position: relative;
      // top: -.02rem;
    }
    em{
      float: right;
      font-size: .3rem;
      img{
        position: relative;
        top: .07rem;
        width: .29rem;
        margin-right: .05rem;
      }
    }
  }
  
  .wpr{
    min-height: 15rem;
    margin-top: 2.12rem;
    background: #f6f7fa;
    overflow: hidden;
    // color:#c5a309;
    color:#333;
    font-size: .28rem;
    padding: .12rem .1rem;
    box-sizing: border-box;
  }
  
  .sort{
    padding-left: .34rem;
    box-sizing: border-box;
    line-height: .54rem;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;

    button{
      display:inline-block;
      background:none;
      border:none;
      font-size: .32rem;
      margin-right: .48rem;
      vertical-align: middle;
      position: relative;
      transition: all .2s;
      // width:1.02rem;
      var{
        color:#a1a1a1;
        position: relative;
        z-index: 2;
        height: .76rem;
        line-height: .76rem;
      }
      &:before{
        content:""; 
        display:block;
        height: .12rem;
        width: inherit;
        position: absolute;
        z-index: 1;
        bottom: 0;
        border-radius: .6rem;
        width: 0;
        transition: all .4s;
        transform: translate(-50%);
        left:50%;
      }
      &.active:before{
        background-color:#ffee35;
        width:100%;
      }
    }
    button .active{
      color: #333;
      font-weight: bold;
    }
  }
  .sort::-webkit-scrollbar{
    width:0; 
    height:0; 
    display: none!important;
  }
  .items{
    width: 3.6rem; 
    float: left;
    display: inline;
  }
  .items.r{
    float:right;
  }
  .item{
    background-color: #fff;
    margin-bottom: .08rem;
    border-radius: .1rem;
    overflow: hidden;
    position: relative;
    img{
      width:100%;
    }
    var {
      overflow: hidden;text-overflow: ellipsis;display: inline-block; -webkit-line-clamp:1;-webkit-box-orient:vertical;
      width:1.5rem;white-space: nowrap;text-overflow: ellipsis;
    }
    .thumbs{
      position: absolute;
      bottom: .16rem;
      right: .18rem;
      color: #fff;
      img{
        width: .29rem;
      }
    }
    .top{
      position: relative;
    }
    .bot{
      line-height: .64rem;font-size: .24rem;color:#333;
      box-sizing: border-box;
      padding: .14rem;
      .content{
        line-height: .38rem;
        font-size: .28rem;
        font-weight: 500;
      }
      .topic{
        line-height: .44rem;
        font-size: .24rem;
        font-weight: 500;
      }
    }
  }
  .btn1{
    position: relative;display:inline-block;margin-top:.42rem;
    em{
      display:block;transition: all 1.4s;
      font-size: .34rem;width:2.02rem;line-height:.8rem;
      position: relative;z-index: 2;text-align: center;
      background-color:#5a9ae1;
      color:#ffeca9;
    }
    img{
      width:.4rem;vertical-align: baseline;position: relative;top:.02rem;
    }
  }
  .bigPicBot{
    width: 6.3rem;
    line-height: .44rem;
    color: #fff;
    padding-top: .18rem;
    .content{
      font-size: .28rem;
    }
    .filterBtnWpr{
      text-align: center;
      margin-top: .44rem;
    }
  }
  .bigPic{
      flex-direction: column;background-color: rgba(0, 0, 0, .9);
      .close{
        width: .62rem; position: absolute; right: .16rem; top: .16rem;
      }
  }
  .bigPicWpr{
    width: 6.3rem;
    height: 8.8rem;
    // max-height: 8.8rem;
    display: flex;align-items: center;justify-content: center;
    .imgParent{
      position: relative;
      text-align: center;
    }
    .big{
      // max-width: 6.3rem;
      // max-height: 8.8rem;
    }
  }
  .loading{
    padding-top: .25rem;
    text-align: center;
    .loadImg{
      width: .27rem;
    }
    .loadTxt{
      font-size: .24rem;
      color: #c6c6c6;
      margin-top: .15rem;
    }
  }
}
#actRules{
  opacity: 0;
  .actRwpr{
    background-color: #fff;
    width:5.8rem;
    box-sizing: border-box;
    padding: .5rem .42rem .38rem;
    border-radius: .2rem;text-align: center;
  }
  h4{
    font-size: .32rem;font-weight: bolder;
    line-height: 1.6;text-align: center;
    color: #000;
  }
  .con{
    font-size: .26rem;color: #333;line-height: .38rem;margin-top:.2rem;text-align: left;
  }
  .btn{
    margin-top:.3rem;
  }
  
}

.btnGroup{
  position: fixed;
  bottom: .6rem;
  width: 100%;
  text-align: center;
  display: flex; 
  justify-content: space-around;
  
  .btnCon{
    box-shadow: .01rem .01rem .14rem 0 rgba(0, 0, 0, 0.3);
  }
}

</style>
