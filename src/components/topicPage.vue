<template>
  <div id="topicPage">

    <!-- <h3>#早餐打卡</h3> -->
    <div class="topicPage">
      <h3>我的话题作品</h3>
    </div>
    

    <!-- <Dynamic style="marginTop: -1.52rem !important;" /> -->
    <ComPicList :pageType="pageType" style="marginTop: -1.52rem !important;" />

    <div class="btnGroup">
      <ImgBtn :eventName="'joinTopic'" @joinTopic="joinTopicFn" :btnAttr="joinTopic"></ImgBtn>
      <ImgBtn :eventName="'back'" @back="backFn" :btnAttr="backBtn"></ImgBtn>
    </div>


  </div>
</template>

<script>
import Dynamic from '@/components/dynamic.vue'
import ImgBtn from '@/components/common/hasImgBtn.vue'
import ComPicList from '@/components/comPicList.vue'


export default{
  name: 'topicPage',
  components: {
    Dynamic,
    ImgBtn,
    ComPicList
  },
  data() {
    return{
      topicId: ' ',
      topicName: ' ',
      pageType: 'isTopic',
      joinTopic: {
        btnCon: { // 按钮样式
          borderColor: '#434343',
          background: '#434343',
          color: '#fff'
        },
        btnImg: { // 按钮内图片样式
          bgUrl: ''
        },
        val: '参与话题'
      },
      backBtn: {
        btnCon: {},
        btnImg: {
          bgUrl: ''
        },
        val: '返回'
      },
    }
    
  },
  mounted() {
 
  },
  methods: {
    // 参与话题
    joinTopicFn() {
      this.$router.push({
          name: 'addPic',
          query: {
            topicId: this.topicId,
            topicName: this.topicName
          }
        })
    },
    // 返回上一页
    backFn() {
      console.log('返回上页')
      this.$router.back()
    },
    
    
  }
}
</script>

<style lang="scss" scoped>
.topicPage{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
  background: #fff;
  h3{
    margin-top: .32rem;
    margin-bottom: .32rem;
    height: .32rem;
    font-size: .32rem;
    color: #333;
    padding-left: .25rem;
  }
  .btnGroup{
    z-index: 5;
    position: fixed;
    bottom: .6rem;
    width: 100%;
    text-align: center;
    display: flex; 
    justify-content: space-around;
    
    .btnCon{
      box-shadow: .01rem .01rem .14rem 0 rgba(0, 0, 0, 0.3);
    }
  }
}
</style>