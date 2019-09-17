<template>
  <a class="btnWrap" :class="{tap: tapState}" :href="btnActionUrl">
    <div class="btnCon" :style="btnAttr.btnCon" 
      @touchstart="handTouchstart" @touchend="handTouchend"
      @click="emitFn">
      <span class="btnTxt">
        <img class="btnImg" v-show="btnAttr.showImg" :style="btnAttr.btnImg" :src="btnAttr.imgUrl" />
        {{btnAttr.val}}
      </span>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    btnAttr: {
      type: Object,
      required: false
    },
    eventName: String,
    btnActionUrl: String
  },
  data () {
    return {
      tapState: false,
      url: ''
    }
  },
  mounted () {
  },
  methods: {
    handTouchstart(e) {
      this.tapState = true
    },
    handTouchend() {
      this.tapState = false
    },
    emitFn() {
      this.$emit(this.eventName)
    }
  }
}
</script>

<style lang="scss" scoped>
.btnWrap{
  position: relative;
  z-index: 3;
  width: 100%;
  height: .88rem;
  display: flex;
  justify-content: space-around;
}
.btnCon{
  height: .84rem;
  border-style: solid;
  border-width: 1px;
  border-radius: .44rem; 
  text-align: center;
  line-height: .88rem;
  width: 3.44rem; // 用户可定制
  border-color: #fff; // 用户可定制
  background: #fff; // 用户可定制
  color: #333; // 用户可定制
  font-size: .3rem; // 用户可定制
  .btnTxt{
    display: inline-block;
    .btnImg{
      width: .43rem; // 用户可定制
      height: .43rem; // 用户可定制
      border-radius: 50%;
      position: relative;
      top: .2rem; // 用户可定制 图片直径不同适当修改top值
    }
  }
}
</style>
