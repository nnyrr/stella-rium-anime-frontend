import request from '@/utils/request'

// 获取每日放送数据
export const getDailyAnime = () => {
    return request({
        url: '/index/calendar', // 实际请求会被代理为: http://localhost:8080/anime/daily
        method: 'get'
    })
}

// 获取热门动漫
export const getPopularAnime = () => {
    return request({
        url: '/index/popular',
        method: 'get'
    })
}

export const getTodaysPick = () => {
    return request(
        {
            url: '/index/today',
            method: 'get'
        }
    )
}

