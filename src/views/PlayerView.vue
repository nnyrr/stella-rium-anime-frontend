<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AnimeCard from '@/components/AnimeCard.vue'
import ArtPlayer from '@/components/ArtPlayer.vue'
import { showErrorToast } from "@/utils/toast.js";
import {getAnimeDetail, getAnimeRecommendations, resolveVideoUrl} from '@/api/anime.js'

const route = useRoute()

// --- 状态定义 ---
const isLoading = ref(false)
const animeInfo = ref({})       // 动漫详情对象
const episodes = ref([])        // 剧集列表
const currentEp = ref(null)     // 当前播放的集数对象
const recommendations = ref([]) // 推荐列表

// --- 播放器配置 ---
const playerOption = ref({
  url: '',
  poster: '',
})

/**
 * 核心逻辑：加载所有数据
 * @param {String} id 动漫ID
 */
const loadData = async (id) => {
  isLoading.value = true
  try {
    // 1. 并发请求详情和推荐
    const [detailRes, recRes] = await Promise.all([
      getAnimeDetail(id),
      getAnimeRecommendations(id)
    ])

    // --- 处理动漫详情 ---
    const data = detailRes.data
    animeInfo.value = {
      title: data.title,
      synopsis: data.synopsis,
      tags: data.tags || [],
      year: data.year,
      cover: data.cover,
      bangumiId: data.bangumiId
    }

    episodes.value = data.episodes || []

    // [修改点 1] 智能初始化：自动寻找第一个有资源的集数播放，而不是默认第一集
    const firstAvailableEp = episodes.value.find(ep => ep.url)
    if (firstAvailableEp) {
      changeEpisode(firstAvailableEp)
    }

    // --- 处理相关推荐 ---
    const recList = recRes.data?.list || recRes.data || [] // 兼容不同结构

    recommendations.value = recList.map(item => ({
      id: item.bangumiId,
      title: item.nameCn || item.name,
      score: item.rating || 'N/A',
      img: item.image,
      year: item.year,
      tag: item.tag || '相关推荐'
    }))

  } catch (error) {
    console.error("Failed to load anime data:", error)
    showErrorToast("获取资源失败")
  } finally {
    isLoading.value = false
  }
}

/**
 * 切换剧集逻辑
 * @param {Object} ep 选中的剧集对象
 */
const changeEpisode = async (ep) => {
  // 逻辑保护：如果后端返回的 url 为空，拦截操作
  if (!ep.url) {
    showErrorToast(`"${ep.title}" 暂无播放资源`)
    return
  }

  // 1. 设置当前选中集数 UI 状态
  currentEp.value = ep
  // 重置封面（防止上一集的封面残留）
  playerOption.value.poster = animeInfo.value.cover

  // 2. 解析真实播放地址
  try {
    const rawUrl = ep.url
    // 修复语法错误：直接 await 函数调用即可
    const resolveRes = await resolveVideoUrl(rawUrl)

    // 假设后端返回结构是 { code: 200, data: "https://example.com/video.m3u8" }
    // 如果后端直接返回 URL 字符串，则使用 resolveRes
    const videoUrl = resolveRes.data || resolveRes

    console.log(`切换集数: ${ep.title}, 源地址: ${rawUrl}, 解析后: ${videoUrl}`)

    // 3. 更新播放器配置
    playerOption.value = {
      ...playerOption.value,
      url: videoUrl,
      // 在这里添加你需要的 Referer 或其他 Header
      headers: {
        // 注意：浏览器通常禁止手动修改 Referer，这取决于目标服务器的宽松程度
        // 如果是 Token 验证通常用 Authorization
        'Referer': 'www.google.com',
      }
    }
  } catch (error) {
    console.error("解析视频地址失败:", error)
    showErrorToast("视频地址解析失败")
  }
}

// 跳转到 Bangumi
const goToBangumi = () => {
  const url = animeInfo.value.bangumiId
      ? `https://bgm.tv/subject/${animeInfo.value.bangumiId}`
      : 'https://bgm.tv/'
  window.open(url, '_blank')
}

const goToDetail = (id) => {
  router.push(`/player/${id}`)
  /*if (id) {
    // 使用模板字符串拼接 ID，_blank 表示新窗口打开
    const url = `https://bgm.tv/subject/${id}`
    window.open(url, '_blank')
  } else {
    alert('未获取到番剧 ID')
  }*/
}

// 监听路由 ID 变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadData(newId)
  }
}, { immediate: true })

</script>

<template>
  <div class="min-h-screen pb-12">

    <div v-if="isLoading" class="fixed inset-0 bg-[#0B0C10] z-50 flex flex-col items-center justify-center text-white">
      <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <div class="font-mono text-blue-400 tracking-widest">SYSTEM INITIALIZING...</div>
    </div>

    <div v-else>
      <div class="bg-[#0B0C10] text-white pt-8 pb-12 relative overflow-hidden z-20">
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] pointer-events-none"></div>

        <div class="max-w-[1400px] mx-auto px-5 flex flex-col lg:flex-row gap-8 relative z-10">

          <div class="w-full lg:w-3/4 flex flex-col gap-4">
            <div class="relative w-full aspect-video bg-black rounded-sm border border-gray-800 shadow-2xl flex items-center justify-center group overflow-hidden">
              <ArtPlayer
                  v-if="playerOption.url"
                  :option="playerOption"
                  class="w-full h-full z-30"
              />
              <div v-else class="text-gray-500 font-mono flex flex-col items-center gap-2">
                <span>NO SIGNAL</span>
                <span v-if="episodes.length > 0 && !currentEp" class="text-xs text-gray-600">请选择集数</span>
                <span v-if="episodes.length === 0" class="text-xs text-gray-600">暂无资源</span>
              </div>

              <div class="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-gray-600 z-40 pointer-events-none"></div>
              <div class="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-gray-600 z-40 pointer-events-none"></div>
              <div class="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-gray-600 z-40 pointer-events-none"></div>
              <div class="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-gray-600 z-40 pointer-events-none"></div>
            </div>

            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-2xl md:text-3xl font-black italic tracking-tight text-white mb-2">
                  {{ animeInfo.title }}
                </h1>
                <div class="flex items-center gap-3 text-xs font-bold text-gray-400">
                  <span class="bg-[#1E88E5] text-white px-2 py-0.5 rounded-sm">
                    EP.{{ currentEp?.sort || '?' }}
                  </span>
                  <span>{{ animeInfo.year }}</span>
                  <span v-if="currentEp">•</span>
                  <span>{{ currentEp?.title }}</span>
                </div>
              </div>

              <div class="flex gap-4">
                <button @click="goToBangumi" class="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <div class="w-10 h-10 rounded-sm bg-gray-800 flex items-center justify-center group-hover:bg-[#F35C87] transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </div>
                  <span class="text-sm font-bold hidden md:block tracking-widest">BGM</span>
                </button>
              </div>
            </div>
          </div>

          <div class="w-full lg:w-1/4 flex flex-col h-full">
            <div class="bg-[#15171C] border border-gray-800 h-[500px] lg:h-auto flex flex-col rounded-sm">
              <div class="p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 class="font-black italic text-lg tracking-wider text-gray-200">EPISODE LIST</h3>
                <span class="text-xs font-mono text-gray-500">{{ episodes.length }} TOTAL</span>
              </div>

              <div class="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
                <button
                    v-for="ep in episodes"
                    :key="ep.sort"
                    @click="changeEpisode(ep)"
                    :disabled="!ep.url"
                    class="w-full flex items-center justify-between p-3 rounded-sm transition-all duration-200 group border-l-2"
                    :class="[
                      currentEp?.sort === ep.sort
                        ? 'bg-[#1E88E5]/10 border-[#1E88E5] text-white'
                        : (!ep.url ? 'border-transparent opacity-40 cursor-not-allowed' : 'border-transparent hover:bg-white/5 text-gray-400 hover:text-gray-200')
                    ]"
                >
                  <div class="flex items-center gap-3 overflow-hidden">
                    <div v-if="currentEp?.sort === ep.sort" class="w-4 flex justify-center gap-0.5 flex-shrink-0">
                      <div class="w-1 h-3 bg-[#1E88E5] animate-[pulse_1s_ease-in-out_infinite]"></div>
                      <div class="w-1 h-4 bg-[#1E88E5] animate-[pulse_1.2s_ease-in-out_infinite]"></div>
                      <div class="w-1 h-2 bg-[#1E88E5] animate-[pulse_0.8s_ease-in-out_infinite]"></div>
                    </div>
                    <span v-else class="w-4 text-xs font-mono text-gray-600 flex-shrink-0">
                      {{ ep.sort < 10 ? '0'+ep.sort : ep.sort }}
                    </span>

                    <span class="text-sm font-bold truncate flex items-center">
                      {{ ep.title }}
                      <span v-if="!ep.url" class="ml-2 text-[10px] text-red-400 border border-red-400/30 px-1 rounded bg-red-900/10 whitespace-nowrap">无资源</span>
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="max-w-[1400px] mx-auto px-5 mt-8 relative z-10">
        <div class="backdrop-blur-md rounded-sm shadow-xl p-6 md:p-10 border border-white/40">

          <div class="flex flex-col md:flex-row gap-16">
            <div class="w-full">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-1.5 h-6 bg-[#1E88E5]"></div>
                <h2 class="text-2xl font-black italic text-gray-900 tracking-tighter">SYNOPSIS</h2>
              </div>
              <p class="text-gray-800 leading-8 text-justify font-medium">
                {{ animeInfo.synopsis || '暂无简介' }}
              </p>

              <div class="flex flex-wrap gap-2 mt-6">
                <span v-for="tag in animeInfo.tags" :key="tag" class="px-3 py-1 bg-white/50 border border-gray-200 text-gray-600 text-xs font-bold rounded-sm backdrop-blur-sm">
                  #{{ tag }}
                </span>
              </div>

              <div class="mt-16">
                <div class="flex items-center justify-between mb-8 border-b border-gray-200/50 pb-4">
                  <h2 class="text-2xl font-black italic text-gray-900 tracking-tighter">RECOMMENDATIONS</h2>
                </div>

                <div v-if="recommendations.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <AnimeCard
                      v-for="rec in recommendations"
                      :key="rec.id"
                      :id="rec.id"
                      :title="rec.title"
                      :score="rec.score"
                      :image="rec.img"
                      :tag="rec.tag"
                      :year="rec.year"
                      @click="goToDetail(rec.id)"
                  />
                </div>
                <div v-else class="text-gray-500 text-center py-10">
                  暂无相关推荐
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #15171C;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #1E88E5;
}
</style>