<template>
  <div id="user">
    <h3 class="head">个人信息</h3>
    <div class="wrap">
      <div class="portrait" v-if="logined">
        <img src="@/static/img/portrait.png">
      </div>
      <div v-else class="pickPortrait">
        <img src="../static/img/blank.jpg" id="pickImg" @click="pickImg" class="pickImg" alt="">
        <p class="title" @click="pickImg">上传头像</p>
      </div>
    </div>

    <div class="loginInfo">
      <input type="text" maxlength="8" placeholder="昵称（不超过8个汉字）" v-model="userName">
    </div>
    
    <ImgBtn :btnAttr="(userName) ? btnStlyeActive : btnStlye" :eventName="'sHideActRules'" class="submitBtn" @sHideActRules="submitUserInfo" />
    <ImgBtn style="margin-top: .15rem" :btnAttr="backBtn" :eventName="'goHome'" @goHome="goListBtn" />

    <!-- 手机号和昵称一旦填写本次活动期间将不能修改 -->
    <transition name="confSubmit">
      <ConfSubmit :txtVal="'手机号和昵称一旦填写<br/>本次活动期间将不能修改'" v-show="showInfo" @confirmHand="confirmSubFn"></ConfSubmit>
    </transition>

  </div>
</template>

<script>
import Handlers from '@/static/js/handlers'
import Button from '@/components/common/button.vue'
import ImgBtn from '@/components/common/hasImgBtn.vue'
import ConfSubmit from '@/components/common/confirmDialog.vue'

export default {
  components: {
    Button,
    ImgBtn,
    ConfSubmit
  },
  data() {
    return {
      userInfo: {},
      userName: '', //Amy
      userPhone: '',
      verifyCode: '', 
      restTime: 8, // 发送验证码后，开始倒计时，一共一分钟
      content: '发送验证码',
      isSend: false,

      showInfo: false,

      reminderMsg: '',
      reminderState: true,
      visib: 'visible',
      picked: false,
      logined: false,
      
      btnStlye: {
        btnCon: { // 按钮样式
          width: '5.14rem',
          fontSize: '.34rem',
          borderColor: '#dcdcdc',
          background: '#dcdcdc',
          color:'#fff',
        },
        btnImg: { // 按钮内图片样式
          bgUrl: ''
        },
        val: '提交',
        bgUrl: '',
      },
      btnStlyeActive: {
        btnCon: { // 按钮样式
          width: '5.14rem',
          fontSize: '.34rem',
          borderColor: '#434343',
          background: '#434343',
          color:'#fff',
        },
        btnImg: { // 按钮内图片样式
          bgUrl: ''
        },
        val: '提交',
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
        showImg: false,
        val: '返回首页',
        bgUrl: '',
      },
      text:'',
      ajaxUpAble: true,
      show:false
    }
  },
  created () {
    this.userPhone = this.$ut.lStorageGet('userPhone')
  },
  mounted () {
  },
  methods: {
    /**
     * [返回首页]按钮
     */
    goListBtn () {
      this.$router.push({name: 'list'})
    },
    // 注册用心信息（头像、昵称）
    registerFn () {
      let token = this.$ut.lStorageGet('token')
      this.$ajax.registerUser ({userName: this.userName, imageBase64: $('#bridgeImg')[0].src, token: token})
      .then(res => {
        this.$ut.lStoragePut('userInfo', JSON.stringify({userName: this.userName, headImg: $('#bridgeImg')[0].src}))
        let pageName = this.$ut.lStorageGet('page') || 'work'
        if (res.code === 200 || res.code === '200') {
          _hmt.push(['_trackEvent', 'filterAc_userInfo', 'click', '用户头像昵称设置成功'])
          this.$router.push({name: pageName})
        } else if (res.code === 400 || res.code === '400') {
          _hmt.push(['_trackEvent', 'filterAc_userInfo', 'click', '用户头像昵称设置失败'])
          this.$router.push({name: pageName})
        } else {
          _hmt.push(['_trackEvent', 'filterAc_userInfo', 'click', '用户头像昵称设置失败'])
          this.$reminderMsg.show({text: res.message})
        }
        
      }).catch(e => {
        _hmt.push(['_trackEvent', 'filterAc_userInfo', 'click', '用户头像昵称设置失败'])
        console.log(e);
      })
    },
    submitUserInfo() {
      if (!this.picked) {
        return this.$reminderMsg.show({text: '请选择照片'})
      }
      if (!this.userName) {
        return this.$reminderMsg.show({text: '请输入昵称'})
      }
      this.showInfo = true
      
    },
    // 本次活动手机号和活动昵称都不能修改
    confirmSubFn (data) {
      this.showInfo = false

      // 如果点取消按钮，不提交数据
      if (!data) return

      let that = this
      try {
        if (this.userPhone && this.userName) {
          $('.submitBtn').attr('disabled')
          
          // that.ajaxUpAble && this.ajaxUp()
          that.registerFn()
        } else {
          this.$reminderMsg.show({text: '您还未注册，请先注册'})
          setTimeout(() => {
            this.$router.push({name: 'login'})
          }, 1500)
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
    ajaxUp() {
      this.$loading(1)
      this.ajaxUpAble = false
      let that = this
      this.$ajax.imageUpload({userName: this.userName, imageBase64: $('#bridgeImg')[0].src})
      .then(res => {
        that.$loading(0)
        if(res && res.code == 200) {
          that.logined = true
          that.ajaxUpAble = true
        } else if(res && res.errMsg) {
          that.$reminderMsg.show({text: res.errMsg})
        }
      })
    },
    pickImg() {
      let that = this
      try {
        Handlers.pickImg( (img) => {
          that.$loading(1)
              
          $('#bridgeImg')[0].src = img.src
          Handlers.renderFileChangedImg(img, $('#bridgeImg')[0])
          .then(() => {
            that.$loading(0)
            let img = new Image()
            img.src = $('#bridgeImg')[0].src
            img.onload = function() {
              that.visib = 'hidden'
              that.picked = true
              console.log(this.width, this.height);
              if (this.width >= this.height) {
                // $('#pickImg').css({width: '100%', height: 'auto'})
                $('#pickImg').css({height: '100%', width: 'auto'})
              } else {
                $('#pickImg').css({width: '100%', height: 'auto'})
              }
            }
            $('#pickImg')[0].src = $('#bridgeImg')[0].src
            this.$ut.lStoragePut('usrImg', $('#pickImg')[0].src)
              
          }).catch(e => {
            console.log(e);
          })
        }, that)

      } catch (e) {
        console.log(e);
      }
    }
  }
}
</script>

<style lang='scss' scoped>
#user{
  text-align: center;
  padding: 0 .76rem;
  box-sizing: border-box;
  .head{
    margin: 0.6rem 0 .46rem;
    font-size: .5rem;
    text-align: center;
    color: #333;
  }
  .wrap{
    margin-bottom: .28rem;
    .portrait{
      display: inline-block;
      overflow: hidden;
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 50%;
      img{
        display: inline-block;
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 50%;
      }
    }
    .pickPortrait{
      display: block;
      margin: 0 auto;
      overflow: hidden;
      width: 1.62rem;
      height: 1.62rem;
      border-radius: 50%;
      background: #fffac7;
      border: 1px solid #ffe21d;
      position: relative;
      overflow: hidden;
      .title{
        display: inline-block;
        line-height: 1.6rem;
        color: #7f7f7f;
        font-size: .24rem;
        margin-left: -.08rem;
      }
      .pickImg{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .loginInfo{
    margin-bottom: 1.92rem;
    border-bottom: 1px #e5e5e5 solid;
    input{
      -webkit-appearance: none;
      border: none;
      width: 6.04rem;
      font-size: .38rem;
      line-height: .38rem;
      box-sizing: border-box;
      padding: .2rem 0;
    }
  }
  .active{
    background: #000;
  }
}
.confSubmit-enter{opacity: 0;}
.confSubmit-enter-active{transition: .3s linear;}
.confSubmit-leave-active{opacity: 0; transition: .3s linear;}
</style>
