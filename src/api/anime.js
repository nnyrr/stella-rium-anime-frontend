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

// 用户注册
export function register(data) {
    return request({
        url: '/auth/register', // 后端接口地址，请根据实际情况修改
        method: 'post',
        data
    })
}

// 用户登录
export function login(data) {
    return request({
        url: '/auth/login', // 后端接口地址
        method: 'post',
        data
    })
}

export function uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request({
        url: '/common/file',
        method: 'post', // 强烈建议使用 POST
        data: formData,
        headers: {
            // 让浏览器自动设置 boundary，不要手动写 Content-Type
            'Content-Type': 'multipart/form-data'
        }
    })
}

export function deleteFile(uuid) {
    return request({
        url: '/common/file',
        method: 'delete',
        data: { uuid } // Axios 中 DELETE 发送 Body 需要放在 data 字段里
    })
}

export function getUserInfo(id) {
    return request({
        url: '/auth',
        method: 'get',
        params: {
            id
        }
    })
}

export function getAnimeCollection(userId, status, limit, page) {
    return request({
        url: '/collection/anime',
        method: 'get',
        params: {
            userId,
            status,
            limit,
            page
        }
    })
}

export function getCharacterCollection(userId, limit, page) {
    return request({
        url: '/collection/character',
        method: 'get',
        params: {
            userId,
            limit,
            page
        }
    })
}

export function getAnimePrediction(userId) {
    return request({
        url: '/prediction/anime',
        method: 'get',
        params: {
            userId
        }
    })
}

export function getCharacterPrediction(userId){
    return request({
        url: '/prediction/character',
        method: 'get',
        params: {
            userId
        }
    })
}

