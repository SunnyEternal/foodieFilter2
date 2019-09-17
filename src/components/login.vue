<template>
  <div id="login">
    <h3 class="head">手机号登录</h3>
    <div class="loginInfo">
      <div class="text">
        <input type="text" @input="handleInput" maxlength="11" placeholder="输入手机号码" v-model="userPhone">
      </div>
      <div class="text">
        <input type="text" @input="handleCode" maxlength="4" placeholder="输入验证码" v-model.trim="verifyCode">
      </div>
      <button v-show="!isSend" class="sendCode" :class="{forbid: isSend, disSty: isAble}" :disabled="isAble" @click="countDown">
        {{content}}
      </button>
      <button v-show="isSend" class="sendCode" :class="{forbid: isSend }" :disabled="isSend" @click="countDown">
        {{restTime + 's后发送'}}
      </button>
    </div>
    <ImgBtn :btnAttr="(userPhone&&verifyCode) ? btnStlyeActive : btnStlye" :eventName="'submit'" @submit="submitUser" />
    <ImgBtn style="margin-top: .15rem" :btnAttr="backBtn" :eventName="'goHome'" @goHome="goListBtn" />

  </div>
</template>

<script>
import ImgBtn from '@/components/common/hasImgBtn.vue'

const REST_TIME = 120

export default {
  props: {
    // propUserInfo: Object
  },
  components: {
    ImgBtn
  },
  data() {
    return {
      userInfo: {},
      userPhone: null,
      verifyCode: null, 
      restTime: REST_TIME, // 发送验证码后，开始倒计时，一共一分钟
      content: '发送验证码',
      isSend: false,
      isAble: true, // 默认不能点击发送验证码，当手机号输入满11位可点击

      reminderMsg: '',
      reminderState: true,
      visib: 'visible',
      picked: false,
      logined: false,
      
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
        val: '提交'
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
        val: '提交'
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
    }
  },
  beforeMount () {
    // localStorage.clear()
  },
  mounted () {

  },
  methods: {
    handleInput (e) {
      this.userPhone = e.target.value.replace(/\D*/g,'')
    },
    handleCode (e) {
      this.verifyCode = e.target.value.replace(/\D*/g,'')
    },
    /**
     * [返回首页]按钮
     */
    goListBtn () {
      this.$router.push({name: 'list'})
    },
    /**
     * 点击[提交]按钮
     */
    submitUser() {
      if (!this.userPhone) {
        return this.$reminderMsg.show({text: '请输入手机号'})
      }
      if (!this.verifyCode) {
        return this.$reminderMsg.show({text: '请输入验证码'})
      }
      this.$ut.lStoragePut('userPhone', this.userPhone)

      // 验证短信验证码
      this.submitCode();
    },
    /**
     * 方法：验证用户是否有修改头像的权限
     * 作用：如果有跳到user.vue页面，如果没有(注册过的用户)直接跳到list.vue
     */
    modifyUserInfoRight (token) {
      this.$ajax.userCome(token)
      .then(res => {
        if (res.code == 200) {
          if (res.result.come == true) {
            // let pageName = this.$ut.lStorageGet('page') || 'work'
            let pageName = this.$ut.lStorageGet('page') || 'my'
            this.$router.push({ name: pageName })
          } else {
            this.$router.push({name: 'user'})
          }
        } else { // token失效，重新登录
          this.$reminderMsg.show({text: res.errMsg})
          setTimeout(() => {
            this.$router.go(0)
          }, 1500)
        }
        
      }).catch(e => {
        console.log(e);
      })
    },
    // 校验手机号
    checkPhoneNum (userPhone) {
      let flag = false
      var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
      if (!reg.test(userPhone)) {
        this.$reminderMsg.show({text: '请填写有效手机号'})
        return flag
      }
      return flag = true
    },
    // 校验验证码（纯数字）
    checkNum (verifyCode) {
      let flag = false
      let reg = /^[0-9]*$/
      if (!reg.test(verifyCode)) {
        this.$reminderMsg.show({text: '验证码错误'})
        return flag
      }
      return flag = true
    },
    /**
     * 发送验证码倒计时
     */
    countDown () {
      // 手机号验证不通过，返回
      // if (!this.checkPhoneNum(this.userPhone)) return
      this.restTime = REST_TIME
      this.isSend = true
      let clock = null

      // 发送短信验证码
      this.getCode()

      clearInterval(clock)
      clock = window.setInterval(() => {
        this.restTime--
        if (this.restTime == 0) {
          this.restTime = 0
          this.isSend = false
          this.content = '发送验证码'
          clearInterval(clock)
        }
      }, 1000)
      
    },
    /**
     * 方法：发送短信验证码
     * 参数：@phoneNum 手机号
     */
    getCode () {
      this.$ajax.sendMsg ({'mobile': this.userPhone})
      .then(res => {
        this.$reminderMsg.show({text: res.message})
      }).catch(e => {
        console.log(e);
      })
    },
    /**
     * 方法：验证短信验证码
     */
    submitCode () {
      // 手机号验证不通过，返回 198开头也是手机号了 所以不校验了
      // if (!this.checkPhoneNum(this.userPhone)) return
      // 验证码不是纯数字，返回
      if (!this.checkNum(this.verifyCode)) return

      this.$ajax.verifyCode ({'mobile': this.userPhone, 'code': this.verifyCode})
      .then(res => {
        if (res.code === 30000) { // 验证成功
          let token = res.result;
          this.$ut.lStoragePut('token', res.result)
          _hmt.push(['_trackEvent', 'filterAc_verifyCode', 'click', '验证短信验证码通过'])
          // 验证石头有修改头像权限，并跳转页面
          this.modifyUserInfoRight(token)
        } 
        else if (res.code === 30001) { // 验证码错误
          this.$reminderMsg.show({text: res.message})
          _hmt.push(['_trackEvent', 'filterAc_failVerifyCode', 'click', '验证短信验证码失败'])
        } else if (res.code === 30002) { // 验证码已过期
          this.$reminderMsg.show({text: res.message})
          _hmt.push(['_trackEvent', 'filterAc_failVerifyCode', 'click', '验证短信验证码失败'])
        } else if (res.code === 30003) { // 验证码验证出错了
          this.$reminderMsg.show({text: res.message})
          _hmt.push(['_trackEvent', 'filterAc_failVerifyCode', 'click', '验证短信验证码失败'])
        } else {
          this.$reminderMsg.show({text: res.message})
          _hmt.push(['_trackEvent', 'filterAc_failVerifyCode', 'click', '验证短信验证码失败'])
        }
      }).catch(e => {
        console.log(e);
        _hmt.push(['_trackEvent', 'filterAc_failVerifyCode', 'click', '验证短信验证码失败'])
      })
    }
  },
  watch: {
    userPhone (val, oldVal) {
      if (val.length > 7) {
        this.isAble = false;
      } else {
        this.isAble = true;
      }
    }
  }
}
</script>

<style lang='scss' scoped>
#login{
  text-align: center;
  padding: 0 .76rem;
  box-sizing: border-box;
  .head{
    margin: 0.6rem 0 1.12rem;
    font-size: .5rem;
    text-align: center;
    color: #333;
  }
  .loginInfo{
    margin-bottom: 1.48rem;
    position: relative;
    .text{
      margin-bottom: .44rem;
      border-bottom: 1px #e5e5e5 solid;
    }
    input{
      -webkit-appearance: none;
      border: none;
      width: 6.04rem;
      font-size: .38rem;
      line-height: .4rem;
      box-sizing: border-box;
      padding: .2rem 0;
    }
    .sendCode{
      -webkit-touch-callout:none;
      -webkit-user-select:none;
      user-select:none;
      background: none;
      border: none;
      position: absolute;
      right: 0;
      bottom: .18rem;
      border: 1px solid #aeadad;
      border-radius: .08rem;
      width: 1.66rem;
      height: .68rem;
      font-size: .26rem;
      color: #7f7f7f;
      line-height: .70rem;
      text-align: center;
    }
    .forbid, .disSty{
      background: #dedddd;
      border: 1px solid #dedddd;
      color: #fff;
    }
  }
  .active{
    background: #000;
  }
}
</style>
