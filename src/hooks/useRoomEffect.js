import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { janusLibrary } from '@/utils/janusLibrary'
import { ElMessage } from 'element-plus'

export const useRoomEffect = () => {
  const isLoading = ref(false)
  const isJoined = ref(false)
  const roomNumber = ref('')
  const userList = reactive([])
  const errMsg = ref('')
  const userTalking = ref('')
  const audioStream = ref(null)
  const store = useStore()
  const talkings = []
  let index = -1
  let user = null
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
          ElMessage({
            type: 'success',
            message: `${data.content.userName} is comming.`
          })
          userList.push(data.content)
        }
        break
      case 'removeUser':
        index = userList.findIndex(c => c.userName === data.content)
        if (index !== -1) {
          userList.splice(index, 1)
          ElMessage({
            type: 'success',
            message: `${data.content} left.`
          })
        }
        break
      case 'mutedChange':
        user = userList.find(c => c.userName === data.content.userName)
        if (user) {
          user.muted = data.content.muted
        }
        break
      case 'talkingChange':
        index = userList.findIndex(c => c.userName === data.content.userName)
        if (index !== -1) {
          const talkingIndex = talkings.findIndex(c => c === data.content.userName)
          if (data.content.talking) {
            if (talkingIndex === -1) {
              talkings.push(data.content.userName)
            }
          } else {
            if (talkingIndex !== -1) {
              talkings.pop(data.content.userName)
            }
          }
        }
        userTalking.value = talkings.length > 0 ? talkings.join(', ') : ''
        break
      case 'error':
        isLoading.value = false
        errMsg.value = data.content
        break
      case 'mcuAudio':
        audioStream.value = data.content
        break
    }
  }
  const joinRoomHandle = (roomData) => {
    console.log('JoinRoom: ', roomData)
    isLoading.value = true
    roomNumber.value = roomData.room
    joinRoom(roomData.room, roomData.password, roomData.userName, false, true)
  }
  const leaveRoomHandle = () => {
    isLoading.value = true
    leaveRoom()
  }
  const { joinRoom, leaveRoom, audioMuted, videoMuted, startShare } = janusLibrary(joinCallback)
  return {
    roomNumber,
    isJoined,
    errMsg,
    isLoading,
    userList,
    userTalking,
    audioStream,
    joinRoomHandle,
    leaveRoomHandle,
    audioMuted,
    videoMuted,
    startShare
  }
}
