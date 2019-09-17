<template>
  <div class="reminder mask" v-show="show">
    <div class="wpr">
      <p v-html="text"></p>
      <button type="button" name="button" @click="hide">确定</button>
      <var>客服微信：Cattemii</var>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '错误提示'
    },
    show: {
      type: Boolean,
      default: false
    },
    showCancel: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hide(e, msg = '') {
      this.show = false
      this.text = ''
      if(e) {
        setTimeout(() => {
          $('.reminder').css({'opacity': 0})
        }, 80)
      }
    }
  }
}
</script>

<style lang="scss">
.reminder{
  opacity: 0;
  .wpr{
    // width:5.3rem;
    width: 5.06rem;
    height: 3.4rem;
    padding: .54rem .5rem;
    box-sizing: border-box;
    box-shadow: 0 0 .12rem 0 rgba(0, 0, 0, .2);
    background-color: #fff;
    // padding:.8rem 0 .6rem;
    border-radius: .2rem;
  }
  p{
    text-align: center;color:#2d2d2d;font-size: .32rem;line-height: 1.6;box-sizing: border-box;
  }
  button{
    border:none;width:2.6rem;line-height: .8rem;font-size: .32rem;font-weight: bold;
    // background-color: #ffd753;
    background-color: #404040;
    color: #fff;
    border-radius: .4rem;display: block;margin:.35rem auto .46rem;
  }
  var{
    text-align: center;display: block;color:#303030;
  }
}
</style>
