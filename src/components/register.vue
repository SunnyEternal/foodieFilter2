<template>
  <div id="p2">
    <!-- 1. 关联话题弹窗 -->
    <transition>
      <section v-show="isShow" class="topicGroup">
        <div class="main">
          <h3>关联话题<img class="closeTopic" src="../static/img/closeTopic.png" @click="isShow = false"></h3>
          <ul>
            <li v-for="(item, index) in topicList" :key="index" @click="selectTopic(item)">{{item.topicName}}</li>
          </ul>
        </div>
      </section>
    </transition>
    
    <!-- 2. 上传作品显示区域及重新上传 -->
    <div class="showBox">
      <img src="../static/img/uploadBg.png" class="placeh" :style="{visibility:visib}" @click="pickImg">
      <img src="../static/img/blank.jpg" id="pickImg" @click="pickImg" class="pickImg">
      <img src="../static/img/reupload.png" v-show="picked" @click="pickImg" class="plus">
      <p @click="pickImg" v-show="picked" class="reChoose">重新上传</p>
    </div>

    <!-- 3. 输入作品描述和关联话题 -->
    <div v-if="!logined">
      <div class="inp">
        <input type="text" @input="handleContent" class="content" placeholder="说点什么（不超过20个汉字）" 
          @blur="fnBlur" @focus="fnfocus" maxlength="20" v-model.trim="content" />
      </div>
      <div class="inp" style="position: relative;">
        <p class="relevant" :class="{selected: topicName !== '关联话题'}" @click="showTopicList">{{topicName}}</p>
        <img class="arrow" src="../static/img/arrow-r.png">
      </div>
    </div>
    
    <div class="_btn">
      <ImgBtn :btnAttr="picked ? btnStlyeActive : btnStlye" :eventName="'submitImg'" class="submitBtn" @submitImg="registerFn" />
      <ImgBtn style="margin-top: .2rem" :btnAttr='backBtn' :eventName="'goHome'" @goHome="goListBtn"></ImgBtn>
    </div>

  </div>
</template>

<script>
import Handlers from '@/static/js/handlers'
import Button from '@/components/common/button.vue'
import ImgBtn from '@/components/common/hasImgBtn.vue'
import loading from '@/bag/vueCommon/loading/1/loading'


export default {
  components: {
    Button,
    ImgBtn
  },
  data() {
    return {
      userInfo: {},
      userName: '',
      userPhone: '',
      reminderMsg: '',
      reminderState: true,
      visib: 'visible',
      picked: false,
      logined: false,
      btnStlye: {
        btnCon: { // 按钮样式
          width: '5.14rem',
          fontSize: '.34rem',
          background: '#dcdcdc',
          borderColor: '#dcdcdc',
          color: '#fff'
        },
        btnImg: { // 按钮内图片样式
          bgUrl: ''
        },
        val: '完成',
        bgUrl: '',
      },
      btnStlyeActive: {
        btnCon: { // 按钮样式
          width: '5.14rem',
          fontSize: '.34rem',
          background: '#434343',
          color: '#fff'
        },
        btnImg: { // 按钮内图片样式
          bgUrl: ''
        },
        val: '完成',
        bgUrl: '',
      },
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
      text:'',
      ajaxUpAble: true,
      show:false,

      content: '', // 话题描述
      topicId: '', // 话题id

      topicName: '关联话题', // 话题名字
      isShow: false, // 是否显示话题，默认不显示
      topicList: [],
      curr: 0,
    }
  },
  beforeCreate () {
    this.$ajax.topicList()
    .then(res => {
      if (res.code === 200) {
        this.topicList.push(...res.result)
      } else if (res.code === 400) {
        this.$reminderMsg.show({text: res.message})
      }
    })
    .catch (err => {
      console.log(err);
    })
  },
  mounted() {
    localStorage.removeItem('page')
  },
  methods: {
    // 返回首页
    goListBtn () {
      this.$router.push({name: 'list'})
    },
    showTopicList () {
      this.isShow = true;
      if (this.isShow) {
        $('body').css({'overflow': 'hidden'})
      } else {
        $('body').css({'overflow': 'visible'})
      }
    },
    selectTopic (item) {
      this.topicName = item.topicName;
      this.topicId = item.topicId;
      this.isShow = false;
    },
    handleContent () {

    },
    fnBlur() {
      document.querySelector('body').style.height = '100%';
      setTimeout(() => {
        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
          window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
    },
    fnfocus(e) {
      console.log(e.target.getBoundingClientRect().top, document.querySelector('#p2 .showBox').offsetWidth);
      document.querySelector('body').style.height = '99999px';
      setTimeout(() => {
         document.body.scrollTop = document.documentElement.scrollTop = document.querySelector('#p2 .showBox').offsetWidth / 2 + 30
         console.log(document.body.scrollTop)
      }, 120)
    },
    ajaxUp() {
      this.$loading(1)
        // loading(1)
      this.ajaxUpAble = false
      _hmt.push(['_trackEvent', 'filterAc_uploadPic', 'click', '点击上传作品'])

      let that = this
      let token = this.$ut.lStorageGet('token')
      let file = $('#inputFile')[0].files[0]

      if (file.size > 10240000) {
        this.$loading(0)
        return this.$reminderMsg.show({text: '上传图片大小不能超过10M'})
      }
     
      // this.$ajax.imageUpload({topicId: this.topicId, desc: this.content, token: token, imageBase64: $('#bridgeImg')[0].src})
      this.$ajax.imageUpload({topicId: this.topicId, desc: encodeURI(this.content), token: token, file: file})
      .then(res => {
        that.$loading(0)
        if(res && res.code == 200) {
          that.logined = true
          that.ajaxUpAble = true
          that.$router.push({name: 'work'})
        } else if(res && res.code == 10005) {
          that.$reminderMsg.show({text: res.message})
          setTimeout(() => {
            that.$router.push({name: 'login'})
          })
          _hmt.push(['_trackEvent', 'filterAc_failUpload', 'click', '上传作品失败'])
        } 
        else if (res && res.code == 10003) { // 被拉入黑名单了
          that.$reminderMsg.show({text: res.message || '上传失败，请重新上传'})
          _hmt.push(['_trackEvent', 'filterAc_failUpload', 'click', '上传作品失败'])
        } 
        else {
          that.$reminderMsg.show({text: res.message || '上传失败，请重新上传'})
          _hmt.push(['_trackEvent', 'filterAc_failUpload', 'click', '上传作品失败'])
          setTimeout (() => {
            this.$router.go(0)
          }, 1500)
        }
      }).catch(e => {
        _hmt.push(['_trackEvent', 'filterAc_failUpload', 'click', '上传作品失败'])
        console.log(e);
        that.$loading(0)
        that.ajaxUpAble = true
        if (e == 'timeout') {
          this.$reminderMsg.show({text: '上传超时，请检查网络'})
        }
      })
    },
    registerFn() {
      // console.log(encodeURI(this.content))
      // this.content = encodeURI(this.content)
      let that = this
      if (!this.picked) {
        return this.$reminderMsg.show({text: '请选择照片'})
      }

      try {
        if (this.userInfo) {
          that.ajaxUpAble && this.ajaxUp()
        } else {
          
        }
      } catch (e) {
        that.$loading(0)
        if((e + '').toLowerCase().includes('urierror')) {
          return this.$reminderMsg.show({text: '用户名格式不支持'});
        }
        let errMsg =  (e + '').substr(7)
          this.$reminderMsg.show({text: errMsg});
      }
    },
    checkFoodieMark(img) {
      return new Promise((resolve, reject) => {
        EXIF.getData(img, _ => {
            var allMetaData = EXIF.getAllTags(img);
            // console.log(allMetaData, allMetaData == true)
            console.log(allMetaData)
            // console.log(EXIF.getTag(img, 'ImageUniqueID'))
            resolve(allMetaData)
        })
      })
    },
    pickImg() {
      let that = this
      try {
        Handlers.pickImg(async (img) => {
          that.$loading(1)
          await that.checkFoodieMark(img)
          .then(res => {
            if(res.hasOwnProperty('Model') && res.Model.toLowerCase().includes('foodie')){
              $('#bridgeImg')[0].src = img.src
              Handlers.renderFileChangedImg(img, $('#bridgeImg')[0])
              .then(() => {
                that.$loading(0)
                let img = new Image()
                img.src = $('#bridgeImg')[0].src
                img.onload = function() {
                  that.visib = 'hidden'
                  that.picked = true
                  if (this.width >= this.height) {
                    $('#pickImg').css({width: '100%', height: 'auto'})
                  } else {
                    $('#pickImg').css({height: '100%', width: 'auto'})
                  }
                }
                $('#pickImg')[0].src = $('#bridgeImg')[0].src
              }).catch(err => {
                that.$loading(0)
                console.log('err', err);
              })

            } else {
              that.$reminderMsg.show({text: '该照片非foodie拍摄<br />请使用foodie拍摄或编辑后的照片'})
              this.$loading(0)
            }
          }).catch(e => {
            console.log(e);
          })
        }, that)
      } catch (e) {
        console.log(e);
      }
    }
  },
  watch: {
    isShow: {
      handler: function (val, oldval) {
        if (val) {
          // 可在此设置弹出层后不滚动 给body、html添加overflow: hidden;
          $('body').css('overflow', 'hidden')
        } else {
          $('body').css('overflow', 'visible')
        }
      },
      immediate: true // 立刻监听
    },
  }
}
</script>

<style lang='scss'>
#p2{
  height:100%;min-height:14.25rem;
  overflow: hidden;
  position: relative;
  text-align: center;
  .placeh{
    width: 6.5rem;height:6.5rem;position:relative;z-index:3; 
  }
  .showBox{
    margin:.08rem auto .34rem;width:6.5rem; height: 6.5rem; position: relative;
    border: 1px solid #e5e5e5; border-radius: .2rem; overflow: hidden;
  }
  .plus{
    position: absolute;
    bottom: .84rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    width: .7rem;
  }
  .pickImg{
    position: absolute;left:50%;top:50%;transform: translate(-50%, -50%);z-index:1;
  }
  .reChoose{
    position: absolute; left: 50%; bottom: .4rem; transform: translate(-50%); z-index: 3; color: #fff; font-size: .32rem; text-shadow: .02rem .02rem .02rem rgba(0, 0, 0, 0.4);

  }
  .tip{
    font-size: .24rem;color:#60594e;text-align: center;margin:.4rem 0 .3rem;
  }
  
  .inp{
    font-size: .3rem;
    margin: 0 .22rem 0 .27rem;
    border-bottom: 1px #e5e5e5 solid;
    padding: 0 0 1px 0;

    input{
      outline: none; resize: none; -webkit-appearance: none; border:none; border-radius: none;
      width: 7rem; box-sizing: border-box;
      height: 1.02rem; line-height: .32rem;
      padding: .36rem 0 .12rem .08rem; box-sizing: border-box;
    }
    // ::-webkit-input-placeholder{color:#9ebaa9;}
    .arrow{position: absolute; right: .4rem; top: .4rem; width: .15rem}
  }
  
  ._btn{
    margin-top: .35rem;text-align: center;
  }
  .loginedInfo{
    h5{
      width:1.24rem;line-height: .42rem;background-color: #98cef2;font-size: .26rem;color:#fff;
      margin:0 auto .2rem;text-align: center;
    }
    p{
      text-align: center;color:#5f6c56;font-size: .28rem;line-height: 1.8;
    }
  }
}

.topicGroup{
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0, 0.6);
  z-index: 10;
  color: #000;
  .main{
    text-align: left;
    width: 6.46rem;
    height: 10.6rem;
    border-radius: .16rem;
    background: #fff;
    margin: 0.54rem auto;
    padding: .52rem .44rem .64rem;
    box-sizing: border-box;
    h3{
      font-size: .4rem; 
      text-align: center; 
      position: relative;
      margin-bottom: .22rem;
      .closeTopic{
        width: .32rem;
        position: absolute;
        top: .04rem;
        right: 0;
      }
    }
    ul{
      height: 8.6rem;
      overflow-y: auto;
      li{
        height: .86rem;
        line-height: .86rem;
        border-bottom: 1px solid #e5e5e5;
        font-size: .32rem;
      }
    }
  }
  .closeTopic{
    width: .32rem;
  }
  
}
.relevant{
  display: inline-block;
  width: 7rem;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 1.02rem;
  line-height: .32rem;
  padding: .5rem 0 .12rem .08rem;
  box-sizing: border-box;
  text-align: left;
}
.selected{
  color: #333;
}
</style>
