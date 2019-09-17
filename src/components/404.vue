<template >
  <div class="errPage">
    <h1>
      4 0 4<br />
      <small>您访问的页面不存在哦...</small>
    </h1>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.errPage{
  height:100%;display: flex;flex-direction: column;align-items: center;justify-content: center;
  background: url('../static/img/bg-bot1.jpg') center bottom no-repeat;background-size: 100% auto;

  h1{
    font-size: .8rem;font-weight: bold;text-align: center;position: relative;top:-1rem;
    small{
      font-size: 40%;
    }
  }
}
</style>
