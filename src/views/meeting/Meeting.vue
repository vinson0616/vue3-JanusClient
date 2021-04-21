<template>
  <div class="meeting" v-loading="isLoading">
    <div class="content h-100 w-100"  v-if="isJoined">
      <div class="topBar d-flex justify-content-between align-items-center ps-2 pe-2">
        <span> ConX Meeting</span>
        <span> 1234 </span>
        <span>00:00:01</span>
      </div>
      <div class="layout">
        <video-layout :users="userList"/>
      </div>
      <div class="bottomBar">
        <bottom-bar @leaveMeeting="leaveRoomHandle"/>
      </div>
    </div>
    <div class="d-flex justify-content-center align-items-center h-100" v-if="!isJoined">
      <join-meeting @JoinRoom="handleJoinRoom"/>
    </div>
  </div>
</template>

<script>
import { watch } from 'vue'
import { ElMessage } from 'element-plus'
import JoinMeeting from '@/views/meeting/JoinMeeting'
import VideoLayout from '@/views/meeting/VideoLayout'
import BottomBar from '@/views/BottomBar'
import { useRoomEffect } from '@/hooks/useRoomEffect'

export default {
  name: 'Meeting',
  components: {
    JoinMeeting,
    VideoLayout,
    BottomBar
  },
  setup () {
    const { isLoading, isJoined, errMsg, userList, joinRoomHandle, leaveRoomHandle } = useRoomEffect()
    const handleJoinRoom = (roomData) => {
      console.log(roomData)
      // 加入房间
      joinRoomHandle(roomData)
    }
    watch(isLoading, () => {
      if (!isLoading.value && errMsg.value) {
        ElMessage({
          type: 'error',
          message: '加入会议失败, 请检查房间号或者密码是否正确'
        })
      }
    })
    return {
      isJoined,
      isLoading,
      userList,
      handleJoinRoom,
      leaveRoomHandle
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/design";
.meeting {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: $gray-03;
  .content {
    display: flex;
    flex-direction: column;
    .topBar {
      height: 40px;
      background: $main-green;
      color: $gray-05;
    }
    .layout {
      flex: 1;
    }
    .bottomBar {
      height: 60px;
      background: $gray-05;
    }
  }
}
</style>
