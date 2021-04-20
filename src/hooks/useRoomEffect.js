import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { janusLibrary } from '@/utils/janusLibrary'

export const useRoomEffect = () => {
  const isLoading = ref(false)
  const isJoined = ref(false)
  const userList = reactive([])
  const errMsg = ref('')
  const store = useStore()
  let index = -1
  const joinCallback = (data) => {
    console.log(data)
    switch (data.type) {
      case 'initHandle':
        errMsg.value = ''
        store.commit('changeVideoHandle', data.content)
        break
      case 'destoryed':
        setTimeout(() => {
          isJoined.value = false
          isLoading.value = false
          userList.splice(0, userList.length)
        }, 1000)
        break
      case 'addUser':
        isJoined.value = true
        isLoading.value = false
        if (userList.findIndex(c => c.userName === data.content.userName) === -1) {
          userList.push(data.content)
        }
        // userList.push(data.content)
        // userList.push(data.content)
        break
      case 'removeUser':
        index = userList.findIndex(c => c.userName === data.content.userName)
        if (index !== -1) {
          userList.splice(index, 1)
        }
        break
      case 'error':
        isLoading.value = false
        errMsg.value = data.content
        break
    }
  }
  const joinRoomHandle = (roomData) => {
    console.log('JoinRoom: ', roomData)
    isLoading.value = true
    joinRoom(roomData.room, roomData.password, roomData.userName, false, true)
  }
  const leaveRoomHandle = () => {
    isLoading.value = true
    leaveRoom()
  }
  const { joinRoom, leaveRoom } = janusLibrary(joinCallback)
  return {
    isJoined,
    errMsg,
    isLoading,
    userList,
    joinRoomHandle,
    leaveRoomHandle
  }
}
