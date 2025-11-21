<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 状态管理
const sortBy = ref('rank')
const pageSize = ref(20)
const currentPage = ref(1) // 新增：当前页码状态
// 新增筛选状态
const selectedYear = ref('all')
const selectedSeason = ref('spring')

// 模拟数据
const animeList = ref([
  { id: 1, title: '进击的巨人 Final Season', alias: 'Attack on Titan', score: '9.8', rank: 1, img: 'https://picsum.photos/200/300?4', year: 2023, season: '冬', tags: ['热血', '战斗'] },
  { id: 2, title: '鬼灭之刃 刀匠村篇', alias: 'Demon Slayer', score: '9.5', rank: 2, img: 'https://picsum.photos/200/300?5', year: 2023, season: '春', tags: ['奇幻'] },
  { id: 3, title: '葬送的芙莉莲', alias: 'Frieren', score: '9.9', rank: 3, img: 'https://picsum.photos/200/300?15', year: 2024, season: '秋', tags: ['治愈', '冒险'] },
  { id: 4, title: '间谍过家家 Season 2', alias: 'SPY×FAMILY', score: '9.4', rank: 4, img: 'https://picsum.photos/200/300?16', year: 2023, season: '秋', tags: ['搞笑'] },
  { id: 5, title: '电锯人', alias: 'Chainsaw Man', score: '9.2', rank: 5, img: 'https://picsum.photos/200/300?17', year: 2022, season: '秋', tags: ['猎奇'] },
])

const goToDetail = () => router.push('/player')
</script>

<template>
  <div class="max-w-7xl mx-auto px-5 py-12 flex flex-col md:flex-row gap-12 min-h-screen">

    <div class="w-full md:w-3/4 flex flex-col">

      <div class="flex justify-between items-end mb-8 border-b-4 border-gray-800 pb-4">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <div class="w-3 h-8 bg-[#1E88E5]"></div>
            <h1 class="text-5xl font-black italic tracking-tighter text-gray-900 leading-none">
              LIBRARY
            </h1>
          </div>
          <p class="text-sm font-bold text-gray-400 tracking-[0.3em] uppercase pl-6">
            动漫数据库
          </p>
        </div>
        <div class="flex gap-6 text-sm font-bold tracking-widest">
          <button @click="sortBy = 'rank'" class="transition-colors hover:text-[#1E88E5]" :class="sortBy === 'rank' ? 'text-[#1E88E5]' : 'text-gray-500'">
            按评分
            <span v-if="sortBy === 'rank'" class="block h-[3px] w-full bg-[#1E88E5] mt-1 rounded-full"></span>
          </button>
          <button @click="sortBy = 'date'" class="transition-colors hover:text-[#1E88E5]" :class="sortBy === 'date' ? 'text-[#1E88E5]' : 'text-gray-500'">
            按时间
            <span v-if="sortBy === 'date'" class="block h-[3px] w-full bg-[#1E88E5] mt-1 rounded-full"></span>
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <div
            v-for="(anime, index) in animeList"
            :key="anime.id"
            @click="goToDetail"
            class="group relative flex items-center gap-6 p-4 rounded-sm border border-white/60 bg-white/40 backdrop-blur-md shadow-sm hover:bg-white/80 hover:border-[#1E88E5]/30 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
        >
          <div class="relative w-20 h-28 flex-shrink-0 bg-gray-200 rounded-sm overflow-hidden shadow-inner group-hover:shadow-md transition-all duration-500">
            <img :src="anime.img" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div class="flex-1 flex flex-col gap-1.5 z-10">
            <h3 class="text-xl font-black text-gray-900 group-hover:text-[#1E88E5] transition-colors tracking-tight truncate w-[90%]">{{ anime.title }}</h3>
            <p class="text-xs font-bold text-gray-500 font-mono mb-1">{{ anime.alias }}</p>
            <div class="flex flex-wrap gap-2">
              <span class="text-[10px] font-bold px-3 py-1 rounded-sm bg-white/50 border border-gray-300 text-gray-600 tracking-wide backdrop-blur-sm">{{ anime.year }}</span>
              <span class="text-[10px] font-bold px-3 py-1 rounded-sm bg-[#1E88E5]/10 border border-[#1E88E5]/30 text-[#1E88E5] tracking-wide backdrop-blur-sm">{{ anime.season }}番</span>
              <span v-for="tag in anime.tags" :key="tag" class="text-[10px] font-bold px-3 py-1 rounded-sm border border-gray-300 text-gray-500 bg-white/30 backdrop-blur-sm">{{ tag }}</span>
            </div>
          </div>
          <div class="text-right z-0 pr-4">
            <div class="text-6xl font-black italic tracking-tighter text-gray-300 leading-none group-hover:text-[#1E88E5] group-hover:scale-110 transition-all duration-300 origin-right drop-shadow-sm">
              <span class="text-3xl align-top opacity-50 mr-1">#</span>{{ anime.rank }}
            </div>
            <div class="text-xs font-bold text-gray-400 tracking-widest mt-1 mr-1 group-hover:text-blue-400 transition-colors uppercase">Score {{ anime.score }}</div>
          </div>
        </div>
      </div>

      <div class="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-300/50 pt-8">

        <div class="flex items-center gap-3">
          <span class="text-xs font-black text-gray-400 uppercase tracking-wider">ROWS PER PAGE</span>
          <div class="relative group">
            <select
                v-model="pageSize"
                class="appearance-none bg-white/40 backdrop-blur-sm border border-gray-300 text-gray-700 font-bold text-sm pl-4 pr-10 py-2 rounded-sm focus:outline-none focus:border-[#1E88E5] focus:shadow-[0_0_10px_rgba(30,136,229,0.2)] transition-all cursor-pointer hover:border-[#1E88E5] hover:bg-white/60"
            >
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-hover:text-[#1E88E5] transition-colors">
              <svg class="fill-current h-3 w-3" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 select-none">
          <button class="w-10 h-10 rounded-sm border border-gray-300 bg-white/40 backdrop-blur-sm text-gray-400 hover:text-[#1E88E5] hover:border-[#1E88E5] hover:bg-white/80 flex items-center justify-center transition-all shadow-sm active:scale-95">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>

          <button
              v-for="page in 3"
              :key="page"
              @click="currentPage = page"
              class="relative w-10 h-10 rounded-sm font-bold text-sm transition-all duration-300 border flex items-center justify-center group"
              :class="currentPage === page
              ? 'border-[#1E88E5] bg-[#1E88E5]/5 text-[#1E88E5] shadow-[0_0_15px_rgba(30,136,229,0.15)] z-10 scale-105'
              : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-800 hover:bg-white/50'"
          >
            {{ page }}

            <div v-if="currentPage === page" class="absolute bottom-0 right-0 w-0 h-0 border-b-[6px] border-r-[6px] border-b-[#1E88E5] border-r-[#1E88E5] border-l-[6px] border-l-transparent border-t-[6px] border-t-transparent opacity-80"></div>
          </button>

          <span class="w-10 h-10 flex items-center justify-center text-gray-300 font-black tracking-widest">...</span>

          <button class="w-10 h-10 rounded-sm border border-gray-300 bg-white/40 backdrop-blur-sm text-gray-400 hover:text-[#1E88E5] hover:border-[#1E88E5] hover:bg-white/80 flex items-center justify-center transition-all shadow-sm active:scale-95">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <div class="w-full md:w-1/4 relative">
      <div class="sticky top-24 space-y-10">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-1.5 h-6 bg-[#1E88E5]"></div>
          <h3 class="text-xl font-black italic text-gray-800">筛选条件</h3>
        </div>

        <div>
          <div class="text-xs font-black text-gray-400 tracking-wider mb-4">年份</div>
          <div class="grid grid-cols-3 gap-2">
            <button
                v-for="year in ['全部', '2024', '2023', '2022', '2021', '更早']"
                :key="year"
                @click="selectedYear = year"
                class="relative py-2 text-xs font-bold rounded-sm transition-all duration-300 border group"
                :class="selectedYear === year
                ? 'border-[#1E88E5] bg-[#1E88E5]/5 text-[#1E88E5] shadow-[0_0_15px_rgba(30,136,229,0.15)]'
                : 'bg-white/40 border-white/60 text-gray-500 hover:bg-white hover:border-gray-300 hover:text-gray-700'"
            >
              {{ year }}
              <div v-if="selectedYear === year" class="absolute bottom-0 right-0 w-0 h-0 border-b-[6px] border-r-[6px] border-b-[#1E88E5] border-r-[#1E88E5] border-l-[6px] border-l-transparent border-t-[6px] border-t-transparent opacity-80"></div>
            </button>
          </div>
        </div>

        <div>
          <div class="text-xs font-black text-gray-400 tracking-wider mb-4">季节</div>
          <div class="grid grid-cols-2 gap-2">
            <button
                v-for="season in [{k:'winter', v:'1月 (冬)'}, {k:'spring', v:'4月 (春)'}, {k:'summer', v:'7月 (夏)'}, {k:'fall', v:'10月 (秋)'}]"
                :key="season.k"
                @click="selectedSeason = season.k"
                class="relative py-3 text-xs font-bold rounded-sm transition-all duration-300 border group text-center"
                :class="selectedSeason === season.k
                ? 'border-[#1E88E5] bg-[#1E88E5]/5 text-[#1E88E5] shadow-[0_0_15px_rgba(30,136,229,0.15)]'
                : 'bg-white/40 border-white/60 text-gray-500 hover:bg-white hover:border-gray-300 hover:text-gray-700'"
            >
              {{ season.v }}
              <div v-if="selectedSeason === season.k" class="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-1/2 bg-[#1E88E5]"></div>
            </button>
          </div>
        </div>

        <div class="pt-8 border-t border-gray-300/50">
          <div class="flex justify-between items-center text-[10px] text-gray-400 font-bold font-mono">
            <span>STATUS: ONLINE</span>
            <span>V2.4.0</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>