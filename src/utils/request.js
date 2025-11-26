import axios from 'axios'
import { showErrorToast } from './toast'
import router from '@/router' // 如果需要跳转登录页，需引入 router

const service = axios.create({
    baseURL: '/api',
    timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 如果有 token，可以在这里统一添加
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data

        // 兼容性处理：
        // 1. 如果后端直接返回二进制流 (blob) 或没有 code 字段的纯 JSON，直接放行
        // 2. 这里的 res.code === 200 取决于你后端的 Result 封装，请确保后端也是用的 200
        if (res.code === 200 || res.code === undefined) {
            return res
        } else {
            // 业务错误 (如: 密码错误)
            showErrorToast(res.code || 'BIZ_ERR', res.msg || '操作失败')

            // 关键点：返回一个自定义的 reject，带上 isHandled 标记
            // 这样组件里就可以判断是否需要再次弹窗
            return Promise.reject(new Error(res.msg || 'Error'))
        }
    },
    error => {
        let code = 'NET_ERR'
        let msg = '网络连接异常'

        // 防止重复请求取消导致的报错
        if (axios.isCancel(error)) {
            return Promise.reject(error)
        }

        if (error.response) {
            code = error.response.status
            switch (code) {
                case 401:
                    msg = '登录已过期，请重新登录'
                    // 可选：自动跳转到登录页或清理 Token
                    // localStorage.removeItem('token')
                    // router.push('/')
                    break
                case 403: msg = '当前操作没有权限'; break
                case 404: msg = '请求的资源不存在'; break
                case 500: msg = '服务器内部错误'; break
                case 502: msg = '网关错误'; break
                default: msg = error.response.data?.msg || error.message
            }
        } else if (error.message.includes('timeout')) {
            code = 'TIMEOUT'
            msg = '请求超时，请检查网络环境'
        }

        // 统一弹出错误提示
        showErrorToast(code, msg)

        return Promise.reject(error)
    }
)

export default service