<template>
  <div class="btnWrap" :class="{tap: tapState}">
    <div class="btnCon" :style="btnAttr.btnCon" 
      @touchstart="handTouchstart" @touchend="handTouchend"
      @click="emitFn">
      <div class="btnInfo">
        <p class="midCon">
          <span class="imgWrap" :style="{backgroundImage:`url(${btnAttr.btnImg.bgUrl})`, display: btnAttr.btnImg.display}">
          </span>
          <span class="txtWrap">
            {{btnAttr.val}}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    btnAttr: {
      type: Object,
      required: false // bgUrl 和 val毕传
    },
    eventName: String
  },
  data () {
    return {
      tapState: false,
      url: ''
    }
  },
  mounted () {
    // console.log('img', this.btnAttr)
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

<style lang="scss">
.btnWrap{
  position: relative;
  z-index: 3;
  width: 100%;
  height: .88rem;
  display: flex;
  justify-content: space-around;
}
.tap{
  top:.03rem;left:.03rem;
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
  color: #434343; // 用户可定制
  font-size: .3rem; // 用户可定制
  .btnInfo{
    display: inline-block;
    .midCon{
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      align-items: center;
      height: .82rem;
      .txtWrap{
        max-width: 2.6rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .imgWrap{
      display: inline-block;
      width: .43rem; // 用户可定制
      height: .43rem; // 用户可定制
      border-radius: 50%;
      overflow: hidden;
      margin-right: .12rem;
      background-size: cover;
      background-repeat: no-repeat;
      // background-image: url('/static/filter.png');
      display: none;
      background-position: center center;
      // position: relative;
      // .btnImg{
      //   width: .43rem; // 用户可定制
      //   position: absolute;
      //   top: 50%;
      //   left: 0;
      //   transform: translateY(-50%);
      // }
    }
  }
}
</style>
