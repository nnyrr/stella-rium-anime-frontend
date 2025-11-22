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

export const getLibrary = (sort, year, season, limit = 10, page = 1) => {
    return request({
        url: '/library',
        method: 'get',
        params: {
            sort,    // 排序字段
            year,    // 年份
            season,  // 季度
            limit,   // 每页条数
            page     // 页码
        }
    })
}
