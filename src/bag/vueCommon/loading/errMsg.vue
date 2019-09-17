<template lang="html">
  <div class="mask errMsg" style="display:none">
    <div class="wpr">
      <var></var>
      <button type="button" class="primaryBtn" id="cameraChoose">确定</button>
    </div>
  </div>
</template>

<style lang="scss">
.errMsg{
  .wpr{
   width:3.2rem;height:3.2rem;background-color: #9e7bf6;color:#fff;border-radius:.2rem;
   display:flex;flex-direction: column;align-items: center;justify-content: center
 }
  button{
    width:2.79rem;height:.89rem;font-size: .42rem;margin-top:.62rem;
  }
  var{
    font-size: .42rem;
  }
}
</style>
