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
const envFiles = [`.env.${NODE_ENV}`]
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
      [process.env.VITE_BASE_API]: {
        target: 'http://159.75.210.114:9605/',
        changeOrigin: true,
        pathRewrite: { // 重写真实请求地址
          ['^' + process.env.VITE_BASE_API]: ''
        }
      }
    }
  },
  build: {
    sourcemap: false, //true 生成source map 文件
  },
  plugins: [vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    // 按需引入，主题色的配置，需要加上 importStyle: 'sass'
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
    })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 覆盖掉element-plus包中的主题变量文件
        additionalData: '@use "@/styles/element/index.scss" as *;',
        // 支持内联 JavaScript
        // javascriptEnabled: true,
      }
    }
  },
})
