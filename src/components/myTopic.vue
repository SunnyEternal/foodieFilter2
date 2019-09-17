<template>
  <div id="myTopic">
    <section v-for="(item, index) in pictureViews" :key="index">
      <button @click="topicAllPicFn(item.topicView)" type="button" :class="[item.className, {hot: item.topicView.hot === 2}]">
        <img v-if="item.hot === 2" class="hot" :src="require('../static/img/hot.png')" />
        {{item.topicView.topicName}}
      </button>
      <ul>
        <li v-for="el in item.pictureViews" :key="el.id" class="topicEle" :style="{backgroundImage:`url(${cdnPrefix + el.picUrl})`}" @click="bigPicFn">
          {{pictureViews.hasMore}}
        </li>
        <li v-if="item.hasMore" @click="viewMoreFn(item.topicView.topicId)" class="moreTopic">
          <p class="all">查看全部</p>
        </li>
      </ul>
    </section>

  </div>
</template>

<script>
export default{
  name: 'myTopic',
  components: {
    
  },
  data() {
    return{
      cdnPrefix: '',
      backBtn: {
        btnCon: { // 按钮样式
          width: '5.14rem',
          fontSize: '.34rem'
        },
        btnImg: { // 按钮内图片样式
          bgUrl: ''
        },
        val: '返回首页'
      },
      pictureViews: []
    }
  },
  mounted() {
    this.myAllTopicPicList()
  },
  methods: {
    topicAllPicFn(el) {
      this.$router.push({
        name: 'myAllTopicPic',
        query: {
          topicId: el.topicId,
          topicName: el.topicId
        }
      })
    },
    // 获取我的所有话题图片
    myAllTopicPicList() {
      this.$ajax.getAllTopicPicList({ token: this.$ut.lStorageGet('token')})
      .then(res => {
        console.log(res)
        if(res.code === 200 || res.code === '200') {
          this.cdnPrefix = res.result.cdnPrefix
          this.pictureViews = res.result.pictureViews
          this.pictureViews.forEach((item, index) => {
            item.className = 'color' + (index % 7)
          })
        }
      })
    },
    // 返回首页
    goListBtn () {
      this.$router.push({name: 'list'})
    },
    // 查看更多
    viewMoreFn(id) {
      console.log(id)
      this.$router.push({
        name: 'topicPage',
        query: {
          topicId: id
        }
      })
    },
    bigPicFn() {
      console.log('查看大图')
    }
  }
}
</script>

<style lang="scss" scoped>
#myTopic{
  margin-top: 2.56rem;
  section{
    background: #fff;
    padding: .26rem .32rem;
    box-sizing: border-box;
    margin-bottom: .08rem;
    ul{
      font-size: 0;
      white-space: nowrap;
      overflow-x: scroll;
      li{
        width: 2.15rem;
        height: 2.15rem;
        border-radius: .1rem;
        display: inline-block;
      }
      .topicEle{
        margin-right: .12rem;
        overflow: hidden;
        // background-image: url('../static/img/3.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
      }
      .moreTopic{
        border: 1px solid #e1e1e1;
        height: 2.15rem;
        vertical-align: top;
        .all{
          height: .3rem;
          font-size: .3rem;
          color: #020202;
          margin-top: .96rem;
          background-image: url('../static/img/arrow-r.png');
          background-position: 1.72rem center;
          background-repeat: no-repeat;
          background-size: .15rem .27rem;
          padding-left: .4rem;
        }
      }
    }
  }
  button{
    background: none;
    border: none;
    height: .6rem;
    line-height: .6rem;
    font-size: .28rem;
    padding: 0 .28rem 0;
    margin-right: .18rem;margin-bottom: .18rem;
    border-radius: .3rem;
    color:#fff;
  }
  .color0{
    box-shadow: 0 .05rem .09rem rgba(255, 190, 142, .7);
    background-color: #ffbe8e; 
  }
  .color1{
    box-shadow: 0 .05rem .09rem rgba(204, 201, 255, .7);
    background-color: #ccc9ff; 
  }
  .color2{
    box-shadow: 0 .05rem .09rem rgba(255, 189, 217, .7);
    background-color: #ffbdd9; 
  }
  .color3{
    background: #e4c4ff;
    box-shadow: 0 .05rem .09rem rgba(228, 196, 255, .7);
  }
  .color4{
    background: #b6d7ff;
    box-shadow: 0 .05rem .09rem rgba(182, 215, 255, .7);
  }
  .color5{
    background: #9ae4cc;
    box-shadow: 0 .05rem .09rem rgba(154, 228, 204, .7);
  }
  .color6{
    background: #fddb8a;
    box-shadow: 0 .05rem .09rem rgba(253, 219, 138, .7);
  }
  .hot{width: .32rem; height: .32rem; margin-top: .12rem;}
}
</style>