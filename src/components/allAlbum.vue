<template>
  <transition>
    <div>
      <h4>
        全部相册
        <span @click="closeAllAlbFn" class="closeAlb">
          <img src="../static/img/close-album.png" alt="">
        </span>
      </h4>


      <div class="gallery">
        <ul>
          <!-- <li  class="select"></li> -->
          <li :style="{backgroundImage:`url(${cdnPrefix + item.coverUrl})`}" @click="selectAlbFn(item, index)" v-for="(item, index) in albumList" :key="index" :class="{selActive: currAllAlbum === index}">
            <p>{{item.name}}</p>
          </li>
        </ul>
        <!-- 2. 返回首页 -->
        <!-- <div class="goHome">
          <ImgBtn :btnAttr='backBtn' :eventName="'goHome'" @goHome="goListBtn"></ImgBtn>
        </div> -->
        <button @click="confirmAlbumFn" class="confirmBtn">确定</button>
      </div>
    </div>
  </transition>
</template>

<script>
import ImgBtn from '@/components/common/hasImgBtn.vue'

export default{
  props: ['cdnPrefix', 'albumList'],
  data() {
    return{
      showAlbum: false,
      album3List: [], // 前3个相册
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
      
      currAllAlbum: 0,
      albumObj: {},
    }
  },
  components: {
    ImgBtn
  },
  mounted() {
    // this.albumList = this.$ut.lStorageGet('albumList')
    console.log(this.albumList)
    this.album3List = this.albumList.slice(0, 3)
  },
  methods: {
    confirmAlbumFn() {
      console.log('ddljjl')
      this.$emit('selectAlbumFn', this.albumObj)
      this.$emit('closeAllAlbFn')
    },
    closeAllAlbFn() {
      this.$emit('closeAllAlbFn')
    },
    selectAlbFn(item, iNum) {
      this.currAllAlbum = iNum
      this.albumObj.albumId = item.id
      this.albumObj.albumName = item.name
      console.log(this.albumObj)
      
    }
  }
}
</script>

<style lang="scss" scoped>

.gallery{
  margin-top: .34rem;
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
      // background-image: url('../static/img/album.jpg');
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
    // .select{
    //   width: 3.24rem;
    //   height: 2.22rem;
    //   border: 1px solid #e5e5e5;
    //   background: #fff url('../static/img/icon6.png');
    //   background-repeat: no-repeat;
    //   background-size: .42rem .42rem;
    //   background-position: center center;
    // }
  }
  .selActive{
    border: .06rem solid #ffe954;
    border-radius: .1rem;
    overflow: hidden;
    box-sizing: border-box;
  }
  .confirmBtn{
    outline: none;
    border: none;
    display: block;
    margin: .64rem auto;
    width: 4.2rem;
    height: .88rem;
    background: #fff;
    border-radius: .44rem;
    text-align: center;
    line-height: .88rem;
    font-size: .34rem;
    color: #333;
  }
}
h4{
  margin-top: .66rem;
  text-align: center;
  font-size: .3rem;
  position: relative;
  .closeAlb{
    width: .4rem;
    height: .4rem;
    position: absolute;
    top: -.02rem;
    right: .4rem;
  }
  img{
    width: .32rem;
    height: .32rem;
  }
}
</style>