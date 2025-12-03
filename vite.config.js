import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    // --- 新增的部分 ---
    server: {
        port: 5173, // 前端端口
        open: true, // 自动打开浏览器
        proxy: {
            // 意思：凡是请求路径以 /api 开头的，都代理到 target 指定的地址
            '/api': {
                target: 'http://localhost:8080', // 后端接口地址
                changeOrigin: true, // 允许跨域
                // 重写路径：后端如果接口是 /user/login，而前端请求 /api/user/login，
                // 需要把 /api 去掉，变成 /user/login 发送给后端
                rewrite: (path) => path.replace(/^\/api/, '')
            },
            '/together/ws': { // 匹配 WebSocket 路径
                target: 'ws://localhost:8080', // 转发目标
                ws: true, // 【关键】开启 WebSocket 代理支持
                changeOrigin: true
            },
        }
    }
})