import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { UniEcharts } from 'uni-echarts/vite'
import Uni from '@uni-helper/plugin-uni'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    // https://uni-echarts.xiaohe.ink
    UniEcharts(),
    // https://uni-helper.js.org/plugin-uni
    Uni(),
  ],
  optimizeDeps: {
    exclude: [
      "uni-echarts"
    ]
  }  
})


