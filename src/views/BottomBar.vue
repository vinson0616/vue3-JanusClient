<template>
<div class="bottomBar">
  <div class="buttons">
    <span class="pe-2">解除静音</span>
    <span  class="pe-2">停止视频</span>
    <span  class="pe-2">共享屏幕</span>
    <span  class="pe-2">邀请</span>
    <span class="pe-2">成员</span>
    <span class="pe-2">聊天</span>
    <span class="pe-2">录制</span>
    <span class="pe-2">更多</span>
  </div>
  <div class="leaveMeeting ">
    <button type="button" class="btn btn-outline-danger fw-bold" @click="handleLeaveRoom">离开会议</button>
  </div>
</div>
</template>

<script>
import { ElMessageBox } from 'element-plus'
export default {
  name: 'BottomBar',
  emits: ['leaveMeeting'],
  setup (props, context) {
    const handleLeaveRoom = () => {
      ElMessageBox.confirm('你要离开会议吗？', 'warning', {
        confirmButtonText: '离开',
        cancelButtonText: '取消'
      }).then(() => {
        context.emit('leaveMeeting')
      })
    }
    return {
      handleLeaveRoom
    }
  }
}
</script>

<style lang="scss" scoped>
.bottomBar {
  display: -webkit-box;
  -webkit-box-orient: horizontal;
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
