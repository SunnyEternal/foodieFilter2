<template lang="html">
  <div class="selectBox mask" style="display:none;z-index:590">
    <div class="owpr p-r">
      <img src="./img/flower.png" class="flow1 p-a" alt="">
      <img src="./img/flower.png" class="flow2 p-a" alt="">
      <div class="txt">
        <var>请</var><var>使</var><var>用</var><var>正</var><var>脸</var><var>拍</var><var>摄</var>
      </div>
      <div class="wpr">
        <button type="button" class="primaryBtn" id="cameraBtn">拍照</button>
        <button type="button" class="dangerBtn" id="galleryBtn">相册</button>
      </div>
    </div>
  </div>
</template>


<style lang="scss">
// .mask{
//   position: fixed;left:0;top:0;width:100%;bottom:0;background-color: rgba(0,0,0,.2);
//   display: flex;align-items: center;justify-content:center;
// }
.selectBox .wpr{
 width:4.5rem;height:4.5rem;background-color: #fff;border-radius:.2rem;
 display:flex;flex-direction: column;align-items:center;justify-content:center;
}
.selectBox .wpr{
  box-sizing: border-box;padding-top:.4rem;
}
.selectBox button,.errMsg button{
  width:2.79rem;height:.89rem;font-size: .42rem;
}
.selectBox .owpr{
  overflow: hidden;border-radius:.19rem;
}
.selectBox .txt{
  letter-spacing: .03rem;font-size: .26rem;
  text-align: center;position: absolute;top:.0;left:0;width:100%;background-color: #3d4b92;color:#fff;line-height: .62rem;
}
.selectBox .flow1{
  left:.65rem;top:.34rem;width:.16rem;z-index:6;transform: rotateZ(45deg);
}
.selectBox .flow2{
  right:.65rem;top:.1rem;width:.21rem;z-index:6;
}
</style>
