import { reactive } from 'vue'
import { Janus } from 'janus-gateway'

// 加入房间
export const useJoinRoom = (room, password) => {
  const roomData = reactive({ room: room, password: password })
  const handleJoin = () => {
    console.log(roomData.room, roomData.password)
    Janus.init({
      debug: true,
      dependencies: Janus.useDefaultDependencies(),
      callback: () => {
        console.log('初始化成功')
      }
    })
  }
  return {
    roomData,
    handleJoin
  }
}
