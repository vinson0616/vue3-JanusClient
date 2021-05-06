<template>
  <div class="JoinMeeting">
      <div class="loginContainer">
        <h1 class="Login_h1">
          <span>Con</span>
          <span style="color:#468ed0">X</span>
          <span>Meeting</span>
        </h1>
        <form class="mt-4" :class="dataInvalid" novalidate>
          <div class="mb-4 row">
            <input type="text" class="form-control" required placeholder="Please input userName" v-model="roomData.userName" @keydown.enter="handleJoinRoom"/>
          </div>
          <div class="mb-4 row">
            <input type="text" class="form-control" required placeholder="Please input room number" v-model="roomData.room" @keydown.enter="handleJoinRoom"/>
          </div>
          <div class="mb-4 row">
            <input type="password" class="form-control" required placeholder="Please input room password" v-model="roomData.password" @keydown.enter="handleJoinRoom"/>
          </div>
          <div class="mb-4 row">
            <el-button type="primary" @click="handleJoinRoom" >Start Meeting</el-button>
          </div>
        </form>
      </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
export default {
  name: 'JoinMeeting',
  emits: ['JoinRoom'],
  setup (props, context) {
    const dataInvalid = ref('')
    const roomData = reactive({
      userName: '',
      room: '',
      password: ''
    })
    const handleJoinRoom = () => {
      dataInvalid.value = (!roomData.room || !roomData.password || !roomData.userName) ? 'was-validated' : ''
      if (!dataInvalid.value) {
        context.emit('JoinRoom', roomData)
      }
    }
    return {
      dataInvalid,
      roomData,
      handleJoinRoom
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/design";
.JoinMeeting {
  width: 30rem;
  height: auto;
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

</style>
