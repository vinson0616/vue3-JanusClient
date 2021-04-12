<template>
  <div class="wrapper">
    <img src="http://www.dell-lee.com/imgs/vue3/user.png" />
    <div class="input">
      <input placeholder="请输入房间号"/>
    </div>
    <div class="input">
      <input placeholder="请输入房间密码"/>
    </div>
    <div class="join-button">加入房间</div>
    <div class="register-link">注册房间</div>
  </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>

<style lang="scss" scoped>
@import "../../style/viriables";
.wrapper {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  img {
    display: block;
    margin: 0 auto .4rem auto; // 垂直居中
    width: .66rem;
    height: .66rem;
  }
  .input {
    box-sizing: border-box;
    height: .48rem;
    width: 4rem;
    margin: 0 auto .16rem auto;
    padding: 0 .16rem;
    background: #F9F9F9;
    border: 1px solid rgba(0,0,0,0.10);
    border-radius: 6px;
    input {
      line-height: .48rem;
      border: none;
      outline: none;
      width: 100%;
      background: none;
      font-size: .16rem;
      color: $content-notice-fontcolor;
      &::placeholder {
        color: $content-notice-fontcolor;
      }
    }
  }
  .join-button {
    margin: .32rem auto 0.16rem auto;
    line-height: .48rem;
    width: 4rem;
    background: #0091FF;
    box-shadow: 0 .04rem .08rem 0 rgba(0,145,255,0.32);
    border-radius: .04rem;
    color: #fff;
    font-size: .16rem;
    text-align: center;
    cursor: pointer;
  }
  .register-link {
    text-align: center;
    font-size: .14rem;
    color: $content-notice-fontcolor;
    cursor: pointer;
  }
}

</style>
