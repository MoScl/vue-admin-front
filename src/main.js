import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 不引入全局颜色被覆盖 stay
import 'element-plus/es/components/message/style/css'
import '@/styles/global.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
