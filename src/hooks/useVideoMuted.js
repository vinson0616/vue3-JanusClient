import { ref } from 'vue'
export const useVideoMuted = (context) => {
  const videoOff = require('@/assets/Video-Off.svg')
  const videoOn = require('@/assets/Video_On.svg')
  const videoMuted = ref(false)
  const videoButton = ref(videoOff)
  const handleVideoMuted = () => {
    videoMuted.value = !videoMuted.value
    videoButton.value = videoMuted.value ? videoOn : videoOff
    context.emit('videoMuted', videoMuted.value)
  }
  return {
    videoButton,
    handleVideoMuted
  }
}
