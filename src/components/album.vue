<template>
  <div>
    <transition name="createAlbum">
      <div class="createAlb">
        <button v-if="isEdit" @click="deleteAlbFn" class="delAlb">删除相册</button>
        <span @click="closeAlbFn" class="closeAlb">
          <img src="../static/img/close-album.png" alt="">
        </span>
        
        <div class="albumCover"></div>
        <input v-model="albumName" type="text" class="albName" placeholder="相册名（如美食、生活、旅行等）">
        <textarea v-model="albumDesc" placeholder="大概是一本关于什么的相册呢" class="albDesc"></textarea>
        <!-- <input v-if="!isEdit" v-model="albumName" type="text" class="albName" placeholder="相册名（如美食、生活、旅行等）">
        <textarea v-if="!isEdit" v-model="albumDesc" placeholder="大概是一本关于什么的相册呢" class="albDesc"></textarea> -->

        <!-- <input v-if="isEdit" v-model="alb.name" type="text" class="albName" placeholder="相册名（如美食、生活、旅行等）">
        <textarea v-if="isEdit" v-model="alb.description" placeholder="大概是一本关于什么的相册呢" class="albDesc"></textarea> -->

        <!-- <button class="create" :class="{createActive: albumName}" :disabled="!albumName" @click="createAlbFn">{{isEdit ? "完成" : "制成"}}</button> -->
        <button v-if="!isEdit" class="create" :class="{createActive: albumName}" :disabled="!albumName" @click="createAlbFn">制成</button>
        <button v-else class="create" :class="{createActive: albumName}" :disabled="!albumName" @click="editAlbFn">完成</button>
      </div>
    </transition>

    <!-- 确定删除 -->
    <transition name="confirmDel">
      <ConfirmDel :txtVal="'是否确定删除'" v-show="showConfirm" @confirmHand="confirmDelete"></ConfirmDel>
    </transition>
  </div>
</template>

<script>
import ConfirmDel from '@/components/common/confirmDialog.vue'
export default{
  props: ['isEdit', 'alb'],
  components: {
    ConfirmDel
  },
  data() {
    return{
      showConfirm: false, // 显示删除确认对话框
      albumName: '', // 相册名字
      albumDesc: '', // 相册描述
      albumId: this.$route.query.id // 相册id
    }
  },
  mounted() {
    if (this.isEdit) {
      this.albumName = this.alb.name
      this.albumDesc = this.alb.description
    }
    
  },
  methods: {
    closeAlbFn() {
      console.log('关闭')
      this.$emit('closeAlbFn')
    },
    // 创建相册
    createAlbFn() {
      this.$ajax.createAlbum({name: this.albumName, description: this.albumDesc, token: this.$ut.lStorageGet('token')})
        .then(res => {
          if(res.code === 200 || res.code === '200') {
            this.$emit('closeAlbFn')
            this.$router.go(0)
          }
        })
        .catch(e => {
          console.log(e);
        })
        console.log('创建相册')
    },
    // 编辑完相册
    editAlbFn( ) {
      this.$ajax.editAlbum({albumId: this.albumId, name: this.albumName, description: this.albumDesc, token: this.$ut.lStorageGet('token')})
        .then(res => {
          if(res.code === 200 || res.code === '200') {
            this.$emit('closeAlbFn')
            // this.$router.go(0)
          }
        })
        .catch(e => {
          console.log(e);
        })
    },
    // 编辑状态才有删除功能
    deleteAlbFn( ) {
      this.showConfirm = !this.showConfirm
      // this.albumId = id
      console.log(this.albumId)
      // _hmt.push(['_trackEvent', 'filterAc_deleteAlb', 'click', '删除相册'])
    },
    // 编辑状态才有删除功能
    confirmDelete() {
      console.log('调接口 删除相册')
      this.$ajax.deleteAlbum({albumId: this.albumId, token: this.$ut.lStorageGet('token')})
      .then(res => {
        console.log(res)
        if(res.code === 200 || res.code === '200') {
          
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.createAlb{
  padding: 1.56rem .6rem;
  box-sizing: border-box;
  position: relative;
}
.delAlb{
  position: absolute;
  top: .54rem;
  left: .58rem;
  width: 1.5rem;
  height: .6rem;
  border: 1px solid #c6c6c6;
  border-radius: .1rem;
  background: #000;
  color: #c6c6c6;
}
.closeAlb{
  position: absolute;
  top: .6rem;
  right: .4rem;
  width: .4rem;
  height: .4rem;
  img{
    width: .32rem;
    height: .32rem;
  }
}
.albumCover{
  width: 6.28rem;
  height: 4.76rem;
  border-radius: .1rem;
  background-image: url('../static/img/2.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}
.albName{
  border: none;
  outline: none;
  width: 100%;
  background: #000;
  border-bottom: 1px solid #434343;
  color: #fff;
  font-size: .3rem;
  padding: .46rem 0 .26rem .04rem;
  box-sizing: border-box;
  // color: #707070; placeholder 颜色
}
.albDesc{
  border: none;
  outline: none;
  width: 6.28rem;
  height: 2.5rem;
  margin-top: .44rem;
  border: 1px solid #434343;
  border-radius: .1rem;
  padding: .26rem .3rem;
  box-sizing: border-box;
  background: #000;
  font-size: .28rem;
  color: #fff;
}
.create{
  border: none;
  outline: none;
  display: block;
  width: 4.2rem;
  height: .88rem;
  border-radius: .44rem;
  text-align: center;
  line-height: .88rem;
  font-size: .34rem;
  color: #bebebe;
  margin: .55rem auto;
  background: #fff;
}
.createActive{
  color: #333;
  background: #fff;
}
// .createAlbum-enter{opacity: 0;}
// .createAlbum-enter-active{transition: .3s linear;}
// .createAlbum-leave-active{opacity: 0; transition: .3s linear;}
</style>