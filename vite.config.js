import { fileURLToPath, URL } from 'node:url'
import { server } from './src/settings'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as fs from 'fs'
import * as dotenv from 'dotenv'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const NODE_ENV = process.env.NODE_ENV || 'development'
const envFiles = [
  `.env.${NODE_ENV}`
]
for (const file of envFiles) {
  const envConfig = dotenv.parse(fs.readFileSync(file))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: server.port,
    open: true,
    proxy: {
      [process.env.VITE_BASE_API]: {// 使用环境变量中的值
        target: 'http://localhost:8088/',
        changeOrigin: true,
        pathRewrite: { // 重写真实请求地址
          ['^' + process.env.VITE_BASE_API]: ''
        }
      },
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
