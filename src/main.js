import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
// 引入elementplus组件
import ElmentPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

import '@/style/index.scss'

// 引入bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)
app.use(ElmentPlus)
app.use(store)
app.use(router)
app.mount('#app')
