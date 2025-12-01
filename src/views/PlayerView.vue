<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AnimeCard from '@/components/AnimeCard.vue'
import ArtPlayer from '@/components/ArtPlayer.vue'
import { showErrorToast } from "@/utils/toast.js";
import { getAnimeDetail, getAnimeRecommendations } from '@/api/anime.js'

const route = useRoute()

// --- 状态定义 ---
const isLoading = ref(true)
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

    if (episodes.value.length > 0) {
      changeEpisode(episodes.value[0])
    }

    // --- 处理相关推荐 (参考 PredictionView 的映射逻辑) ---
    // 假设后端返回结构为 { data: { list: [...] } } 或者直接是 { data: [...] }
    const recList = recRes.data?.list

    recommendations.value = recList.map(item => ({
      // 使用 bangumiId 作为跳转 ID
      id: item.bangumiId,
      // 优先显示中文名
      title: item.nameCn || item.name,
      // 评分处理
      score: item.rating || 'N/A',
      // 图片字段映射
      img: item.image,
      // 年份
      year: item.year,
      // 标签处理
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
const changeEpisode = (ep) => {
  currentEp.value = ep
  playerOption.value.poster = animeInfo.value.cover

  // 构造代理链接
  const rawUrl = ep.url
  const proxyUrl = `${import.meta.env.VITE_APP_BASE_API || '/api'}/proxy/m3u8?url=${encodeURIComponent(rawUrl)}`

  console.log(`切换集数: ${ep.title}, 原始流: ${rawUrl}, 代理流: ${proxyUrl}`)
  playerOption.value.url = proxyUrl
}

// 跳转到 Bangumi
const goToBangumi = () => {
  const url = animeInfo.value.bangumiId
      ? `https://bgm.tv/subject/${animeInfo.value.bangumiId}`
      : 'https://bgm.tv/'
  window.open(url, '_blank')
}

// 监听路由 ID 变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadData(newId)
  }
}, { immediate: true })

</script>

<template>
  <div class="min-h-screen pb-12 bg-[#0B0C10]">

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
              <div v-else class="text-gray-500 font-mono">NO SIGNAL</div>

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
                    EP.{{ currentEp?.sort }}
                  </span>
                  <span>{{ animeInfo.year }}</span>
                  <span>•</span>
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
                    class="w-full flex items-center justify-between p-3 rounded-sm transition-all duration-200 group border-l-2"
                    :class="currentEp?.sort === ep.sort
                    ? 'bg-[#1E88E5]/10 border-[#1E88E5] text-white'
                    : 'border-transparent hover:bg-white/5 text-gray-400 hover:text-gray-200'"
                >
                  <div class="flex items-center gap-3">
                    <div v-if="currentEp?.sort === ep.sort" class="w-4 flex justify-center gap-0.5">
                      <div class="w-1 h-3 bg-[#1E88E5] animate-[pulse_1s_ease-in-out_infinite]"></div>
                      <div class="w-1 h-4 bg-[#1E88E5] animate-[pulse_1.2s_ease-in-out_infinite]"></div>
                      <div class="w-1 h-2 bg-[#1E88E5] animate-[pulse_0.8s_ease-in-out_infinite]"></div>
                    </div>
                    <span v-else class="w-4 text-xs font-mono text-gray-600">
                      {{ ep.sort < 10 ? '0'+ep.sort : ep.sort }}
                    </span>
                    <span class="text-sm font-bold truncate">{{ ep.title }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="max-w-[1400px] mx-auto px-5 mt-8 relative z-10">
        <div class="bg-white/60 backdrop-blur-md rounded-sm shadow-xl p-6 md:p-10 border border-white/40">

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