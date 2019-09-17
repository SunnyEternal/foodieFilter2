<template>
  <div id="gallery" class="gallery">
    <ul> 
      <li @click="createAlbFn" class="select"></li>
      <li :style="{backgroundImage:`url(${cdnPrefix + item.coverUrl})`}" @click="viewAlbContFn(item)" v-for="(item, index) in albumList" :key="index" >
        <p>{{item.name}}</p>
      </li>
    </ul>

    <div v-show="showDialog" class="albumMask">
      <Album :isEdit="isEdit" @closeAlbFn="closeAlbFn" v-show="showAlbum" />
    </div>
    
    <!-- 2. 返回首页 -->
    <!-- <div class="goHome">
      <ImgBtn :btnAttr='backBtn' :eventName="'goHome'" @goHome="goListBtn"></ImgBtn>
    </div> -->
  </div>
</template>

<script>
import ImgBtn from '@/components/common/hasImgBtn.vue'
import Album from '@/components/Album.vue'
 
export default{
  name: 'gallery',
  props: ['isAlbums' ],
  components: {
    ImgBtn,
    Album
  },
  data() {
    return{
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
      
      curr: 0,
      albumList: [], // 相册列表
      allAlbumPageNum: 1,
      cdnPrefix: '',
      isEdit: false,
      showAlbum: false,
      showDialog: false, // 是否显示弹窗
      // selected: false,
    }
  },
  mounted() {
    console.log(this.albumList) 
    this.initAlbumFn()
  },
  methods: {
    // 获取相册列表
    initAlbumFn() {
      this.$ajax.allAlbum({pageNum: this.allAlbumPageNum, token: this.$ut.lStorageGet('token')})
      .then(res => {
        if(res.code === 200 || res.code === '200') {
          this.cdnPrefix = res.result.cdnPrefix
          this.albumList = res.result.albumViews
          // this.album6List = this.albumList.slice(0, 3)
          console.log(this.albumList)
        }
      })
      .catch(e => {
        console.log(e);
      })
    },
    // 查看相册内图片
    viewAlbContFn(item) {
      this.$ut.lStoragePut('albumDesc', item)
      this.$router.push({
        name: 'galleryList',
        query: {
          id: item.id
        }
      })
    },
    // 创建相册
    createAlbFn( ) {
      this.showAlbum = true
      this.showDialog = true
      console.log('kkkkk')
    }, 
    // 关闭创建相册
    closeAlbFn() { 
      this.showDialog = false
      this.showAlbum = false
    },
    selectAlbFn(iNum) {
      this.curr = iNum
    }
  }
}
</script>

<style lang="scss" scoped>
#gallery{
  margin-top: 2.48rem;
  ul{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    overflow: hidden;
    padding: .1rem .32rem;
    li{
      width: 3.28rem;
      height: 2.24rem;
      border-radius: .1rem;
      margin: .08rem .07rem;
      position: relative;
      // border: .06rem solid transparent;
      // box-sizing: border-box;
      background-image: url('../static/img/album.jpg');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
      p{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1.12rem;
        text-align: center;
        background: linear-gradient(rgba(0, 0, 0, 0.00001), rgba(0, 0, 0, 0.8));
        font-size: .3rem;
        font-weight: bold;
        color: #fff;
        padding-top: .64rem;
        box-sizing: border-box;
      }
    }
    .select{
      width: 3.24rem;
      height: 2.22rem;
      border: 1px solid #e5e5e5;
      background: #fff url('../static/img/icon6.png');
      background-repeat: no-repeat;
      background-size: .42rem .42rem;
      background-position: center center;
    }
  }
  .selActive{
    border: .06rem solid #ffe954;
    border-radius: .1rem;
    overflow: hidden;
    box-sizing: border-box;
  }
  // 黑色遮罩  
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