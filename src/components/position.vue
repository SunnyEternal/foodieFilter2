<template>
  <div id="posi">
    <div class="search_box">
      <input class="search" type="text" placeholder="搜所地点"><span class="cancel" @click="cancelPosi">取消</span>
    </div>
    <p style="height: .06rem; background: #f6f7fa;"></p>
    <div >
      <ul class="posi_box">
        <li class="posiList">
          <p class="pName">远洋·光华国际A座</p>
          <!-- <p class="pDetail">北京市朝阳区金桐西路10号远洋·光华国际</p> -->
        </li>
        <!-- <li class="posiList">
          <p class="pName">远洋·光华国际</p>
          <p class="pDetail">北京市朝阳区金桐西路10号</p>
        </li>
        <li class="posiList">
          <p class="pName">北京辉盛阁国际公寓</p>
          <p class="pDetail">北京市朝阳区金桐西路12号</p>
        </li>
        <li class="posiList">
          <p class="pName">安妮意大利餐厅</p>
          <p class="pDetail">北京市朝阳区金桐西路10号远洋·光华国际</p>
        </li> -->
      </ul>
    </div>
  </div>
</template>

<script>
export default{
  data() {
    return{

    }
  },
  mounted() {

  },
  methods: {
    cancelPosi() {
      console.log('回首页')
    }
  }
}
</script>

<style lang="scss" scoped>
#posi{
  background: #fff;
  height: 100%;
  .search_box{
    // background-image: url('../static/img/album.jpg');
    // background-size: 6.3rem 4.76rem;
    // background-position: center center;
    // background-repeat: no-repeat;
    background: #f6f7fa;
    display: flex;
    justify-content: center;
    background: #fff;
    margin-top: .08rem;
    // margin-bottom: .06rem;
    .search{
      border: none;
      outline: none;
      width: 5.98rem;
      height: .6rem;
      line-height: .6rem;
      margin-bottom: .2rem;
      border-radius: .3rem;
      padding-left: .6rem;
      box-sizing: border-box;
      background: #f0f0f0;
      font-size: .28rem; // TODO 输入时颜色是？？？
    }
    .cancel{
      width: .86rem;
      height: .6rem;
      line-height: .6rem;
      text-align: right;
      font-size: .3rem;
      color: #000;
    }
  }
  .posi_box{
    padding-left: .4rem;
    box-sizing: border-box;
  }
  .posiList{
    background: #fff;
    height: 1.33rem;
    padding: .32rem 0;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;
    .pName{
      font-size: .32rem;
      font-weight: bold;
      color: #333;
      margin-bottom: .12rem;
    }
    .pDetail{
      font-size: .22rem;
      color: #989898;
    }
  }
}
</style>