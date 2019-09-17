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
        <button type="button" v-for="(item, i) in topicListL" :key="item.topicId" :class="[item.className, {active: item.ind == curr}]" @click="getInitHome(item.topicId, item.ind, item.topicName)" >
          <img v-if="item.hot === 2" class="hot" :src="require('../static/img/hot.png')" />
          {{item.topicName}}
        </button><br/>
        <button type="button" v-for="(item, j) in topicListR" :key="item.topicId" :class="[item.className, {active: item.ind == curr}]" @click="getInitHome(item.topicId, item.ind, item.topicName)" >
          <img v-if="item.hot === 2" class="hot" :src="require('../static/img/hot.png')" />
          {{item.topicName}}
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
            <span @click.stop="tapLike(item)" class="like posz" :class="{likeActive: item.liked}" > 
              {{item.likedNum}}
            </span> 
          </div>
          <div class="bot">
            <p class="content">{{item.picDescription}}</p>
            <p class="topic" v-if="item.topicName">#{{item.topicName}}</p>
            
            <div class="group">
              <aside @click="goUserCenter">
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
            <span class="like posz" :class="{likeActive: item.liked}" @click.stop="tapLike(item)"> 
              {{item.likedNum}}
            </span>
          </div>
          <div class="bot">
            <p class="content">{{item.picDescription}}</p>
            <p class="topic" v-if="item.topicName">#{{item.topicName}}</p>
            <div class="group">
              <aside @click="goUserCenter">
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
        <div class="group">
              <aside>
                <span class="like" :class="{likeActive: actItem.liked}" @click.stop="tapLike(actItem)">
                  {{bigPicObj.likedNum}}
                </span>
              </aside>
              <aside class="filterWrap" v-if="filterBtn.imgUrl" style="background: #fff; color: #333;" @click="useFilter(filterAction)">
                <span class="filterImg" :style="{backgroundImage:`url(${filterBtn.imgUrl})`}">
                </span>
                <span class="filterName"> 
                  {{filterBtn.val}}
                </span>
              </aside>
            </div>
        <p class="content">{{bigPicObj.picDescription}}</p>
        <p class="topic topicDetail" v-if="bigPicObj.topicName">#{{bigPicObj.topicName}}</p>
        <!-- <p class="topic topicDetail" v-if="bigPicObj.dingwei">#{{bigPicObj.dingwei}}</p> -->
        <p class="topic posiDetail">{{bigPicObj.position }}</p>
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
        <div class="filterBtnWpr">
          <!-- <ActionBtn :btnAttr="filterBtn" :eventName="'handFilter'" :btnActionUrl="filterAction" @handFilter="openFilter"></ActionBtn> -->
          <ImgBtn v-if="bigPicObj.topicName" :btnAttr="takeTopicBtn1" :eventName="'handleTopic'"   @handleTopic="takeTopic"></ImgBtn>
          <ImgBtn v-else :btnAttr="takeTopicBtn2" :eventName="'handleTopic'"   @handleTopic="takeTopic"></ImgBtn>
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
import loading from '@/bag/vueCommon/loading/1/loading'
import Dialog from '@/components/common/useFilterDialog.vue'
import ImgBtn from '@/components/common/hasImgBtn.vue'
import ActionBtn from '@/components/common/actionBtn.vue'

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

      liked: false, // 默认没有点赞

      // filterObj: {
      //   url: require("@/static/img/filter.png"),
      //   name: 'YU3'
      // },
      filterObj: {
        url:  '',
        name: ' '
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
        val: ' ',
        imgUrl: ' '
      },
      takeTopicBtn1: {
        btnCon: { // 按钮样式
          width: '5.14rem',
          fontSize: '.34rem'
        },
        btnImg: { // 按钮内图片样式
          bgUrl: ''
        },
        val: '参与话题'
      },
      takeTopicBtn2: {
        btnCon: { // 按钮样式
          width: '5.14rem',
          fontSize: '.34rem'
        },
        btnImg: { // 按钮内图片样式
          bgUrl: ''
        },
        val: '上传作品'
      },
      sortType: 0,
      pageNo: 1,
      busy: true,
      actStyle: {},
      actImageUrl: '',
      topicList: [{topicId: 0, topicName: '推荐'}], // 话题列表
      topicListL: [],
      topicListR: [],
      topicId: -1, // 话题id，默认推荐项，topicId为0
      topicName: '', // 话题名称

      curr: 0, // 当前选中的话题
      isLoading: true, // 是否上拉刷新，默认否
      showDialog: false, // 是否使用滤镜对话框，默认否

      filterAction: '',

      partNum: null// 标签分两行，按照1:1分
    }
  },
  beforeCreate() {

    // 获取话题
    this.$ajax.topicList()
    .then(res => {
      if (res.code === 200) {
        this.topicList.push(...res.result) 
        let midNum = Math.floor(this.topicList.length / 2)
        this.topicList.forEach((item, index) => {
          item.ind = index
          item.className = 'color' + (index % 7)
          if (index < midNum) {
            this.topicListL.push(item)
          } else {
            this.topicListR.push(item)
          }
        })
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
    // 点赞
    tapLike(el) { 
      console.log(el)
      if(el.liked) {
        return this.$reminderMsg.show({text: '您已经给此图点过赞啦'})
      }
      this.$loading(1)
      this.$ajax.setLike({picId: el.id, um5: el.um5})
      .then(res => {
        this.$loading(0)
        if(res.code === 200 || res.code === '200') {
          //如果缓冲中存在则获取，默认为空数组
         let commentedList = JSON.parse(localStorage.getItem('$FoodieData'))||[];
         //如果获取的值不是数组，清空，防止已经存在这样的缓冲
        if(commentedList.constructor != Array ){
          localStorage.removeItem('$FoodieData');
          commentedList = [];
        }
        commentedList.push(el.id);
        localStorage.setItem('$FoodieData',JSON.stringify(commentedList))
        el.likedNum += 1;
        el.liked = true;
        // this.$set(this.actItem, 'liked', true)
        // this.$set(this.actItem, 'likedNum', item.likedNum + 1)
        }
      })
      .catch(e => {
        console.log(e)
        this.$loading(0)
      })
    },
    goUserCenter() {
      this.$router.push({name: 'my'})
    },
    takeTopic ( ) {
      console.log('can yu huati')
      },
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
      // if (headImg == locHeadImg) {
        this.$router.push({name: 'my'})
      // }
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
      this.actItem = item
      // this.filterBtn.val = `使用${item.filterName == '' ? '同款' : item.filterName}滤镜`
      this.filterBtn.val = item.filterName
      this.filterBtn.imgUrl = item.filterImage
      if (item.filterImage) {
        this.filterBtn.imgUrl = this.cdnPrefix + item.filterImage
      } 
      // console.log(this.filterBtn)

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
              // topicName
console.log(that.bigPicObj)
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
     
      let commentedList = JSON.parse(localStorage.getItem('$FoodieData'))||[];
      //如果获取的值不是数组，清空，防止已经存在这样的缓冲
      if(commentedList.constructor != Array ){
        localStorage.setItem('$FoodieData','[]');
        commentedList = [];
      }
    // if(commentedList.length<1){
    //   return;
    // }
      this.datas.forEach((item, index) => {
        if(commentedList.includes(item.id)){
          item.liked = true;
        }
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
    }

  }
}
</script>

<style lang="scss">
#p5{
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
    height: 4.12rem;
    overflow: hidden;
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
    margin: .44rem .1rem .18rem;
    width: 7.3rem;
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
      // background-image: url('../static/img/portrait.png');
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
    margin-top: 4.12rem;
    background: #f6f7fa;
    overflow: hidden;
    // color:#c5a309;
    color:#333;
    font-size: .28rem;
    padding: .12rem .1rem;
    box-sizing: border-box;
  }
  
  .sort{
    padding-left: .1rem;
    box-sizing: border-box;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
     
    button{
       
      background: none;
      border: none;
      height: .6rem;
        line-height: .6rem;
      font-size: .28rem;
      // height: .6rem;
      // box-sizing: border-box;
      padding: 0 .28rem 0;
      margin-right: .18rem;margin-bottom: .18rem;
      // vertical-align: middle;
      // position: relative;
      // transition: all .2s;
      border-radius: .3rem;
       
        color:#fff;
      // var{
      //   color:#fff;
      //   // position: relative;
      //   // z-index: 2;
      //   height: .6rem;
      //   line-height: .6rem;
      // }
      // &:before{
      //   content:""; 
      //   display:block;
      //   height: .12rem;
      //   width: inherit;
      //   position: absolute;
      //   z-index: 1;
      //   bottom: 0;
      //   border-radius: .6rem;
      //   width: 0;
      //   transition: all .4s;
      //   transform: translate(-50%);
      //   left:50%;
      // }
      // &.active:before{
      //   background-color:#ffee35;
      //   width:100%;
      // }
    }
    button.active{
      color: #787878;
      font-weight: bold;
    }
    
    .color0{
      box-shadow: 0 .05rem .09rem rgba(255, 190, 142, .7);
      background-color: #ffbe8e; 
    }
    .color1{
      box-shadow: 0 .05rem .09rem rgba(204, 201, 255, .7);
      background-color: #ccc9ff; 
    }
    .color2{
      box-shadow: 0 .05rem .09rem rgba(255, 189, 217, .7);
      background-color: #ffbdd9; 
    }
    .color3{
      background: #e4c4ff;
      box-shadow: 0 .05rem .09rem rgba(228, 196, 255, .7);
    }
    .color4{
      background: #b6d7ff;
      box-shadow: 0 .05rem .09rem rgba(182, 215, 255, .7);
    }
    .color5{
      background: #9ae4cc;
      box-shadow: 0 .05rem .09rem rgba(154, 228, 204, .7);
    }
    .color6{
      background: #fddb8a;
      box-shadow: 0 .05rem .09rem rgba(253, 219, 138, .7);
    }
    .hot{width: .32rem; height: .32rem; margin-top: .12rem;}
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
  z-index: 5;
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

 
  .like{
    display: inline-block;
    // width: .66rem;
    height: .42rem;
    padding-left: .36rem;
    font-size: .28rem;
    font-weight: bold;
    background-size: .26rem .23rem;
    background-repeat: no-repeat;
    background-image: url('../static/img/thumb.png');
    background-position: left center;
  }
  .likeActive{
    background-image: url('../static/img/thumb-up.png');
  }
  .posz{
    position: absolute;
    z-index: 2;
    color: #fff;
    right: .1rem;
    bottom: .12rem;
    line-height: .42rem;
  }
  .topicDetail{
    padding-left: .36rem;

    background-size: .24rem .24rem;
        background-repeat: no-repeat;
        background-image: url('../static/img/icon1.png');
        background-position: left center;
  }
  .posiDetail{
    padding-left: .36rem;

    background-size: .24rem .24rem;
        background-repeat: no-repeat;
        background-image: url('../static/img/icon2.png');
        background-position: left center;
  }
</style>
