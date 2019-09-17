<template>
  <div>
    <div class="uploadImgBtn" id="uploadImgBtn" >
      <input class="uploadImg" type="file" @change="myFn" name="file" multiple id="file">
    </div>
    <ul class="picsBox">
      <li>
        <img src="@/static/img/reupload.png">
      </li>
      <li>
        <img src="@/static/img/filter.png">
      </li>
      <li>
        <img src="@/static/img/filter.png">
      </li>
    </ul>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
// import '@/assets/image-conversion'
// import common from '@/mixins/common'
// import EXIF from 'exif-js'
export default{
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {
    myFn() {
      //为外面的盒子绑定一个点击事件
      

          /*
          1、先获取input标签
          2、给input标签绑定change事件
          3、把图片回显
            */
  //            1、先回去input标签
          var $input = $("#file");
  //            2、给input标签绑定change事件
          // $input.on("change" , function(){
          //       console.log(this)
          //       //补充说明：因为我们给input标签设置multiple属性，因此一次可以上传多个文件
          //       //获取选择图片的个数
          //       var files = this.files;
          //       var length = files.length;
          //       console.log("选择了"+length+"张图片");
          //       //3、回显
          //       $.each(files,function(key,value){
          //           //每次都只会遍历一个图片数据
          //           var div = document.createElement("div"),
          //               img = document.createElement("img");
          //           div.className = "pic";

          //           var fr = new FileReader();
          //           fr.onload = function(){
          //               img.src=this.result;
          //               div.appendChild(img);
          //               document.body.appendChild(div);
          //           }
          //           fr.readAsDataURL(value);
          //       })

          //   })

            //4、我们把当前input标签的id属性remove
            $input.removeAttr("id");
            //我们做个标记，再class中再添加一个类名就叫test
            var newInput = '<input class="uploadImg test" type="file" name="file" multiple id="file">';
            $(this).append($(newInput));


    },
    handleChange() {
      //补充说明：因为我们给input标签设置multiple属性，因此一次可以上传多个文件
      //获取选择图片的个数
      var files = this.files;
      var length = files.length;
      console.log("选择了"+length+"张图片");
      //3、回显
      $.each(files,function(key,value){
          //每次都只会遍历一个图片数据
          var div = document.createElement("div"),
              img = document.createElement("img");
          div.className = "pic";

          var fr = new FileReader();
          fr.onload = function(){
              img.src=this.result;
              div.appendChild(img);
              document.body.appendChild(div);
          }
          fr.readAsDataURL(value);
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.picsBox{
  display: flex;
  padding: 0 .2rem;
  background: pink;
  box-sizing: border-box;
    overflow: hidden;

  li{
    width: calc((100% - .2rem) / 3);
    height: 1.4rem;
    padding: 5px;
    background: orange;
    overflow: hidden;
    img{
      width: 100%;
    }
  }
}
.uploadImgBtn {
  width: 100px;
  height: 100px;
  cursor: pointer;
  position: relative;
  background: url("../static/img/reupload.png") no-repeat;

  -webkit-background-size: cover;
  background-size: cover;
}

.uploadImgBtn .uploadImg {
  position: absolute;
  right: 0;
  top:0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
//这是一个用做回显的盒子的样式
.pic{
  width: 100px;
  height: 100px;
}
.pic img {
  width: 100%;
  height: 100%;
}
</style>