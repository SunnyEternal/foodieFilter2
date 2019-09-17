<template>
  <div id="dialog">
    <div class="main">
      <h4>确定使用同款滤镜进行拍摄</h4>
      <p>
        <img :src="filterObj.url">
        <span>{{filterObj.name}}</span>
      </p>
      <div class="btnWrap">
        <a class="noBtn" :class="{tap1: tapState1}" @touchstart="handTouchstart1" @touchend="handTouchend1" @click="cancelFn">取消</a>
        <a class="okBtn" :class="{tap2: tapState2}" @touchstart="handTouchstart2" @touchend="handTouchend2" :href="actionUrl">确定</a>
      </div>
    </div>
  </div>
</template>
    
<script>
import '@/static/css/dialog.scss'
export default {
  props: {
    filterObj: {
      type: Object,
      required: true
    },
    actionUrl: {
      type: String
    }
  },
  data () {
    return {
      tapState1: false,
      tapState2: false
    }
  },
  mounted () {
    // console.log(this.filterObj)
  },
  methods: {
    handTouchstart1 () {
      this.tapState1 = true
    },
    handTouchend1 () {
      this.tapState1 = false
    },
    handTouchstart2 () {
      this.tapState2 = true
    },
    handTouchend2 () {
      this.tapState2 = false
      _hmt.push(['_trackEvent', 'filterAc_useFilter', 'click', '使用同款滤镜总数'])
    },
    cancelFn () {
      this.$emit('parentHandNo', false)
    },
    confirmFn () {
      this.$emit('parentHandNo', true)
    }
  }
}
</script>

<style lang='scss' scoped>
#dialog .main{
  padding: .7rem .5rem;
}
#dialog .main h4 {
  margin-bottom: .24rem;
}
</style>
