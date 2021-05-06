<template>
<div class="bottomBar">
  <div class="room d-flex align-items-center ps-2 fw-bold">{{ RoomNumber }}</div>
  <div class="buttons">
    <icon-button-v :url="audioButton" text="Audio" @click="handleAudioMuted"/>
    <icon-button-v :url="videoButton" text="Camera" class="ms-3" @click="handleVideoMuted"/>
    <icon-button-v :url="shareScreenButton" text="Share" class="ms-3" @click="handleShare"/>
  </div>
  <div class="leaveMeeting ">
    <button type="button" class="btn btn-outline-danger fw-bold" @click="handleLeaveRoom">Leave Meeting</button>
  </div>
</div>
</template>

<script>
import IconButtonV from '@/components/Button/IconButtonV'
import { useAudioMuted } from '@/hooks/useAudioMuted'
import { useLeaveRoom } from '@/hooks/useLeaveRoom'
import { useVideoMuted } from '@/hooks/useVideoMuted'
import { useShareScreen } from '@/hooks/useShareScreen'

export default {
  name: 'BottomBar',
  props: {
    RoomNumber: {
      type: String,
      default: ''
    }
  },
  components: {
    IconButtonV
  },
  emits: ['leaveMeeting', 'audioMuted', 'videoMuted', 'startShare'],
  setup (props, context) {
    const { videoButton, handleVideoMuted } = useVideoMuted(context)
    const { audioButton, handleAudioMuted } = useAudioMuted(context)
    const { shareScreenButton, handleShare } = useShareScreen(context)
    const { handleLeaveRoom } = useLeaveRoom(context)
    return {
      audioButton,
      videoButton,
      shareScreenButton,
      handleLeaveRoom,
      handleAudioMuted,
      handleVideoMuted,
      handleShare
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../style/design";
.bottomBar {
  display: -webkit-box;
  -webkit-box-orient: horizontal;
  .room {
    color: $main-green;
  }
  .buttons {
    -webkit-box-flex: 1;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
  }
  .leaveMeeting {
    width: 150px;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
  }
}
</style>
