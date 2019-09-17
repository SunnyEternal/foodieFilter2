<template>
    <!-- 1. 关联话题弹窗 -->
    <transition>
      <section class="topicGroup">
        <div class="main">
          <h3>关联话题<img class="closeTopic" src="../static/img/closeTopic.png" @click="childClose"></h3>
          <ul>
            <li v-for="(item, index) in topicList" :key="index" @click="childSelect(item)">{{item.topicName}}</li>
          </ul>
        </div>
      </section>
    </transition>
    
</template>

<script>
export default{
  props: ['topicList'],
  data() {
    return{
      // topicName: '',
      // topicId: '',
      topicObj: {},
    }
  },
  methods: {
    childSelect(item) {
      this.topicObj.topicName = item.topicName
      this.topicObj.topicId = item.topicId
      this.$emit('selectTopicFn', this.topicObj)
      this.$emit('closeTopicFn')
    },
    childClose() {
      this.$emit('closeTopicFn')
    }
  }
}
</script>

<style lang="scss" scoped>
// .topicGroup{
//   position: fixed;
//   width: 100%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background: rgba(0,0,0, 0.6);
//   z-index: 10;
//   color: #000;
  .main{
    text-align: left;
    width: 6.46rem;
    height: 10.6rem;
    border-radius: .16rem;
    background: #fff;
    margin: 0.54rem auto;
    padding: .52rem .44rem .64rem;
    box-sizing: border-box;
    h3{
      font-size: .4rem; 
      text-align: center; 
      position: relative;
      margin-bottom: .22rem;
      .closeTopic{
        width: .32rem;
        position: absolute;
        top: .04rem;
        right: 0;
      }
    }
    ul{
      height: 8.6rem;
      overflow-y: auto;
      li{
        height: .86rem;
        line-height: .86rem;
        border-bottom: 1px solid #e5e5e5;
        font-size: .32rem;
      }
    }
  }
  .closeTopic{
    width: .32rem;
  }
  
// }
</style>