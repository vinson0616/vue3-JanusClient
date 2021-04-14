import { createStore } from 'vuex'

// vuex 创建了一个全局唯一的仓库，用来存放全局的数据
export default createStore({
  state: {
    videoHandle: null,
    users: []
  },
  mutations: {
    changeVideoHandle (state, handle) {
      state.videoHandle = handle
    },
    addUser (state, user) {
      const index = state.users.findIndex(c => c.userName === user.userName)
      if (index === -1) {
        state.users.push(user)
      }
    },
    removeUser (state, userName) {
      const index = state.users.findIndex(c => c.userName === userName)
      if (index !== -1) {
        state.users.splice(index, 1)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
