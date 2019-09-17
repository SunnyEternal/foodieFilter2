<template>
  <div id="dialog">
    <div class="main">
      <div class="block">
        <h4 v-html="txtVal"></h4>
      </div>
      <div class="btnWrap">
        <a class="noBtn" :class="{tap1: tapState1}" @touchstart="handTouchstart1" @touchend="handTouchend1" @click="cancelFn">取消</a>
        <a class="okBtn" :class="{tap2: tapState2}" @touchstart="handTouchstart2" @touchend="handTouchend2" @click="confirmFn">确定</a>
      </div>
    </div>
  </div>
</template>
    
<script>
import '@/static/css/dialog.scss'
export default {
  props: {
    txtVal: String
  },
  data () {
    return {
      tapState1: false,
      tapState2: false
    }
  },
  mounted () {
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
    },
    cancelFn () {
      this.$emit('confirmHand', false)
    },
    confirmFn () {
      this.$emit('confirmHand', true)
    }
  }
}
</script>

<style lang='scss' scoped>
#dialog .main{
  padding: .8rem .5rem .45rem;
  box-sizing: border-box;
  .block{
    height: 1.3rem;
    h4{
      line-height: .48rem;
      margin-bottom: 0;
    }
  }
}
</style>
