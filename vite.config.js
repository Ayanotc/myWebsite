import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'

// https://vite.dev/config/
export default defineConfig({
  //配置根路径，解决部署到服务器之后绝对路径会报404问题，所以需改为相对路径
  base: '/',
  server: {
    open: true // 添加此行，运行后自动打开浏览器
  },
  plugins: [
    vue(),
    vueDevTools(),
    visualizer({
      open: true, //在默认用户代理中打开生成的文件
      gzipSize: true, // 收集 gzip 大小并将其显示
      brotliSize: true, // 收集 brotli 大小并将其显示
      filename: 'stats.html' // 分析图生成的文件名
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 1024,
      algorithm: 'gzip',
      deleteOriginFile: true
    }),
    importToCDN({
      modules: [
        {
          name: 'element-plus',
          var: 'ElementPlus',
          path: 'https://unpkg.com/element-plus@2.9.8',
          css: 'https://unpkg.com/element-plus/dist/index.css'
        },
        {
          name: 'vue',
          var: 'Vue',
          path: 'https://unpkg.com/vue@3.5.13'
        },
        {
          name: 'pinia',
          var: 'pinia',
          path: 'https://unpkg.com/pinia@3.0.1'
        },
        {
          name: 'vue-router',
          var: 'vue-router',
          path: 'https://cdn.jsdelivr.net/npm/vue-router@4.5.0/dist/vue-router.global.min.js'
        }
        // {
        //   name: 'echarts',
        //   var: 'echarts',
        //   path: 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js'
        // },
        // {
        //   name: 'moment',
        //   var: 'Moment',
        //   path: 'https://unpkg.com/moment@2.29.4'
        // },
        // {
        //   name: 'lodash',
        //   var: 'Lodash',
        //   path: 'https://unpkg.com/lodash@4.17.21'
        // }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        sourcemap: true,
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          // id为文件的绝对路径
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  }
})
