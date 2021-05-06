import { ref } from 'vue'
export const useAudioMuted = (context) => {
  const audioOff = require('@/assets/AudioOff.svg')
  const audioOn = require('@/assets/AudioOn.svg')
  const audioMuted = ref(false)
  const audioButton = ref(audioOff)
  const handleAudioMuted = () => {
    audioMuted.value = !audioMuted.value
    audioButton.value = audioMuted.value ? audioOn : audioOff
    context.emit('audioMuted', audioMuted.value)
  }
  return {
    audioMuted,
    audioButton,
    handleAudioMuted
  }
}
