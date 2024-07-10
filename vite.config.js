import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

import { viteMockServe } from 'vite-plugin-mock'

import vue from '@vitejs/plugin-vue'
const prefix = `monaco-editor/esm/vs`
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: "./src/mock/source", // 解析，路径可根据实际变动
      localEnabled: true // 此处可以手动设置为true，也可以根据官方文档格式
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  preview: {
    port: 8080,
  },
  server: {
    port: 3030,
  },
  optimizeDeps: {
    include: [
      `${prefix}/language/json/json.worker`,
      `${prefix}/language/css/css.worker`,
      `${prefix}/language/html/html.worker`,
      `${prefix}/language/typescript/ts.worker`,
      `${prefix}/editor/editor.worker`
    ]
  }
})
