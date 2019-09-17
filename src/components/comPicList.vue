<template>
  <div id="dynamic" class="dynamic">
    <!-- 2. 列表内容区 -->
    <div class="wpr">
      <div class="items l" ref="leftWrp">
        <div class="item" v-for="(item, index) in lDatas" :key="index">
          <div class="top">
            <img :src="cdnPrefix + item.picUrl + '?x-oss-process=image/resize,w_400'" class="mediaImg" @load="imgload" alt="" @click="toM2c1(item, 1)" :style="{'height': item.imgH + 'px'}" />
            <img v-if="item.picQuality === 2" class="recommend" src="@/static/img/recommend.png">
          </div>
          <div class="bot">
            <p class="content">{{item.picDescription}}</p>
            <p class="topic" v-if="item.topicName">#{{item.topicName}}</p>
            <div class="group">
              <aside>
                <span class="itemHeadImg" v-if="userInfo.headImg" :style="{backgroundImage:`url(${cdnPrefix + userInfo.headImg})`}">
                </span>
                <span class="itemHeadImg" v-else>
                </span>
                <span class="itemUserName">
                  <var>{{userInfo.userName}}</var>
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
            <img v-if="item.picQuality === 2" class="recommend" src="@/static/img/recommend.png">
          </div>
          <div class="bot">
            <p class="content">{{item.picDescription}}</p>
            <p class="topic" v-if="item.topicName">#{{item.topicName}}</p>
            <div class="group">
              <aside>
                <span class="itemHeadImg" :style="{backgroundImage:`url(${cdnPrefix + userInfo.headImg})`}">
                </span>
                <span class="itemUserName">
                  <var>{{userInfo.userName}}</var>
                </span>
              </aside>
              <aside class="filterWrap" v-if="item.filterAction" @click="useFilter(item)">
                <span class="filterImg" v-if="item.filterImage" :style="{backgroundImage:`url(${cdnPrefix + item.filterImage})`}">
                </span>
                <span class="filterImg" v-else :style="{backgroundImage:`url(${cdnPrefix + item.filterImage})`}">
                </span>
                <span class="filterName">
                  {{item.filterName}}
                </span>
              </aside>
            </div>
          </div>
        </div>
        <div v-if="pageType=='isAlbum'" v-infinite-scroll="loadMoreAlbum" infinite-scroll-disabled="busy" infinite-scroll-distance="40"></div>
      </div>

    </div>

    <!-- 3. 是否使用同款滤镜拍摄对话框 -->
    <transition name="dialog">
      <Dialog v-show="showDialog" :filterObj="filterObj" :actionUrl="filterAction" @parentHandNo="filterHand"></Dialog>
    </transition>

    <!-- 4. 点击查看大图 -->
    <transition>
      <div class="bigPic mask" v-if="bigPicState" @touchmove.prevent="touchPrevent">
        <div class="bigPicWpr">
          <div class="imgParent">
            <img v-show="actImageUrl" :src="require('@/static/img/closeDetail.png')" class="close" @click="toM2c1(actItem, 0)">
            <img class="big" :src="actImageUrl" @click="toM2c1(actItem, 0)" :style="actStyle">
            <!-- <p class="currCover">当前封面</p> -->
            <p @click="setCoverFn" class="setCover">设为封面</p>
            <p v-show="actImageUrl" class="delete" @click="deleteMyWork(actItem.id)">删除</p>
          </div>
        </div>
        <div v-show="actImageUrl" class="bigPicBot">
          <p class="content" :class="{noTopic: bigPicObj.topicName}">{{bigPicObj.picDescription}}</p>
          <p class="topic" v-if="bigPicObj.topicName">#{{bigPicObj.topicName}}</p>
          <div class="group">
            <aside>
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
            <ActionBtn :btnAttr='filterBtn' :eventName="'handleFilter'" :btnActionUrl="filterAction" @handleFilter="openFilter"></ActionBtn>
          </div>
        </div>
      </div>
    </transition>

    <!-- 5. 上拉刷新 -->
    <div v-if="isLoading" class="loadingBg">
      <img class="loadImg" src="@/static/img/load.png">
      <p class="loadTxt">正在加载更多精彩内容...</p>
    </div>
    <div v-else class="loadingBg">
      <p class="loadTxt">没有更多内容了...</p>
    </div>

    <!-- 6. 确定删除 -->
    <transition name="confirmDel">
      <ConfirmDel :txtVal="'是否确定删除'" v-show="showConfirm" @confirmHand="confirmDelete"></ConfirmDel>
    </transition>

    <!-- 7. 返回首页 -->
    <!-- <div class="goHome">
      <ImgBtn :btnAttr='backBtn' :eventName="'goHome'" @goHome="goListBtn"></ImgBtn>
    </div> -->

    <div class="noDataGroup">
      <p class="noData">
        <img src="@/static/img/noData.png" alt="">
      </p>
      <p>您还没有上传过作品</p>
      <p class="last">点击上传分享吧</p>
      <button @click="goUploadFn">上传</button>
    </div>
  </div>
</template>

<script>
import loading from '@/bag/vueCommon/loading/1/loading'
import Dialog from '@/components/common/useFilterDialog.vue'
import ImgBtn from '@/components/common/hasImgBtn.vue'
import ActionBtn from '@/components/common/actionBtn.vue'
import ConfirmDel from '@/components/common/confirmDialog.vue'

export default {
  props: ['pageType'],
  components: {
    loading,
    Dialog,
    ImgBtn,
    ActionBtn,
    ConfirmDel
  },
  data () {
    return {
      cdnPrefix: '', // CDN路径
      userInfo: {
        userName: '',
        headImg: ''
      }, // 用户信息
      datas: [],
      lDatas: [],
      rDatas: [],

      initFlag: true,

      isLoading: false, // 是否上拉刷新，默认否
      showDialog: false, // 是否使用滤镜对话框，默认否
      filterObj: {
        url: require("@/static/img/filter.png"),
        name: 'YU3'
      }, // 弹窗显示路径图标和名字

      showConfirm: false,
      deleteId: '',

      bigPicObj: {}, // 点击查看大图
      bigPicState: false,
      actStyle: {},
      actImageUrl: '', // 大图地址

      filterAction: '', // 滤镜跳转地址

      pageNo: 1,
      pageSize: 10,
      isLoading: true, // 是否上拉刷新，默认否
      busy: false,

      getUrl: '', // api地址

      filterBtn: {
        btnCon: { // 按钮样式
          width: '5.14rem',
          fontSize: '.34rem'
        },
        btnImg: { // 按钮内图片样式
          width: '.49rem',
          height: '.49rem',
          top: '.18rem'
        },
        showImg: true,
        val: '使用YU3滤镜',
        imgUrl: require('@/static/img/filter.png'),
      },
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

      cursor: 0,
      topicId: 0, // 话题id
      albumId: 0, // 相册id 
    }
  },
  created () {

  },
  mounted () {
    this.topicId = this.$route.query.topicId ? this.$route.query.topicId : 0
    this.albumId = this.$route.query.id ? this.$route.query.id : 0

    console.log(this.topicId)
    if (this.pageType == 'isAlbum') { // 获取某个相册下图片列表
      this.myAlbumPicList()
    } else if (this.pageType == 'isTopic') { // 获取我的具体某个话题图片列
      // this.myTopicPicList()
    } else if (this.pageType == 'isDynamic') { // 获取我的动态图片列表
      // this.dynamicPicList()
    }
    localStorage.removeItem('page')
    
  },
  methods: {
    goUploadFn () {
      this.$router.push({name: 'register'})
    },
    // 设置为封面
    setCoverFn( ) { 
      console.log({albumId: this.bigPicObj.albumId, picId: this.bigPicObj.id, token: this.$ut.lStorageGet('token')})
      this.$ajax.setAlbumCover({albumId: this.bigPicObj.albumId, picId: this.bigPicObj.id, token: this.$ut.lStorageGet('token')})
      .then(res => {
        if(res.code === 200 || res.code === '200') {
           
          console.log(res)
        }
      })
      .catch(e => {
        console.log(e);
      })
    },
    // 删除我的作品
    deleteMyWork (id) {
      this.showConfirm = !this.showConfirm
      this.deleteId = id
      _hmt.push(['_trackEvent', 'filterAc_deletePic', 'click', '删除我的作品'])
    },
    // 返回首页
    goListBtn () {
      this.$router.push({name: 'list'})
    },
    // [取消]或[确定]使用同款滤镜
    filterHand (data) {
      this.showDialog = data || false
      if (data) {
        this.showDialog = false
      }
    },
    // [取消]或[确定]删除我的作品
    confirmDelete (data) {
      this.showConfirm = data || false
      this.actImageUrl = ''
      if (data) {
        this.showConfirm = false
        let token = this.$ut.lStorageGet('token')
        this.$ajax.deleteWork ({token, id: this.deleteId})
        .then(res => {
          if (res.code === 200 || res.code === '200') {
            this.bigPicState = !this.bigPicState
            this.datas = this.datas.filter((item, index) => {
              return item.id != this.deleteId
            })
            if (this.datas.length === 0) {
              $('.loadingBg').css({'display': 'none'})
              $('.noDataGroup').css({'display': 'block'})
            } else {
              $('.loadingBg').css({'display': 'block'})
              $('.noDataGroup').css({'display': 'none'})
            }
          } else if (res.code === 400 || res.code === '400') {
            this.$reminderMsg.show({text: res.message})
          } else {
            this.$reminderMsg.show({text: res.message})
          }
        }).catch(e => {
          console.log(e);
        })
      }
    },
    openFilter () {
      _hmt.push(['_trackEvent', 'filterAc_useFilter', 'click', '使用同款滤镜总数'])
      this.filterAction = this.bigPicObj.filterAction
    },
    // 使用同款滤镜（弹出弹窗）
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
    imgload(e) {
      e.currentTarget.style.visibility = 'visible'
    },
    // 点击查看大图
    toM2c1(item, s) {
      let that = this
      if(!s) {
        that.actImageUrl = ''
        return this.bigPicState = !this.bigPicState
      }
      this.filterBtn.val = `使用${item.filterName}滤镜`
      if (item.filterImage) {
        this.filterBtn.imgUrl = this.cdnPrefix + item.filterImage
      } else {
        this.filterBtn.imgUrl = require('@/static/img/filter.png')
      }
      _hmt.push(['_trackEvent', 'filterAc_picDes', 'click', '点击图片详情数'])
      this.$loading(1)
      this.actItem = item
      let img = new Image();
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
        console.log(that.bigPicObj)
        // 重点说明：我的作品列表里没有用户头像，在列表数据外面
        that.bigPicObj.headImg = that.userInfo.headImg
        that.bigPicObj.nickname = that.userInfo.userName
        that.$loading(0)
      }
      this.bigPicState = !this.bigPicState
    },
    // 获取我的具体某个话题图片列表 
    myTopicPicList() { 
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0
      this.datas = []
      this.pageNo = 1
      this.busy = false
      setTimeout(() => { window.scrollTo(0, scrollTop + 1) }, 200)
      this.$loading(1)
      this.$ajax.getTopicPicList({topicId: this.topicId, cursor: this.cursor, token: this.$ut.lStorageGet('token')})
      .then(res => {
        if(res.code === 200 || res.code === '200') {
          this.cdnPrefix = res.result.cdnPrefix
          this.userInfo = {userName: res.result.nickname, headImg: res.result.headImageUrl}
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
    // 获取某个相册下图片列表
    myAlbumPicList() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0
      this.datas = []
      this.busy = false
      setTimeout(() => { window.scrollTo(0, scrollTop + 1) }, 200)
      this.$loading(1)
      this.$ajax.getAlbumPicList({albumId: this.albumId, cursor: this.cursor, token: this.$ut.lStorageGet('token')})
      .then(res => { 
        if(res.code === 200 || res.code === '200') {
          this.cdnPrefix = res.result.cdnPrefix
          this.userInfo = {userName: res.result.nickname, headImg: res.result.headImageUrl}
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
    // 获取我的动态图片列表
    dynamicPicList() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0
      this.datas = []
      this.pageNo = 1
      this.busy = false
      setTimeout(() => { window.scrollTo(0, scrollTop + 1) }, 200)
      this.$loading(1)
      this.$ajax.myWorkList({pageNo: this.pageNo, pageSize: this.pageSize, token: this.$ut.lStorageGet('token')})
      .then(res => {
        if(res.code === 200 || res.code === '200') {
          this.cdnPrefix = res.result.cdnPrefix
          this.userInfo = {userName: res.result.nickname, headImg: res.result.headImageUrl}
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
    loadMoreAlbum: function() {
      
      if (this.initFlag) return
      this.busy = true
      

      let that = this
      let timer = setInterval(() => {
        clearInterval(timer)
        return this.$ajax.getAlbumPicList({albumId: this.albumId, cursor: this.cursor, token: this.$ut.lStorageGet('token')})
        .then(res => {
          if(res.code == 200) {
            
            that.cdnPrefix = res.result.cdnPrefix
            let arr = []
            res.result.pictureViews.forEach((item, index) => {
              arr.push(item.id)
            })
            if(arr.length == 0) {
              that.isLoading = false;
              return setTimeout(() => {
                that.busy = true
              }, 500)
            }
            that.datas.push(...res.result.pictureViews)
            return setTimeout(() => {
              that.busy = false
            }, 500)

          }
        })
      }, 50)

    },
    loadMoreTopicList: function() {
      
      if (this.initFlag) return
      console.log('loadMore')
      this.busy = true
      this.pageNo ++

      let that = this
      let timer = setInterval(() => {
        clearInterval(timer)
        return this.$ajax.myWorkList({pageNo: this.pageNo, pageSize: this.pageSize, token: this.$ut.lStorageGet('token')})
        .then(res => {
          if(res.code == 200) {
            
            that.cdnPrefix = res.result.cdnPrefix
            let arr = []
            res.result.pictureViews.forEach((item, index) => {
              arr.push(item.id)
            })
            if(arr.length == 0) {
              that.isLoading = false;
              return setTimeout(() => {
                that.busy = true
              }, 500)
            }
            that.datas.push(...res.result.pictureViews)
            return setTimeout(() => {
              that.busy = false
            }, 500)

          }
        })
      }, 50)

    },
    loadMoreDynamic: function() {
      
      if (this.initFlag) return
      console.log('loadMore')
      this.busy = true
      this.pageNo ++

      let that = this
      let timer = setInterval(() => {
        clearInterval(timer)
        return this.$ajax.myWorkList({pageNo: this.pageNo, pageSize: this.pageSize, token: this.$ut.lStorageGet('token')})
        .then(res => {
          if(res.code == 200) {
            
            that.cdnPrefix = res.result.cdnPrefix
            let arr = []
            res.result.pictureViews.forEach((item, index) => {
              arr.push(item.id)
            })
            if(arr.length == 0) {
              that.isLoading = false;
              return setTimeout(() => {
                that.busy = true
              }, 500)
            }
            that.datas.push(...res.result.pictureViews)
            return setTimeout(() => {
              that.busy = false
            }, 500)

          }
        })
      }, 50)

    },
  },
  watch: {
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
    }
  }
}
</script>

<style lang='scss' scoped>
#dynamic{
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
    height: 1.86rem;
    background: #fff;
    line-height: 1.86rem;
    display: flex;
    .headImg{
      width: 1.04rem;
      height: 1.04rem;
      border-radius: 50%;
      margin-left: .28rem;
      margin-top: .45rem;
      margin-right: .1rem;
      overflow: hidden;
      // position: relative;
      display: block;
      background-size: cover;
      background-repeat: no-repeat;
      // background-image: url('/static/portrait.png');
      background-image: url('../static/img/portrait.png');
      background-position: center center;
    }
    // img{
    //   position: absolute;
    //   width: 1.04rem;
    //   top: 50%;
    //   left: 50%;
    //   transform: translate(-50%, -50%);
    // }
    .nickname{
      line-height: 1.04rem;
      margin-top: .45rem;
      color: #333;
      font-size: .4rem;
    }
  }
  .noDataGroup{
    padding-top: 1.45rem;
    box-sizing: border-box;
    p{
      line-height: .5rem;
      text-align: center;
      font-size: .3rem;
      color: #333;
    }
    .noData img{
      display: inline-block;
      width: 1.16rem;
      margin-bottom: .25rem;
    }
    .last{
      margin-bottom: .5rem;
    }
    button{
      display: block;
      border: none;
      width: 3.04rem;
      height: .88rem;
      line-height: .88rem;
      background: #434343;
      color: #fff;
      border-radius: .44rem;
      font-size: .34rem;
      margin: 0 auto;
    }
  }
  .wpr{
    margin-top: 2.48rem;
    background: #f6f7fa;
    overflow: hidden;
    color:#333;
    font-size: .28rem;
    padding: .12rem .1rem;
    box-sizing: border-box;
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
      //   left: 50%;
      //   transform: translate(-50%, -50%);
      // }
      background-size: cover;
      background-repeat: no-repeat;
      background-image: url('../static/img/portrait.png');
      background-position: center center;
    }
    .itemUserName{
      display: inline-block;
      font-weight: 500;
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
      margin-top: .05rem;
      margin-left: .06rem;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: url('../static/img/portrait.png');
      background-position: center center;
      // position: relative;
      // top: .05rem;
      // img{
      //   width: .28rem;
      //   height: .28rem;
      // }
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
      .recommend{
        position: absolute;
        top: .08rem;
        left: .08rem;
        width: .74rem;
        height: .42rem;
      }
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
      .noTopic{
        margin-bottom: .14rem;
      }
    }
  }

  .loadingBg{
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
  .bigPic{
    flex-direction: column;background-color: rgba(0, 0, 0, .9);
    .close{
      width: .62rem; position: absolute; right: .16rem; top: .16rem;
    }
  }
  .bigPicWpr{
    width: 6.3rem;
    // max-height: 8.8rem;
    height: 8.8rem;
    display: flex;align-items: center;justify-content: center;
    .imgParent{
      position: relative;
      text-align: center;
      // width: auto;
      // max-width: 6.3rem;
    }
    .big{
      // max-width: 6.3rem;
      // max-height: 8.8rem;
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
}
.setCover{ 
  position: absolute;
  left: .12rem;
  bottom: .24rem;
  width: 1.78rem;
  height: .6rem;
  box-shadow: 0 0 .1rem 0 rgba(0, 0, 0, .2);
  background: rgba(255,255,255,.19);
  border-radius: .06rem;
  text-align: center;
  line-height: .64rem;
  font-size: .26rem;
  color: #333;
}
.currCover{ 
  position: absolute;
  left: .12rem;
  bottom: .24rem;
  width: 1.78rem;
  height: .6rem;
  box-shadow: 0 0 .1rem 0 rgba(0, 0, 0, .2);
  background: #fff072;
  border-radius: .06rem;
  text-align: center;
  line-height: .64rem;
  font-size: .26rem;
  color: #333;
}
.delete{
  position: absolute;
  right: .24rem;
  bottom: .24rem;
  width: 1.2rem;
  height: .6rem;
  box-shadow: 0 0 .1rem 0 rgba(0, 0, 0, .2);
  background: #fff;
  border-radius: .06rem;
  text-align: center;
  line-height: .64rem;
  font-size: .26rem;
  color: #333;
}
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