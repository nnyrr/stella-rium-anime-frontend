<script setup>
import { ref } from 'vue'

const rooms = ref([
  { id: 1, title: '热血动漫房', anime: '进击的巨人', cover: 'https://picsum.photos/300/200?7', progress: '12:30 / 24:00', percent: 52, online: 24, creator: '动漫迷', tags: ['高燃', '慎入'] },
  { id: 2, title: '治愈系小屋', anime: '夏目友人帐', cover: 'https://picsum.photos/300/200?8', progress: '05:10 / 22:00', percent: 23, online: 8, creator: '猫老师', tags: ['放松', '聊天'] },
  { id: 3, title: '咒术回战涉谷篇', anime: '咒术回战', cover: 'https://picsum.photos/300/200?9', progress: '18:45 / 23:10', percent: 80, online: 156, creator: '五条悟', tags: ['剧透警告'] }
])

const handleRefresh = () => alert('刷新房间列表...')
</script>

<template>
  <div class="max-w-7xl mx-auto px-5 py-12 min-h-screen">

    <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b-4 border-gray-800 pb-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <div class="w-3 h-8 bg-[#1E88E5]"></div>
          <h1 class="text-5xl font-black italic tracking-tighter text-gray-900 leading-none">
            同好放映室
          </h1>
        </div>
        <div class="flex items-center gap-4 text-sm font-bold text-gray-400 tracking-widest uppercase">
          <span>SYNC SYSTEM ONLINE</span>
          <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>{{ rooms.reduce((acc, cur) => acc + cur.online, 0) }} 人正在观看</span>
        </div>
      </div>

      <div class="flex gap-4 h-16">

        <button
            @click="handleRefresh"
            class="w-16 h-full rounded-sm bg-white/40 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/60 hover:shadow-lg hover:border-[#1E88E5]/30 flex items-center justify-center transition-all duration-300 active:scale-95 group"
        >
          <svg class="w-6 h-6 text-gray-400 group-hover:text-[#1E88E5] group-hover:rotate-180 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>

        <div class="relative w-56 h-full rounded-sm overflow-hidden cursor-pointer group shadow-lg shadow-blue-900/20 hover:shadow-blue-500/30 transition-all duration-300 active:scale-[0.98] select-none">

          <div class="absolute inset-0 bg-gradient-to-br from-[#1E88E5] to-blue-700"></div>

          <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]"></div>

          <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10"></div>

          <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-10"></div>

          <div class="absolute inset-0 flex items-center justify-center gap-3 text-white z-20">
            <svg class="w-5 h-5 drop-shadow-md group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>

            <div class="flex flex-col items-start">
              <span class="text-lg font-black italic tracking-[0.15em] leading-none drop-shadow-sm">创建房间</span>
              <span class="text-[8px] font-bold uppercase tracking-widest text-blue-200 group-hover:text-white transition-colors">Host New Party</span>
            </div>
          </div>

          <div class="absolute bottom-0 left-0 w-full h-[2px] bg-blue-400/50"></div>
        </div>

      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
          v-for="room in rooms"
          :key="room.id"
          class="group relative rounded-sm border border-white/60 bg-white/40 backdrop-blur-md hover:bg-white/60 hover:border-[#1E88E5]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5 cursor-pointer overflow-hidden"
      >
        <div class="relative h-48 overflow-hidden bg-gray-900">
          <img :src="room.cover" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
          <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>

          <div class="absolute top-3 right-3 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 text-xs font-mono text-white">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span class="font-bold">{{ room.online }} 在线</span>
          </div>

          <div class="absolute bottom-0 left-0 w-full h-1 bg-gray-700/50">
            <div class="h-full bg-[#1E88E5] relative group-hover:animate-pulse" :style="{ width: room.percent + '%' }"></div>
          </div>
        </div>

        <div class="p-5 relative">
          <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-400/30 group-hover:border-[#1E88E5] transition-colors"></div>
          <div class="mb-4">
            <h3 class="text-xl font-black italic text-gray-900 truncate group-hover:text-[#1E88E5] transition-colors mb-1">
              {{ room.title }}
            </h3>
            <div class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <span class="text-[#1E88E5]">正在播放:</span>
              <span class="truncate max-w-[200px]">{{ room.anime }}</span>
            </div>
          </div>
          <div class="flex items-center justify-between border-t border-gray-300/30 pt-4 mt-4">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-sm overflow-hidden border border-white/50">
                <img :src="`https://api.dicebear.com/7.x/initials/svg?seed=${room.creator}`" class="w-full h-full object-cover"/>
              </div>
              <span class="text-xs font-bold text-gray-600">{{ room.creator }}</span>
            </div>
            <div class="flex items-center gap-1 text-sm font-black italic text-gray-400 group-hover:text-[#1E88E5] transition-colors tracking-widest">
              加入房间
              <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>