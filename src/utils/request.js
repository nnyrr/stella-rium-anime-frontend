import axios from 'axios'

import { showErrorToast } from './toast'

const service = axios.create({
    baseURL: '/api',
    timeout: 10000
})

// 请求拦截器 (可以在这里统一加 Token)
service.interceptors.request.use(
    config => {
        // 比如：config.headers['Authorization'] = 'Bearer ' + getToken()
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
        // 假设后端约定：code === 200 为成功
        if (res.code === 200) {
            return res
        } else {
            // 业务逻辑错误 (如：密码错误、余额不足)
            showErrorToast(res.code || 'BIZ_ERR', res.msg || '未知业务错误')
            // 抛出错误，中断后续 .then() 执行
            return Promise.reject(new Error(res.msg || 'Error'))
        }
    },
    error => {
        let code = 'NET_ERR'
        let msg = '网络连接异常'
        if (error.response) {
            // HTTP 状态码错误 (如 404, 500, 401)
            code = error.response.status
            switch (code) {
                case 401: msg = '未授权，请重新登录'; break
                case 403: msg = '拒绝访问'; break
                case 404: msg = '请求资源未找到'; break
                case 500: msg = '服务器内部错误'; break
                default: msg = error.response.data?.msg || error.message
            }
        } else if (error.message.includes('timeout')) {
            code = 'TIMEOUT'
            msg = '请求超时，请检查网络'
        }

        // 弹出简约错误提示
        showErrorToast(code, msg)

        console.error(`[Axios Error] ${code}: ${msg}`)
        return Promise.reject(error)
    }
)

export default service