<template>
  <div class="login" v-loading="isLoading">
    <div class="loginWrapper">
      <div class="loginContainer">
        <h1 class="Login_h1">
          <span>Con</span>
          <span style="color:#468ed0">X</span>
          <span>Meeting</span>
        </h1>
        <form class="mt-4" :class="dataInvalid" novalidate>
          <div class="mb-4 row">
            <input type="text" class="form-control" required placeholder="请输入用户名" v-model="roomData.userName" @keydown.enter="handleJoinRoom"/>
          </div>
          <div class="mb-4 row">
            <input type="text" class="form-control" required placeholder="请输入房间号" v-model="roomData.room" @keydown.enter="handleJoinRoom"/>
          </div>
          <div class="mb-4 row">
            <input type="password" class="form-control" required placeholder="请输入房间密码" v-model="roomData.password" @keydown.enter="handleJoinRoom"/>
          </div>
          <div class="mb-4 row">
            <el-button type="primary" @click="handleJoinRoom" >开始会议</el-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoomEffect } from '@/hooks/useRoomEffect'
export default {
  name: 'Login',
  setup () {
    // 加入房间逻辑，传入房间号和密码
    const { isLoading, dataInvalid, roomData, handleJoinRoom } = useRoomEffect()
    return {
      isLoading,
      dataInvalid,
      roomData,
      handleJoinRoom
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/design";
.login {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  .loginWrapper {
    margin: 30vh auto 0;
    width: 30rem;
    background: $gray-05;
    border: 1px solid $gray-03;
    border-radius: 8px;
    box-shadow: 0 10px 12px 0 rgba(0, 0, 0, 0.08);
    .loginContainer {
      margin: 20px auto;
      width: 22rem;
      .Login_h1 {
        text-align: center;
        font-size: 3rem;
        color: $gray-01;
      }
    }
  }
}

</style>
