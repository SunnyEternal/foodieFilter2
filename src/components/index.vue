<template>
  <div id="p1">
    <div class="tip" @click="showActRules(1)">
      活动规则
    </div>
    <div class="wpr">
      <div class="top">
        <img src="https://dummyimage.com/420x315/b293a4/fff&text=someImg" width="100%" alt="">
        <em>活动日期: {{userInfo.startDate}}日<br />倒计时：{{userInfo.day}}天</em>
      </div>
      <div class="items">
        <div class="item">
          <img src="../static/img/prize1.jpg" alt="">
          <h5>拍立得相机眼部美容仪</h5>
          <h4>一等奖</h4>
        </div>
        <div class="item">
          <img src="../static/img/prize1.jpg" alt="">
          <h5>拍立得相机眼部美容仪</h5>
          <h4>一等奖</h4>
        </div>
        <div class="item">
          <img src="../static/img/prize1.jpg" alt="">
          <h5>拍立得相机眼部美容仪</h5>
          <h4>一等奖</h4>
        </div>
      </div>
      <div class="btns">
        <Button :sty="btn1Stlye" :eventName="'sToRegister'" @sToRegister="toRegister" />
        <div style="height:.3rem"></div>
        <Button :sty="btn2Stlye" :eventName="'sToM2M'" @sToM2M="toList" />
      </div>
    </div>

    <div id="actRules" class="mask" v-if="actRulesState">
      <div class="actRwpr">
        <h4>活动规则</h4>
        <p>1.用户可每天点击“上传冲榜”上传图片
          或视频内容，每次只能上传一张，每天
          可上传多次<br />
          2.用户上传的内容会由专业评审结合用
          户的点赞数进行综合打分，得分高的用
          户将出现在后续的榜单中<br />
          3.榜单每日凌晨更新，榜单内容为用户
          在1-3天中得分高的内容<br />
          4.使用foodie拍摄或增加foodie水印会
          提高内容的打分<br />
          5.上榜用户会收到短信通知，且在
          “Foodie官方微博”中进行内容推荐。<br />
          6.不良内容或非个人拍摄内容将被过滤<br />
          7.上期上榜用户将获得foodie优质创作
          者激励。<br />
          8.如有任何其他问题可咨询“Foodie官
          方微博”，我们会逐一回复</p>
          <Button :sty="btn3Stlye" :eventName="'sHideActRules'" @sHideActRules="showActRules(0)" />
      </div>
    </div>
  </div>
</template>

<script>
// import {config, tryToApp} from '@/config/commonConfig'
// import showToast from '@/bag/vueCommon/toast/1/t'
import * as _ajax from '@/static/js/requestSupport'
import loading from '@/bag/vueCommon/loading/1/loading'
import ut from '@/bag/utils/index.js'
import Button from '@/components/common/button.vue'


export default {
  props: {
    propUserInfo: Object
  },
  components:{
    Button
  },
  data(){
    return {
      actRulesState: false,
      userInfo: {},
      btn1Stlye: {
        color:'#657c5e',
        sColor:'#ffd852',
        eColor:'#ffe99b',
        value:'马上参与'
      },
      btn2Stlye: {
        color:'#ffffd9',
        sColor:'#9ec19e',
        eColor:'#b8d3b5',
        value:'观看活动相册'
      },
      btn3Stlye: {
        color:'#657c5e',
        sColor:'#ffd852',
        eColor:'#ffe99b',
        width: '2.7rem',
        value:'知道了'
      }
    }
  },
  beforeMount() {
    this.userInfo = Object.assign(this.userInfo, this.$userState)
    console.log(this.userInfo);
  },
  methods: {
    toList() {
      this.$router.push({name: 'list'})
    },
    showActRules(e) {
      this.actRulesState = !!e
      if(e) {
        setTimeout(() => {
          $('#actRules').css({'opacity': e})
        }, 80)
      }
    },
    toRegister() {
      this.$router.push({name: 'register', params: {id: '22'}})
    }
  },
  watch: {
    'propUserInfo'(newD, oldD) {
      console.log(this.propUserInfo);
      // let newObj = Object.assign({}, this.userInfo, this.propUserInfo
      // this.$set(this, 'userInfo', newObj)
      this.userInfo = Object.assign({}, this.userInfo, this.propUserInfo)
    }
  }
}
</script>

<style lang='scss'>
#p1{
  background: url('../static/img/bg-bot.png') center bottom no-repeat, url('../static/img/bg-top.jpg') center top no-repeat;background-size: 100% auto;
  background-color:#fffee4;
  height:100%;min-height:14.25rem;
  .tip{
    position: absolute;top:.18rem;right:.18rem;background: url('../static/img/index-tip.jpg') 0 -.01rem no-repeat;background-size: .32rem;
    padding-left:.36rem;color:#93ad94;height:.32rem;line-height: .32rem;font-size: .26rem;
  }
  .wpr{
    display: flex;align-items: center;justify-content: top;flex-direction: column;height:100%;
  }
  .top{
    margin-top:3.42rem;background-color: #fff;width:4.2rem;position: relative;box-shadow: 0 .2rem .23rem 0 rgba(159, 176, 130, .69);
    img{
      position: relative;top:.11rem;left:.28rem;
    }
    em{
      position: absolute;background-color: #ffeca1;font-size: .28rem;color:#889e89;line-height: .38rem;top:-.45rem;
      width:100%;left:.08rem;padding:.14rem .45rem;box-sizing: border-box;border-radius: 3rem;text-align: center;
      box-shadow: 0 0 .13rem 0 rgba(0, 0, 0, .25);
    }
  }
  .items{
    display: flex;justify-content: space-between;margin:.46rem 0 .4rem;
  }
  .item{
    width:1.98rem;background-color: #fffee4;box-shadow: 0 .1rem .23rem 0 rgba(159, 176, 130, .69);margin:0 .11rem;
    img{
      width:1.86rem;display:block;margin:.1rem auto;
    }
    h5{
      width:100%;display: block;font-size: .24rem;line-height: .38rem;color:#8ca582;font-weight: bolder;padding:0 .3rem;box-sizing: border-box;
    }
    h4{
      font-size: .34rem;color:#fee384;background-color:#879d88;font-weight: bolder;
      width:1.32rem;line-height: .44rem;margin:.24rem auto .18rem;font-style: italic;position: relative;text-align: center;
      &:before, &:after{
        content: "";position: absolute;width:0;height:0;line-height: 0;overflow: hidden;
        border-top:.22rem transparent solid;border-bottom: .22rem transparent solid;
        border-right:.1rem #879d88 solid;left:-.1rem;
      }
      &:after{
        border-right:none;left:auto;border-left:.1rem #879d88 solid;right:-.1rem;
      }
    }
  }
  .btns{
    // text-align: center;
  }
}
#actRules{
  opacity: 0;
  .actRwpr{
    background-color: #fff;width:5.8rem;box-sizing: border-box;padding:.32rem .55rem .42rem;
    border-radius: .2rem;text-align: center;
  }
  h4{
    font-size: .32rem;font-weight: bolder;color:#6a7f6b;line-height: 1.6;text-align: center;
  }
  p{
    font-size: .26rem;color: #616c7a;line-height: .38rem;margin-top:.2rem;text-align: left;
  }
  .btn{
    margin-top:.3rem;
  }
}
</style>
