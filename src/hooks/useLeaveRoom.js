import { ElMessageBox } from 'element-plus'
export const useLeaveRoom = (context) => {
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
