<template>
  <div id="galleryList">
    <header>
      <div class="top">
        <div class="cover"></div>
        <div class="cont">
          <h4>{{albumObj.name}}</h4>
          <p class="num">{{albumObj.pictureNum}}张</p>
          <p class="time">{{albumObj.createDate}}制成</p>
          <div class="albumBtn">
            <button class="putImg">放入照片</button>
            <button class="editAlbum" @click="editAlbFn">编辑相册</button>
          </div>
        </div>
      </div>
      <p class="desc">{{albumObj.description}}</p>
    </header>

    <!-- 2. 编辑相册 -->
    <div v-show="showDialog" class="albumMask">
      <Album :isEdit="isEdit" :alb="albumObj" @closeAlbFn="closeAlbFn" v-show="showAlbum" />
    </div>

    <!-- 3. 相册下图片列表 -->
    <ComPicList :pageType="pageType" />

    

    <!-- 4. 返回首页 -->
    <div class="goHome">
      <ImgBtn :btnAttr='backBtn' :eventName="'goHome'" @goHome="backFn"></ImgBtn>
    </div>
  </div>
</template>

<script>
import ImgBtn from '@/components/common/hasImgBtn.vue'
import Album from '@/components/Album.vue'
import ComPicList from '@/components/comPicList.vue'
 
export default{
  name: 'galleryList',
  components: {
    ImgBtn,
    Album,
    ComPicList
  },
  data() {
    return{
      pageType: 'isAlbum', // 
      backBtn: {
        btnCon: { // 按钮样式
          width: '5.14rem',
          fontSize: '.34rem'
        },
        btnImg: { // 按钮内图片样式
          bgUrl: ''
        },
        val: '返回相册'
      },
      isEdit: true, // 编辑状态
      showDialog: false, // 显示遮罩层
      showAlbum: false, // 显示编辑相册
      albumId: '', // 相册id
      albumObj: {}, // 相册对象
    }
  },
  created( ) {
    this.albumId = this.$route.query.id
    this.albumObj = this.$ut.lStorageGet('albumDesc' )
  },
  mounted() {

  },
  methods: {
    putFn() {
      console.log('放入')
    },
    // 打开编辑相册
    editAlbFn() {
      this.showDialog = true
      this.showAlbum = true
      console.log('编辑')
    },
    // 关闭编辑相册
    closeAlbFn() { 
      this.showDialog = false
      this.showAlbum = false
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
#galleryList{
  height: 100%;
  background: #f6f7fa; 
  header{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 3;
    background: #fff;
    padding-top: .08rem;
  box-sizing: border-box;
  }
  .top{
    padding-left: .24rem;
    display: flex;
    justify-content: flex-start;
  }
  .cover{
    width: 3.28rem;
    height: 2.24rem;
    margin-right: .24rem;
    background-image: url('../static/img/1.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }
  .cont{
    color: #010101;
    h4{
      font-size: .32rem;
      font-weight: bold;
      margin: .22rem 0 .12rem;
    }
    .num{
      font-size: .26rem;
      margin-bottom: .14rem;
    }
    .time{
      font-size: .24rem;
      color: #8a8a8a;
      margin-bottom: .25rem;
    }
  }
  .albumBtn{
    width: 3.4rem;
    height: .68rem;
    font-size: .28rem;
    color: #010101;
    button{
      border: none;
      outline: none;
      width: 1.64rem;
      height: .7rem;
      border-radius: .35rem;
      line-height: .7rem;
      text-align: center;
    }
    .putImg{
      background: #ffe954;
    }
    .editAlbum{
      background: #fff;
      border: 1px solid #e5e5e5;
    }
  }
  .desc{
    font-size: .26rem;
    color: #010101;
    padding: .28rem 0 .32rem .24rem;
  }
  .albumMask{
    position: fixed;
    top: 0; 
    left: 0;
    z-index: 9;
    width: 100%;
    height: 100%;
    background: #000;
    color: #fff;
  }
  
}
</style>