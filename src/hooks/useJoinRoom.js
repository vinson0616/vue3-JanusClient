import { reactive } from 'vue'

// 加入房间
export const useJoinRoom = (room, password) => {
  const roomData = reactive({ room: room, password: password })
  const handleJoin = () => {
    console.log(roomData.room, roomData.password)
  }
  return {
    roomData,
    handleJoin
  }
}
