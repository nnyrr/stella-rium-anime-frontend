<script setup>
import { ref } from 'vue'
import AnimeCard from '@/components/AnimeCard.vue'

// 模拟剧集数据
const episodes = ref(Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  duration: '24:00',
  title: i === 0 ? '自由之翼' : `第${i + 1}话`
})))
const currentEp = ref(1)

// 模拟推荐
const recommendations = ref([
  { id: 1, title: '鬼灭之刃', score: '9.5', img: 'https://picsum.photos/300/450?6', tag: '热血' },
  { id: 2, title: '咒术回战', score: '9.4', img: 'https://picsum.photos/300/450?13', tag: '战斗' },
  { id: 3, title: '链锯人', score: '9.2', img: 'https://picsum.photos/300/450?14', tag: '猎奇' },
  { id: 4, title: '死神', score: '9.1', img: 'https://picsum.photos/300/450?15', tag: '经典' },
])

// 跳转 Bangumi
const goToBangumi = () => {
  // 这里应该跳转到具体的番剧页面ID，暂时跳首页演示
  window.open('https://bgm.tv/', '_blank')
}
</script>

<template>
  <div class="min-h-screen pb-12">

    <div class="bg-[#0B0C10] text-white pt-8 pb-12 relative overflow-hidden z-20">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] pointer-events-none"></div>

      <div class="max-w-[1400px] mx-auto px-5 flex flex-col lg:flex-row gap-8 relative z-10">

        <div class="w-full lg:w-3/4 flex flex-col gap-4">
          <div class="relative w-full aspect-video bg-black rounded-sm border border-gray-800 shadow-2xl flex items-center justify-center group overflow-hidden">
            <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
            <div class="relative z-20 flex flex-col items-center cursor-pointer transition-transform duration-300 group-hover:scale-105">
              <div class="w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-[#1E88E5]/20 group-hover:border-[#1E88E5] group-hover:shadow-[0_0_30px_rgba(30,136,229,0.4)] transition-all duration-500">
                <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <p class="mt-4 text-xs font-mono text-gray-500 tracking-widest group-hover:text-[#1E88E5] transition-colors">SYSTEM READY</p>
            </div>
            <div class="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-gray-600"></div>
            <div class="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-gray-600"></div>
            <div class="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-gray-600"></div>
            <div class="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-gray-600"></div>
          </div>

          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl md:text-3xl font-black italic tracking-tight text-white mb-2">
                进击的巨人 Final Season
              </h1>
              <div class="flex items-center gap-3 text-xs font-bold text-gray-400">
                <span class="bg-[#1E88E5] text-white px-2 py-0.5 rounded-sm">EP.{{ currentEp }}</span>
                <span>2023</span>
                <span>•</span>
                <span>24min</span>
              </div>
            </div>

            <div class="flex gap-4">
              <button class="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <div class="w-10 h-10 rounded-sm bg-gray-800 flex items-center justify-center group-hover:bg-pink-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </div>
                <span class="text-sm font-bold hidden md:block">收藏</span>
              </button>

              <button @click="goToBangumi" class="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <div class="w-10 h-10 rounded-sm bg-gray-800 flex items-center justify-center group-hover:bg-[#F35C87] transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>
                <span class="text-sm font-bold hidden md:block tracking-widest">BANGUMI</span>
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
                  :key="ep.id"
                  @click="currentEp = ep.id"
                  class="w-full flex items-center justify-between p-3 rounded-sm transition-all duration-200 group border-l-2"
                  :class="currentEp === ep.id
                  ? 'bg-[#1E88E5]/10 border-[#1E88E5] text-white'
                  : 'border-transparent hover:bg-white/5 text-gray-400 hover:text-gray-200'"
              >
                <div class="flex items-center gap-3">
                  <div v-if="currentEp === ep.id" class="w-4 flex justify-center gap-0.5">
                    <div class="w-1 h-3 bg-[#1E88E5] animate-[pulse_1s_ease-in-out_infinite]"></div>
                    <div class="w-1 h-4 bg-[#1E88E5] animate-[pulse_1.2s_ease-in-out_infinite]"></div>
                    <div class="w-1 h-2 bg-[#1E88E5] animate-[pulse_0.8s_ease-in-out_infinite]"></div>
                  </div>
                  <span v-else class="w-4 text-xs font-mono text-gray-600">{{ ep.id < 10 ? '0'+ep.id : ep.id }}</span>
                  <span class="text-sm font-bold truncate">{{ ep.title }}</span>
                </div>
                <span class="text-xs font-mono text-gray-600 group-hover:text-gray-400">{{ ep.duration }}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="max-w-[1400px] mx-auto px-5 mt-8 relative z-10">
      <div class="bg-white/60 backdrop-blur-md rounded-sm shadow-xl p-6 md:p-10 border border-white/40">

        <div class="flex flex-col md:flex-row gap-16">
          <div class="w-full md:w-3/4">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-1.5 h-6 bg-[#1E88E5]"></div>
              <h2 class="text-2xl font-black italic text-gray-900 tracking-tighter">SYNOPSIS</h2>
            </div>
            <p class="text-gray-800 leading-8 text-justify font-medium">
              故事发生在一个被高墙环绕的世界，人类为了躲避巨人的捕食而生活在墙内。主角艾伦·耶格尔目睹母亲被巨人吞噬后，立志要将所有巨人驱逐出去。随着剧情推进，人类逐渐发现巨人的秘密以及高墙背后的真相，一场关乎人类命运的大战就此展开...
            </p>

            <div class="flex gap-2 mt-6">
              <span class="px-3 py-1 bg-white/50 border border-gray-200 text-gray-600 text-xs font-bold rounded-sm backdrop-blur-sm">#热血</span>
              <span class="px-3 py-1 bg-white/50 border border-gray-200 text-gray-600 text-xs font-bold rounded-sm backdrop-blur-sm">#战斗</span>
              <span class="px-3 py-1 bg-white/50 border border-gray-200 text-gray-600 text-xs font-bold rounded-sm backdrop-blur-sm">#WIT STUDIO</span>
            </div>

            <div class="mt-16">
              <div class="flex items-center justify-between mb-8 border-b border-gray-200/50 pb-4">
                <h2 class="text-2xl font-black italic text-gray-900 tracking-tighter">RECOMMENDATIONS</h2>
                <button class="text-sm font-bold text-gray-500 hover:text-[#1E88E5] transition-colors">VIEW MORE</button>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                <AnimeCard
                    v-for="rec in recommendations"
                    :key="rec.id"
                    :title="rec.title"
                    :score="rec.score"
                    :image="rec.img"
                    :tag="rec.tag"
                />
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