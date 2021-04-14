<template>
<div class="home">
  <div class="content">
    <div class="itemRow" :style="{ height: users.length > 1 ? '50%' : '100%' }">
      <div class="videoItem" v-for="item in users.slice(0, Math.ceil(users.length / 2))" :key="item">
        <video autoplay :srcObject="item.stream"/>
        <div class="info">
          {{ item.userName }}
        </div>
      </div>
    </div>
    <div class="itemRow" style="height: 50%" v-if="users.length > 1">
      <div class="videoItem" v-for="item in users.slice(Math.ceil(users.length / 2), users.length)" :key="item">
        <video autoplay :srcObject="item.stream"/>
        <div class="info">
          {{ item.userName }}
        </div>
      </div>
    </div>
  </div>
  <div class="bottomBar">
    bottom bar
  </div>
</div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'Home',
  setup () {
    const store = useStore()
    const route = useRoute()
    const { users, videoHandle } = store.state
    if (videoHandle) {
      const join = {
        request: 'join',
        room: route.params.room,
        pin: route.params.password,
        ptype: 'publisher',
        display: route.params.userName
      }
      console.log(`room: ${join.room}, userName: ${join.display}`)
      videoHandle.send({ message: join })
      console.log('Home', window.videoRoomHandle)
    }
    return {
      users
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  background: lightgray;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .content {
    background: white;
    flex: 1;
    .itemRow {
      display: flex;
      height: 100%;
      .videoItem {
        flex: 1;
        background: #B7B7B7;
        margin-right: .01rem;
        margin-bottom: .01rem;
        position: relative;
        video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background-color: black;
          position: absolute;
        }
        .info {
          position: absolute;
          background: rgba(0,0,0,0.5);
          padding: 0 .1rem;
          color: white;
          width: auto;
          height: .3rem;
          bottom: 0;
          left: 0;
        }
      }
    }
  }
  .bottomBar {
    height: .5rem;
    border: 1px solid orange;
  }
}
</style>
