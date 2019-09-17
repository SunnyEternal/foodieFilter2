<template>
  <div id="addPic" class="container">
    <div class="release_box" :class="{missing: uploaded!=0}">
      <!-- <div class="clearfix"> -->
        <!-- <div class="inner clearfix"> -->
          <!-- <div class="clearfix" v-show="!showModel"> -->
            <!-- //tempFilePaths上传的本地图片数组 -->
            <div class="nullPic clearfix" @click="choose" v-if="tempFilePaths.length < maxNum">
              <img src="../static/img/icon6.png">
              <div class="imgNum">{{tempFilePaths.length+'/'+maxNum}}</div>
              <input type="file" class="file-upload" ref="fileUpload" @change="onFileChange" accept="image/*" multiple>
            </div>
            <draggable tag="div" class="list-group" v-model="tempFilePaths" v-bind="dragOptions" @start="dragStart" @end="onEnd">
              <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                <div v-for="(item,index) in tempFilePaths" :key="index" class="elem">
                  <div class="pic_box item">
                    <img :src="item.src" class="gays_pic_C" mode="widthFix" @click="previewImage(index)"/>
                    <img src="../static/img/close.png"
                      class="del_pic" @touchstart.stop="deletePic(index)">
                  </div>
                </div>
              </transition-group>
            </draggable>
            <!-- multiple -->
          <!-- </div> -->
          
          <canvas width="100%" canvas-id="myCanvas_A" class="canvas" :style="{width:cW,height:cH}"/>
        <!-- </div> -->
      <!-- </div> -->
    </div>
    
    <!-- <div class="btnBox" v-show="!showModel"> -->
      <!-- <button class="btn-upload" @click="submit"> -->
        <!-- <span class="iconAdd"></span> -->
        <!-- <span class="iconTxt">提交</span></button> -->
      <!-- <div class="tip">如果超过最多照片限制，多余照片将无法正常显示</div> -->
    <!-- </div> -->

    <!-- 进度条 -->
    <!-- <div class="progress_box" v-show="!showModel">
      <div class="progress" :style="{backgroundImage:'linear-gradient(to right,#C0C7CB 0%,#C0C7CB '+progress+',#E1E6E9 '+progress+',#E1E6E9 100%)'}"></div>
      <p v-show="tempFilePaths.length">{{uploaded}} / {{tempFilePaths.length}}</p>
    </div> -->
    
    <!-- <div class="progress_box">
      <div class="progress">
        <span ref="progItem"></span>
      </div>
    </div> -->

    <section>
      <input class="desc" placeholder="说点什么（不超过20个汉字）" 
          @blur="fnBlur" @focus="fnfocus" maxlength="20" v-model.trim="content" />

      <div class="relatedTopic">
        <p class="topic" :class="{topicActive: topicAct}">关联话题</p>
        <ul class="topicItem">
          <li @click="selectedTopicFn(index, item.topicId)" v-for="(item, index) in topic3List" :key="item.topicId" :class="{sel: currTopic === index}">{{item.topicName}}</li>
        </ul>
        <span @click="relateTopicFn" class="moreTopic">
          <img src="../static/img/arrow-r.png" alt="">
        </span>
      </div>

      <div @click="myPosiFn" class="myPosi posiActive">
        我的位置
        <img src="../static/img/arrow-r.png" alt="">
      </div>

      <div class="putInAlbum">
        <p class="put">放入相册</p>
        <div class="album_box">
          <div @click="putAlbumFn" class="addAlbum"></div>
          <div v-if="item.coverId && item.coverId != 0" @click="selectedAlbumFn(index, item.id )" :class="{selActive: currAlbum === index}" v-for="(item, index) in album6List" :key="index" class="albumEle" :style="{backgroundImage:`url(${cdnPrefix + item.coverUrl})`}" >
            <p>{{item.name}}</p>
          </div>
          <div v-if="item.coverId == 0" @click="selectedAlbumFn(index, item.id )" :class="{selActive: currAlbum === index}" v-for="(item, index) in album6List" :key="index" class="albumEle" >
            <p>{{item.name}}</p>
          </div>
          <div class="allAlb" v-if="showAllAlbFlag" @click="allAlbFn">
            <p class="all">全部相册</p>
          </div>
        </div>
      </div>
    </section>

    <div v-show="showAlt" class="alertBox">
      <div class="content">
        <div class="alertTxt">确定删除该图片?</div>
        <div class="alertBot">
          <button class="alertBtn cancel" @touchstart.stop="hideDialog">取消</button>
          <button class="alertBtn handle" @touchstart.stop="handleDel">确定</button>
        </div>
      </div>
    </div>
    <div class="preview-img" v-show="showModel">
      <swiper class="swi-img" ref="imgSwiper" :options="swiperOption">
        <!-- slides -->
        <swiper-item v-for="(img,index) in tempFilePaths" :key="index">
          <img :src="img.src" mode="widthFix" class="slide-image" @click="showModel=false">
        </swiper-item>
      </swiper>
      <div class="swiper-pagination"></div>
    </div>

    <!-- 按钮 -->
    <ImgBtn :btnAttr="btnStlyeActive" :eventName="'submit'" @submit="submit" />
    <!-- <ImgBtn :btnAttr="(userPhone&&verifyCode) ? btnStlyeActive : btnStlye" :eventName="'submit'" @submit="submit" /> -->
    <ImgBtn style="margin-top: .15rem" :btnAttr="backBtn" :eventName="'goHome'" @goHome="goListBtn" />

    <div v-show="showDialog" class="albumMask">
      <AllAlbum v-if="albumList" @selectAlbumFn="selectAlbumFn" @closeAllAlbFn="closeAllAlbFn" v-show="showAllAlbum" :cdnPrefix="cdnPrefix" :albumList="albumList" />
      <Album :isEdit="isEdit" @closeAlbFn="closeAlbFn" v-show="showAlbum" />
      <TopicList @selectTopicFn="selectTopicFn" @closeTopicFn="closeTopicFn" v-show="showTopic" :topicList="topicList" />
    </div>
    
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import loading from '@/bag/vueCommon/loading/1/loading'

import axios from 'axios'

import ImgBtn from '@/components/common/hasImgBtn.vue'

import AllAlbum from '@/components/allAlbum.vue'

import Album from '@/components/Album.vue'

import TopicList from '@/components/topicList.vue'
// import '@/assets/image-conversion'
// import common from '@/mixins/common'
// import EXIF from 'exif-js'

export default {
  name: 'addPic',
  components: {
    draggable,
    swiper,
    swiperItem: swiperSlide,
    ImgBtn,
    AllAlbum,
    Album,
    TopicList,
  },
  data () {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        }
      },
      showAlt: false,
      showModel: false,
      delNum: '',
      maxNum: 9,
      cW: '375px',
      cH: '500px',
      tempFilePaths: [],
      // list: [],
      dragOptions: {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      },
      drag: false,
      isUploading: false,

      files: [],

      progress: 1,

      uploaded: 0, // 已经上传的个数

      cdnPrefix: '',

      topicList: [], // 所有话题
      topic3List: [], // 前三个话题

      showTopic: false,
      currTopic: -1,
      topicAct: false,
      showDialog: false, // 是否显示弹窗
      showAlbum: false,
      isEdit: false, // 编辑相册
      currAlbum: -1, // 当前选中相册
      albumAct: false, // 

      showAllAlbum: false, // 显示全部相册

      allAlbumPageNum: 1,
      album6List:[],
      albumList: [], 
 
      albumId: '', // 相册id
      position: ' ', // 位置信息
      topicId: 0, // 话题topicId
      content: ' ', // 话题描述
      ajaxUpAble: false, 

      showAllAlbFlag: true, // 显示全部相册 按钮

      backBtn: {
        btnCon: { // 按钮样式
          width: '5.14rem',
          fontSize: '.34rem',
          borderColor: '#434343'
        },
        btnImg: { // 按钮内图片样式
          bgUrl: ''
        },
        val: '返回首页',
        bgUrl: '',
      },
      btnStlyeActive: {
        btnCon: {
          width: '5.14rem',
          background: '#434343',
          color: '#fff',
          fontSize: '.34rem'
        },
        btnImg: {
          bgUrl: ''
        },
        val: '完成'
      },
      btnStlye: {
        btnCon: {
          width: '5.14rem',
          color: '#fff',
          background: '#dcdcdc',
          fontSize: '.34rem'
        },
        btnImg: {
          bgUrl: ''
        },
        val: '完成'
      },
    }
  },
  beforeCreate() { 

    // 获取话题
    this.$ajax.topicList()
    .then(res => {
      if (res.code === 200) {
        this.topicList = res.result;
        this.topic3List = this.topicList.slice(0, 3)
        this.topicAct = true
        if (this.$route.query.topicId) { 
          const { topicId, topicName} = this.$route.query
          let tmp = this.topic3List.filter((item, index) => {
            if (topicId === item.topicId) {
              this.currTopic = index
              return item
            }
          })
          if (!tmp.length) { 
            this.topic3List.unshift({topicId, topicName})
            this.topic3List = this.topic3List.slice(0, 3)
            this.currTopic = 0
          }
        }
      } else if (res.code === 400) {
        this.$reminderMsg.show({text: res.message})
      }
    })
    .catch (err => {
      console.log(err);
    })

  },
  mounted () { 
    // const gbData = this.$parent
    // this.maxNum = gbData.musicList[gbData.selectMusic].num || 30
    // this.tempFilePaths = gbData.imgList
    // this.list = gbData.imgList
    // !this.tempFilePaths.length && this.choose()

    this.initAlbumFn()
    this.getPositionFn()
  },
  methods: {
    // // 创建相册
    // createAlbumFn( ) { 
      
    // },
    // 开启定位信息
    getPositionFn() { 
      // var auto = new AMap.Autocomplete({
      //   input: "tipinput"
      // });
      let that = this
      document.querySelector('.myPosi').innerText = 'get loading...'
      AMap.plugin('AMap.Geolocation', function() {
          var geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,//是否使用高精度定位，默认:true
              timeout: 10000,          //超过10秒后停止定位，默认：5s
              buttonPosition:'RB',    //定位按钮的停靠位置
              buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

          });
          // map.addControl(geolocation); // 在地图上展示
          geolocation.getCurrentPosition(function(status,result){
              if(status=='complete'){
                  console.log(result)
                  document.querySelector('.addInfo').innerText = result.formattedAddress
              }else{
                  that.onError(result)
              }
          });
      });
    },
    onError(data) {
    	let arrMsg = `定位失败：${data.message}`
        alert(arrMsg)
        console.log('失败原因排查信息', data.message)
    },
    // 获取相册列表
    initAlbumFn() {
      this.$ajax.allAlbum({pageNum: this.allAlbumPageNum, token: this.$ut.lStorageGet('token')})
      .then(res => {
        if(res.code === 200 || res.code === '200') {
          this.cdnPrefix = res.result.cdnPrefix
          this.albumList = res.result.albumViews
          if (this.albumList.length > 6) {
            // this.showAllAlbFlag = true
            this.album6List = this.albumList.slice(0, 6)
          } else {
            // this.showAllAlbFlag = false
            this.album6List = this.albumList 
          }
        }
      })
      .catch(e => {
        console.log(e);
      })
    },
    selectedTopicFn(iNum, id) {
      console.log('话题:' + id)
      if (this.currTopic === iNum) {
        this.currTopic = -1
        this.topicAct = false
      } else {
        this.currTopic = iNum // 当前选中的话题
        this.topicAct = true // 选中的话题标签
        this.topicId = id
      }
    },
    selectTopicFn(data) { // 父传的子
      this.topicAct = true
      let tmp = []
      tmp = this.topic3List.filter((item, index) => {
        if (item.topicId === data.topicId) {
          this.currTopic = index
          return item
        }
      })
      if (!tmp.length) {
        this.topic3List.unshift({topicId: data.topicId, topicName: data.topicName})
        this.topic3List = this.topic3List.slice(0, 3)
        this.currTopic = 0
      }
    },
    relateTopicFn() { // 父传的子
      this.showDialog = true
      this.showTopic = true
    },
    closeTopicFn() {
      this.showDialog = false
      this.showTopic = false
    },


    myPosiFn() {
      this.$router.push({name: 'position'})
      console.log('我的位置')
    },
    putAlbumFn() {
      this.showDialog = true
      this.showAlbum = true
      console.log('放入相册')
    },
    closeAlbFn() {
      this.showDialog = false
      this.showAlbum = false
    },
    allAlbFn() {
      this.showDialog = true
      this.showAllAlbum = true
    },
    closeAllAlbFn() {
      this.showDialog = false
      this.showAllAlbum = false
    },
    selectedAlbumFn(iNum, albumId) {
      console.log(  albumId)
      this.albumId = albumId
      if(this.currAlbum === iNum) {
        this.currAlbum = -1
        this.albumAct = false
      } else {
        this.currAlbum = iNum // 当前选中的相册
        this.albumAct = true // 选中的相册标签
        this.albumId = albumId
      }
    },
    selectAlbumFn(data) { // 父传子
    // console.log(data)
      if (this.albumList.length > 6) { 
        this.albumAct = true
        let tmp = []
        tmp = this.album6List.filter((item, index) => {
          console.log(item)
          if (item.albumId === data.albumId) {
            this.currAlbum = index
            return item
          }
        })
        console.log(tmp)
        if (!tmp.length) {
          this.album6List.unshift({albumId: data.albumId, albumName: data.albumName})
          this.album6List = this.album6List.slice(0, 6)
          this.currAlbum = 0
        }
      }
    },


    choose () {
      document.body.scrollTop = document.documentElement.scrollTop = 0
      this.fileUpload.click()
    },

    onFileChange (e) {
      const btn = this.fileUpload
      let files = btn.files
      this.files.push(...files)
      console.log(this.files)
      if (files.length) {
        const arr = Array.from(files)
        const oldLength = this.tempFilePaths.length
        const list = getArrByLength(arr, this.maxNum - oldLength)
        this.isUploading = true
        this.uploadImg(list).then(() => {
          console.log('9090')
          this.isUploading = false
        }).catch(err => {
          // this.$toast(err.msg || '上传照片失败！')
          this.isUploading = false
          console.error(err)
        })
      }
    },
    submitUser() {
      console.log('ti 交')
    },
    /**
     * [返回首页]按钮
     */
    goListBtn () {
      this.$router.push({name: 'list'})
    },
    // 放大图片
    previewImage: function (index) {
      this.imgSwiper.slideTo(index)
      this.showModel = true
    },

    // 关闭弹框
    hideDialog: function () {
      setTimeout(() => {
        this.showAlt = false
      }, 100)
    },

    // 删除图片提示框
    deletePic (index) {
      setTimeout(() => {
        this.showAlt = true
        this.delNum = index
      }, 100)
    },

    // 删除图片操作
    handleDel: function () {
      setTimeout(() => {
        let index = this.delNum
        this.tempFilePaths.splice(index, 1)
        this.files.splice(index, 1)
        this.showAlt = false
      }, 100)
    },

    dragStart (e) {
      this.drag = true
    },
    onEnd () {
      this.drag = false
    },
    fnBlur() {
      // document.querySelector('body').style.height = '100%';
      // setTimeout(() => {
      //   const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
      //     window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      // }, 100);
    },
    fnfocus(e) {
      // console.log(e.target.getBoundingClientRect().top, document.querySelector('#p2 .showBox').offsetWidth);
      // document.querySelector('body').style.height = '99999px';
      // setTimeout(() => {
      //    document.body.scrollTop = document.documentElement.scrollTop = document.querySelector('#p2 .showBox').offsetWidth / 2 + 30
      //    console.log(document.body.scrollTop)
      // }, 120)
    },
    submit () {
      let errMsg = ''
      this.$loading(1)
      const token = this.$ut.lStorageGet('token')
      let formData = new FormData()
      for (let file of this.files) {
        formData.append("file", file);
        console.log(formData)
        // let config = {
        //   headers: {
        //     token: token
        //   },
        //   processData: false,
        //   contentType: false,
        //   onUploadProgress: progressEvent => {
        //     var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
        //     this.progress = complete
        //   }
        // }
        
        // const res = await axios.post(`http://foodie-beta.kajicam.com/fs/api/pic/upload`,
        //   formData, config).then((res) => {
        //   this.uploaded++
        //   if (res.data.code === 200) {
        //     console.log('上传成功1')
        //   } else {
        //     errMsg = '上传失败'
        //   }
        // }).catch((e) => {
        //   console.log('kk<')
        // })  
      }
     
       
      this.$ajax.imageUpload({topicId: this.topicId, albumId: this.albumId, desc: encodeURI(this.content), position: encodeURI(this.position), token: token, formData: formData})
      // this.$ajax.imageUpload({topicId: 0, desc:'', token: token, formData: formData})
      .then(res => {
        this.$loading(0)
        if(res && res.code == 200) {
          this.logined = true
          this.ajaxUpAble = true
          this.$router.push({name: 'work'})
        } else if(res && res.code == 10005) {
          this.$reminderMsg.show({text: res.message})
          setTimeout(() => {
            this.$router.push({name: 'login'})
          })
          _hmt.push(['_trackEvent', 'filterAc_failUpload', 'click', '上传作品失败'])
        } 
        else if (res && res.code == 10003) { // 被拉入黑名单了
          this.$reminderMsg.show({text: res.message || '上传失败，请重新上传'})
          _hmt.push(['_trackEvent', 'filterAc_failUpload', 'click', '上传作品失败'])
        } 
        else {
          this.$reminderMsg.show({text: res.message || '上传失败，请重新上传'})
          _hmt.push(['_trackEvent', 'filterAc_failUpload', 'click', '上传作品失败'])
          // setTimeout (() => {
          //   this.$router.go(0)
          // }, 1500)
        }
      }).catch(e => {
        _hmt.push(['_trackEvent', 'filterAc_failUpload', 'click', '上传作品失败'])
        console.log(e);
        this.$loading(0)
        this.ajaxUpAble = true
        if (e == 'timeout') {
          this.$reminderMsg.show({text: '上传超时，请检查网络'})
        }
      })
      this.$loading(0) 
      // this.$router.push({name: 'list'})
      
    },
    async uploadImg (arr) {
  this.$loading(1)

      for (let file of arr) {
        let src = await loadFile(file)
        const arrayBuffer = _base64ToArrayBuffer(src)
        const { Orientation: orientation } = EXIF.readFromBinaryFile(arrayBuffer)
        const blob = await draw(orientation, file)

        // const formData = new FormData()
        // const token = this.$ut.lStorageGet('token')
        // formData.append("file", file);
        
        
        // this.$ajax.imageUpload({topicId: this.topicId, desc: encodeURI(this.content), token: '201966807797975259', file: file})
        // .then(res => {
        //   console.log(res)
        // }).catch(e => {
        //   console.log(e)
        // })
// http://foodie-beta.kajicam.com/fs/api/pic/upload?topicId=&picDescription=
        // const order = this.$parent.maxId + 1
        // this.$parent.maxId = order
        src = createObjectURL(blob)
        // const img = { src, order, path: res.data.result.path }
        const img = { src }
        this.tempFilePaths.push(img)
        console.log(this.tempFilePaths)
      }
this.$loading(0)

    }
  },
  computed: {
    fileUpload () {
      return this.$refs.fileUpload
    },
    imgSwiper () {
      return this.$refs.imgSwiper.swiper
    },
    list: {
      get () {
        return this.tempFilePaths
      }
    }
  },
  watch: {
    isUploading (val, oldVal) {
      if (val) {
        this.$loading('图片上传中')
      } else {
        // this.$loading.hide()
      }
    }
  }
}

function getArrByLength (arr, length) {
  if (arr.length > length) {
    return arr.slice(0, length)
  }
  return arr
}

function loadFile (file) {
  const oReader = new FileReader()
  oReader.readAsDataURL(file)
  return new Promise((resolve, reject) => {
    oReader.onload = (e) => {
      resolve(e.target.result)
    }
    oReader.onerror = (err) => {
      reject(new Error('Could not load image at ' + file.name), err)
    }
  })
}
function loadImg (src) {
  const img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')
  img.src = src
  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve(img)
    }
    img.onerror = (err) => {
      reject(new Error('Could not load image at ' + url), err)
    }
  })
}

// 获取数据的URL地址
function createObjectURL (blob) {
  if (window.URL) {
    return window.URL.createObjectURL(blob)
  } else if (window.webkitURL) {
    return window.webkitURL.createObjectURL(blob)
  } else {
    return null
  }
}

// 图片压缩处理
async function gzipImage (file, url) {
  const img = await loadImg(url)
  const rate = 750
  const width = img.width > rate ? rate : img.width
  const scale = img.width > rate ? rate / img.width : 1
  const height = img.height * scale
  // object
  return await window.imageConversion.compress(file, {
    quality: 0.8,
    type: file.type,
    width,
    height
    // scale
  })
}

/* 获取拍照时照片的方向，可根据方向对图片展示时进行相应旋转操作，保证图片0度显示
  返回值----------------    1    0°
                           6    顺时针90°
                           8    逆时针90°
                           3    180°
*/
function _getFileOrientation (arrayBuffer) {
  var view = new DataView(arrayBuffer)
  if (view.getUint16(0, false) != 0xFFD8) return -2
  var length = view.byteLength
  var offset = 2
  while (offset < length) {
    var marker = view.getUint16(offset, false)
    offset += 2
    if (marker == 0xFFE1) {
      if (view.getUint32(offset += 2, false) != 0x45786966) return -1
      var little = view.getUint16(offset += 6, false) == 0x4949
      offset += view.getUint32(offset + 4, little)
      var tags = view.getUint16(offset, little)
      offset += 2
      for (var i = 0; i < tags; i++) {
        if (view.getUint16(offset + (i * 12), little) == 0x0112) {
          return view.getUint16(offset + (i * 12) + 8, little)
        }
      }
    } else if ((marker & 0xFF00) != 0xFF00) break
    else offset += view.getUint16(offset, false)
  }
  return -1
}

function _base64ToArrayBuffer (base64) {
  base64 = base64.replace(/^data:([^;]+);base64,/gmi, '')
  var binaryString = atob(base64)
  var len = binaryString.length
  var bytes = new Uint8Array(len)
  for (var i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

function getOrientation (img) {
  return new Promise((res, rej) => {
    let Orientation = null
    EXIF.getData(img, function () {
      EXIF.getAllTags(this)
      Orientation = EXIF.getTag(this, 'Orientation')
      res(Orientation)
    })
  })
}

function draw (orientation, file) {
  const src = createObjectURL(file)
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('canvas')
    loadImg(src).then((img) => {
      const rate = 750
      let width = img.naturalWidth > rate ? rate : img.naturalWidth
      const scale = img.naturalWidth > rate ? rate / img.naturalWidth : 1
      let height = img.naturalHeight * scale
      // if(width > this.limitLength && width >= height) {
      //   height = height * this.limitLength / width;
      //   width = this.limitLength;
      // }
      // if(height > this.limitLength && height >= width) {
      //   width = width * this.limitLength / height;
      //   height = this.limitLength;
      // }
      let degree = 90 * Math.PI / 180
      let ctx = canvas.getContext('2d')
      if (orientation) {
        switch (orientation) {
          case 1:// 不旋转
            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0, width, height)
            break
          case 6:// 需要顺时针（向左）90度旋转
            canvas.width = height
            canvas.height = width
            ctx.rotate(degree)
            ctx.drawImage(img, 0, -height, width, height)
            break
          case 8:// 需要逆时针（向右）90度旋转
            canvas.width = height
            canvas.height = width
            ctx.rotate(degree * 3)
            ctx.drawImage(img, -height, 0, height, width)
            break
          case 3:// 需要180度旋转
            canvas.width = width
            canvas.height = height
            ctx.rotate(degree * 2)
            ctx.drawImage(img, -width, -height, width, height)
            break
          default:
            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0, width, height)
            break
        }
      } else {
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
      }
      canvas.toBlob((blob) => {
        resolve(blob) // resolve出去确保画图完成
      }, 'image/jpeg')
    })
  })
}

</script>

<style lang="scss" scoped>
  // @import "../assets/variable";
  .container{
    width: 100%;
    height: 100%;
  }
  .clearfix:after{
    content: '';
    width:0;
    height:0;
    display: block;
    clear: both;
  }
  .release_box{
    width: auto;
    max-height: 85vh;
    // height: 3rem;
    overflow-x: scroll;
    padding: .12rem .24rem;
    box-sizing: border-box;
    white-space: nowrap;
    //x,xs
    // @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    //   max-height: calc(100vh - 3.80rem);
    // }
    // // xr
    // @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
    //   max-height: calc(100vh - 3.80rem);
    // }

    // // xs max
    // @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
    //   max-height: calc(100vh - 3.80rem);
    // }
    // transition:height 2s;
  }
  section{
    padding: 0 .24rem 0 .26rem;
    box-sizing: border-box;
  }
  .desc{
    outline: none;
    border: none;
    width: 100%;
    // height: ;
    color: #010101;
    padding: .22rem 0 .26rem;
    box-sizing: border-box;
    text-indent: .06rem;
    border-bottom: 1px solid #e5e5e5;
  }
  
  .relatedTopic{
    padding-top: .32rem;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;
    position: relative;
  }
  .relatedTopic .topic{
    height: .42rem;
    line-height: .42rem;
    padding-left: .56rem;
    margin-bottom: .38rem;
    background-image: url('../static/img/topic.png');
    background-position: .06rem center;
    background-repeat: no-repeat;
    background-size: .42rem .42rem;
  }
  .topic.topicActive{
    color: #59a3ff;
    background-image: url('../static/img/topic-active.png');
  }
  .relatedTopic .topicItem{
    display: flex;
    justify-content: flex-start;
    padding: 0 0 .32rem .08rem;
    box-sizing: border-box;
    // background-image: url('../static/img/arrow-r.png');
    // background-position: 6.78rem .17rem;
    // background-repeat: no-repeat;
    // background-size: .15rem .27rem;
  }
  .relatedTopic .topicItem li{
    padding: 0 .26rem;
    box-sizing: border-box;
    height: .58rem; 
    line-height: .6rem;
    border-radius: .28rem;
    border: 1px solid #909090;
    font-size: .26rem;
    color: #989898;
    margin-right: .15rem;
  }
  .relatedTopic .moreTopic{
    position: absolute;
    width: .4rem;
    height: .4rem;
    bottom: .34rem;
    right: 0;
    img{
      width: .15rem;
      height: .27rem;
      margin-left: .16rem;
    }
  }

  .myPosi{
    padding: .32rem 0 .28rem .56rem;
    box-sizing: border-box;
    background-image: url('../static/img/posi.png');
    background-position: .08rem center;
    background-repeat: no-repeat;
    background-size: .34rem .44rem;
    border-bottom: 1px solid #e5e5e5;
  }
  .myPosi.posiActive{
    color: #59a3ff;
    background-image: url('../static/img/posi-active.png');
  }
  .myPosi img{
    width: .15rem;
    height: .27rem;
    float: right;
    top: -.02rem;
    margin-right: .1rem;
  }

  .putInAlbum{
    padding-top: .32rem;
    box-sizing: border-box;
  }
  .putInAlbum .put{
    height: .35rem;
    line-height: .35rem;
    padding-left: .56rem;
    margin-bottom: .34rem;
    background-image: url('../static/img/icon5.png');
    background-position: .08rem center;
    background-repeat: no-repeat;
    background-size: .35rem .35rem;
  }

  .album_box{
    margin-bottom: .64rem;
    white-space: nowrap;
    overflow-x: scroll;
    font-size: 0;
    height: 1.74rem;
  }
  .album_box div{
    width: 2.52rem;
    border-radius: .1rem;
    overflow: hidden;
    margin-right: .25rem;
    display: inline-block;
  }
  .addAlbum{
    height: 1.68rem;
    border: 1px solid #e4e4e4;
    background-image: url('../static/img/icon6.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: .42rem .42rem;
    vertical-align: top;
  }
  .albumEle{
    height: 1.7rem;
    background-image: url('../static/img/2.jpg');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    vertical-align: top;
  }
  .albumEle p{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: .84rem;
    text-align: center;
    background: linear-gradient(rgba(0, 0, 0, 0.00001), rgba(0, 0, 0, 0.8));
    font-size: .3rem;
    font-weight: bold;
    color: #fff;
    padding-top: .38rem;
    box-sizing: border-box;
  }
  .selActive{
    height: 1.68rem;
    border: .06rem solid #ffe954;
    border-radius: .1rem;
    overflow: hidden;
    box-sizing: border-box;
  }
  .allAlb{
    height: 1.68rem;
    border: 1px solid #e4e4e4;
    vertical-align: top;
  }
  .allAlb .all{
    height: .3rem;
    font-size: .3rem;
    color: #020202;
    margin-top: .7rem;
    background-image: url('../static/img/arrow-r.png');
    background-position: 1.86rem center;
    background-repeat: no-repeat;
    background-size: .15rem .27rem;
    padding-left: .54rem;
  }

  .missing{
    // height: 0;
    // transition: height 2s;
  }
  .nullPic{
    width: 1.8rem;
    height: 1.8rem;
    border-radius: .1rem;
    text-align: center;
    float: left;
    margin: .07rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #ddd;
  }

  .nullPic img{
    width: .42rem;
    height: .42rem;
    margin-top: .50rem;
  }
  .nullPic .imgNum{
    width: 2.20rem;
    height: .60rem;
    text-align: center;
    font-size: .28rem;
    margin-top: .30rem;
    color: #c3c3c3;
  }

  .pic_box{
    width: 1.8rem;
    height: 1.8rem;
    // border-radius: .1rem;
    // float: left;
    border: .08rem solid transparent;
    overflow: hidden;
    position: relative;
  }

  .gays_pic_C{
    width: 100%;
    /*width: 220px;*/
    /*height: 220px;*/
  }

  .pic_box:nth-child(3n+1){
    margin: 0
  }
  .pic_box:nth-child(1){
    margin: 0
  }
  .pic_box:nth-child(4){
    margin: 0
  }
  .pic_box:nth-child(7){
    margin: 0
  }

  .del_pic{
    width: .40rem;
    height: .40rem;
    position: absolute;
    right: 0;
    top: .05rem;
    padding: .10rem;
    z-index: 9;
  }

  .outer{
    width: 100%;
    max-height: 8rem
  }
  .inner{
    width: 100%;
    height: 100%;
    // padding-bottom: 1.80rem;
  }
  movable-area{
    width: 100%;
    height: 100%;
  }
  .elem{
    display: inline-block;
  }
  .item{
    float: left;
    width: 1.8rem;
    height: 1.8rem;
    border-radius: .2rem;
    // margin-right: .15rem;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 上传按钮 */
  .btnBox{
    width: 100%;
    height: 1.20rem;
    position: fixed;
    left: 0;
    bottom: .35rem;
    z-index: 999;
  }
  .btn-upload{
    width: 3.90rem;
    color: #fff;
    background: #1d1e20;
    border-radius: .04rem;
    border: 1px solid !important;
    text-align: center;
    margin: 0 auto;
    border: 1Px solid #fff;
    height: .80rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .iconAdd{
    width: .29rem;
    height: .2rem;
    background: url('https://wechat-mini-program-prod.oss-cn-beijing.aliyuncs.com/wxappvideo/img/btn_sub.png') no-repeat center;
    background-size: 100%;
    margin: 0 .1rem;
  }
  .iconTxt{
    font-size: 11pt;
    height: .8rem;
    line-height: .8rem;
  }
  .canvas{
    position: fixed;
    left: 100rem;
    top: 0;
    z-index: 444;
    border: 1px blue solid;
    box-sizing:border-box
  }
  .file-upload{
    display: none;
  }
  .list-group{
    padding: 0;
  }
  .preview-img {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    // height: $fullscreenHeight;
    height: 100%;
    z-index: 10;
  }
  .slide-image{
    width: 100%;
  }

  // 进度条
  .progress_box{
    width: 100%;
    height: .74rem;
    padding: .32rem .29rem;
    
    box-sizing: border-box;

  }
  .progress{
    // display: block;
    height: .10rem;
    background: green;
    position: relative;
    border-radius: .04rem;
    // span{
    //   position: absolute;
    //   top: 50%;
    //   left: 0;
    //   transform: translateY(-50%);
    //   border-radius: .04rem;
    //   background: red;
    //   height: .1rem;
    //   width: .9rem;
    // }
    
  }

  .alertBox{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: #00000069;
    z-index: 1000;
    display: flex;
    justify-content:center;
    align-items: center;
  }
  .alertBox .content{
    width: 4.5rem;
    height: 3.5rem;
    background: #ffffff;
    border-radius: .20rem;
    display: flex;
    flex-direction: column;
    justify-content:space-around;
    padding: .20rem 0;
    box-sizing: border-box;
  }
  .alertTxt{
    margin-top: .60rem;
    font-size: 13pt;
    text-align: center;
    line-height: .60rem;
  }
  .alertBot{
    height: .90rem;
    display: flex;
    justify-content: space-around;
  }
  .alertBtn{
    width: 1.65rem;
    height: .80rem;
    line-height: .80rem;
    border-radius: .10rem;
    outline: none;
    font-size: 13pt;
    box-sizing: border-box;
  }
  .cancel{
    background: #ffffff;
    border: 1px solid #000000;
  }
  .handle{
    color: #ffffff;
    background: #404040;
  }
  .swiper-slide{
    display: flex;
    justify-content: center;
    align-items: center;
    // height: $fullscreenHeight;
    height: calc(100vh - .0001rem);
    background: #000;
  }
  .swiper-pagination{
    color: #fff;
    bottom: 92vh;
  }
  .tip{
    margin-top: 20px;
    text-align: center;
  }

  // 黑色遮罩 用于 几个组件
  .albumMask{
    position: fixed;
    top: 0; 
    left: 0;
    z-index: 9;
    width: 100%;
    height: 100%;
    background: #000;
    color: #fff;
  }

  .relatedTopic .topicItem li.sel{
    border: 1px solid #59a3ff;
    color: #59a3ff;
  }
</style>
