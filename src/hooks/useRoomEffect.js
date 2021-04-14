import { reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { janusLibrary } from '@/utils/janusLibrary'

export const useRoomEffect = () => {
  const roomData = reactive({ room: '1234', password: '1234', userName: 'Vinson' })
  const router = useRouter()
  const store = useStore()
  const joinCallback = (data) => {
    console.log(data)
    switch (data.type) {
      case 'initHandle':
        router.push({ name: 'Home', params: roomData })
        store.commit('changeVideoHandle', data.content)
        break
      case 'addUser':
      case 'removeUser':
        store.commit(data.type, data.content)
        break
    }
  }
  const handleJoinRoom = () => {
    janusLibrary(roomData.room, roomData.password, false, true, joinCallback)
  }
  const JoinRoom = () => {
    console.log(roomData.room, roomData.password, roomData.userName)
    console.log(window.videoRoomHandle)
  }
  return {
    roomData,
    JoinRoom,
    handleJoinRoom
  }
}
// // 加入房间
// export const useJoinRoom = (room, password) => {
//   const roomData = reactive({ room: room, password: password })
//   const router = useRouter()
//   const joinCallback = (data) => {
//     console.log(data)
//     if (data.type === 'initHandle') {
//       window.videoRoomHandle = data.content
//       router.push({ name: 'Home' })
//     }
//   }
//   const handleJoin = () => {
//     console.log(roomData.room, roomData.password)
//     janusLibrary(roomData.room, roomData.password, joinCallback)
//   }
//   return {
//     roomData,
//     handleJoin
//   }
// }
