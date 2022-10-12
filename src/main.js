import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@/config/element_use'

import '@/styles/global.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
