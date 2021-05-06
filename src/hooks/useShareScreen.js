export const useShareScreen = (context) => {
  const shareScreenButton = require('@/assets/share_screen.svg')
  const handleShare = () => {
    context.emit('startShare')
  }
  return {
    shareScreenButton,
    handleShare
  }
}
