<template>
  <div class="saveSucToast" style="display:none">
    保存成功
  </div>
</template>
<style lang="scss">
.saveSucToast{position: fixed;white-space:nowrap;background-color: rgba(0,0,0,.6);z-index: 666;left:50%;top:50%;transform: translate(-50%,-50%);color:#fff;border-radius: .4rem;padding:.2rem .4rem;margin-top:.8rem;opacity:1;transition:all .3s ease-out;}
.saveSucToast.run{margin-top:0;opacity: 1}
</style>
