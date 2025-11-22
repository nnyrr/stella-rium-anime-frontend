<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AnimeCard from '../components/AnimeCard.vue'
import HomeHero from '../components/HomeHero.vue'
import DailySchedule from '../components/DailySchedule.vue'
import { getDailyAnime, getPopularAnime, getTodaysPick } from '@/api/anime'

// --- 1. 热门动漫 (默认显示 Mock 数据，防止白屏) ---
const hotAnimes = ref([
  { id: 1, title: '进击的巨人 Final', score: '9.8', img: 'https://picsum.photos/300/450?1', tag: '神作' },
  { id: 2, title: '鬼灭之刃 柱训练', score: '9.6', img: 'https://picsum.photos/300/450?2', tag: '热血' },
  { id: 3, title: '葬送的芙莉莲', score: '9.9', img: 'https://picsum.photos/300/450?3', tag: '治愈' },
  { id: 4, title: '间谍过家家', score: '9.5', img: 'https://picsum.photos/300/450?4', tag: '搞笑' },
  { id: 5, title: '咒术回战', score: '9.4', img: 'https://picsum.photos/300/450?5', tag: '战斗' },
  { id: 6, title: '电锯人', score: '9.2', img: 'https://picsum.photos/300/450?6', tag: '猎奇' },
])

// --- 2. 每日放送逻辑 ---
const weekDays = [
  { en: 'SUN', kanji: '日' }, { en: 'MON', kanji: '月' }, { en: 'TUE', kanji: '火' },
  { en: 'WED', kanji: '水' }, { en: 'THU', kanji: '木' }, { en: 'FRI', kanji: '金' },
  { en: 'SAT', kanji: '土' }
]
const todayIndex = new Date().getDay()
const activeDay = ref(todayIndex)
const currentTime = ref('00:00:00')
let timer = null

// 每日放送 (默认 Mock 数据)
const dailyAnimeList = ref(Array.from({ length: 5 }, (_, i) => ({
  id: i,
  title: '加载中...',
  img: `https://picsum.photos/400/250?random=${i}`,
})))

// Hero 数据 (默认 Mock 数据)
const heroAnime = ref({
  id: 0,
  title: 'Stellarium Anime',
  desc: '连接后端服务失败，当前显示演示数据。请检查 Java 后端是否启动。',
  img: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070'
})

// --- 初始化数据 ---
const initData = async () => {
  try {
    // 并行请求，失败也没关系，catch 会捕获
    const [popularRes, dailyRes, heroRes] = await Promise.all([
      getPopularAnime().catch(err => console.log('热门接口未通')),
      getDailyAnime().catch(err => console.log('每日接口未通')),
      getTodaysPick().catch(err => console.log('推荐接口未通'))
    ])

    // 只有当接口成功返回数据时，才覆盖默认数据
    if (popularRes?.data?.list && popularRes.data.list.length > 0) {
      hotAnimes.value = popularRes.data.list.map(item => ({
        id: item.bangumiId,
        title: item.nameCn || item.name,
        score: item.rating || 'N/A',
        img: item.image,
        year: item.year,
        tag: item.tag || '热门'
      }))
    }

    if (dailyRes?.data?.list && dailyRes.data.list.length > 0) {
      dailyAnimeList.value = dailyRes.data.list.map(item => ({
        id: item.bangumiId,
        title: item.nameCn || item.name,
        img: item.image
      }))
    }

    // 兼容 data: { "": {...} } 或 data: {...}
    if (heroRes?.data) {
      const heroData = heroRes.data[""] || heroRes.data
      if (heroData && heroData.name) {

        // --- 核心修改开始 ---
        const rawNameCn = heroData.nameCn || heroData.name;
        let mainTitle = rawNameCn;
        let subTitle = heroData.name; // 默认副标题为原名

        // 如果包含空格，则进行分割
        if (rawNameCn && rawNameCn.includes(' ')) {
          var firstSpaceIndex = rawNameCn.indexOf(' ');
          mainTitle = rawNameCn.substring(0, firstSpaceIndex);
          if(mainTitle.startsWith("剧场版")){
            const temp = firstSpaceIndex;
            firstSpaceIndex = rawNameCn.indexOf(' ');
            mainTitle = rawNameCn.substring(temp+1, firstSpaceIndex);
          }
          // 截取空格后的所有内容作为副标题
          subTitle = rawNameCn.substring(firstSpaceIndex + 1);
          if(mainTitle.length<8){
            mainTitle = rawNameCn;
            subTitle = heroData.name;
          }
        }
        // --- 核心修改结束 ---

        heroAnime.value = {
          id: heroData.bangumiId,
          title: mainTitle,
          subtitle: subTitle || heroData.name,
          desc: heroData.brief || '暂无简介',
          img: heroData.image // 注意接口大小写
        }
      }
    }

  } catch (error) {
    console.error("初始化数据异常:", error)
  }
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
}

const goToDetail = (id) => {
  if (id) {
    // 使用模板字符串拼接 ID，_blank 表示新窗口打开
    const url = `https://bgm.tv/subject/${id}`
    window.open(url, '_blank')
  } else {
    alert('未获取到番剧 ID')
  }
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  initData() // 尝试加载真实数据
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <main>
    <HomeHero :data="heroAnime"/>
    <div class="max-w-7xl mx-auto px-5 py-12">
      <div class="max-w-7xl mx-auto px-5 py-12">
        <div class="relative z-10">
          <div class="absolute -left-20 -top-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

          <div class="flex justify-between items-end mb-10">
            <div class="flex items-center gap-4 group cursor-default">

              <div class="relative w-12 h-12 bg-gradient-to-br from-[#1E88E5] to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
                <svg class="w-7 h-7 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z"/>
                </svg>
                <div class="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-pulse"></div>
              </div>

              <div>
                <h2 class="text-5xl font-black italic tracking-tighter text-gray-800 leading-none">
                  热门动漫
                </h2>
                <p class="text-gray-400 text-sm font-bold tracking-wider mt-1 uppercase">很多人在看</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <AnimeCard
                v-for="anime in hotAnimes"
                :key="anime.id"
                :title="anime.title"
                :score="anime.score"
                :image="anime.img"
                :tag="anime.tag"
                @click="goToDetail(anime.id)"
            />
          </div>
        </div>
      </div>


      <section class="mt-20"> <div class="flex items-center justify-between mb-8">
        <div class="flex justify-between items-end mb-10">
          <div class="flex items-center gap-4 group cursor-default">

            <div class="relative w-12 h-12 bg-gradient-to-br from-[#1E88E5] to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
              <svg class="w-7 h-7 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z"/>
              </svg>
              <div class="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-pulse"></div>
            </div>

            <div>
              <h2 class="text-5xl font-black italic tracking-tighter text-gray-800 leading-none">
                每日放送
              </h2>
              <p class="text-gray-400 text-sm font-bold tracking-wider mt-1 uppercase">今日动漫</p>
            </div>
          </div>
        </div>

        <div class="flex items-baseline gap-2 select-none ">
          <div class="text-5xl font-black italic tracking-tighter text-gray-800 leading-none">
            {{ currentTime }}
          </div>
        </div>
      </div>

        <div class="flex gap-8">






          <div class="hidden md:flex flex-col w-16 flex-shrink-0 sticky top-24 z-10 select-none filter drop-shadow-xl">

            <div class="flex flex-col w-full bg-white/20 backdrop-blur-xl border-x border-t border-white/30 rounded-t-sm overflow-hidden">

              <div
                  v-for="(day, index) in weekDays"
                  :key="index"
                  class="relative w-full h-14 flex flex-col items-center justify-center transition-all duration-200 border-b border-white/10"
                  :class="index === todayIndex
          ? 'z-10'
          : 'hover:bg-white/10'"
              >
                <div
                    v-if="index === todayIndex"
                    class="absolute inset-0 border-2 border-[#1E88E5] bg-[#1E88E5]/5 shadow-[inset_0_0_10px_rgba(30,136,229,0.2)]"
                >
                  <div class="absolute top-0.5 left-0.5 w-1 h-1 bg-[#1E88E5]"></div>
                  <div class="absolute top-0.5 right-0.5 w-1 h-1 bg-[#1E88E5]"></div>
                  <div class="absolute bottom-0.5 left-0.5 w-1 h-1 bg-[#1E88E5]"></div>
                  <div class="absolute bottom-0.5 right-0.5 w-1 h-1 bg-[#1E88E5]"></div>
                </div>

                <span
                    class="text-xl font-black leading-none relative z-20 transition-colors"
                    :class="index === todayIndex ? 'text-[#1E88E5] scale-110' : 'text-gray-500/80'"
                >
        {{ day.kanji }}
      </span>

                <span
                    class="text-[8px] font-bold tracking-widest uppercase mt-0.5 font-mono relative z-20 transition-colors"
                    :class="index === todayIndex ? 'text-[#1E88E5] opacity-100' : 'text-gray-400 opacity-50'"
                >
        {{ day.en }}
      </span>
              </div>

            </div>

            <div class="relative w-full h-0">
              <div class="absolute top-0 left-0 w-full h-8 bg-white/20 backdrop-blur-xl" style="clip-path: polygon(0 0, 100% 0, 50% 100%);"></div>

              <svg class="absolute top-0 left-0 w-full h-8 pointer-events-none" viewBox="0 0 100 50" preserveAspectRatio="none">
                <path d="M0,0 L50,50 L100,0" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
              </svg>

              <div class="absolute top-8 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#1E88E5] rounded-full shadow-[0_0_10px_#1E88E5] animate-pulse"></div>
            </div>

          </div>









          <div class="flex-1">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div
                  v-for="item in dailyAnimeList"
                  :key="item.id"
                  class="group relative h-36 md:h-44 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  @click="goToDetail(item.id)"
              >
                <img :src="item.img" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />

                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                <div class="absolute inset-0 p-3 flex flex-col justify-between text-white">
                  <div class="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">

                  </div>

                  <div>
                    <h3 class="font-bold text-sm md:text-base leading-tight line-clamp-2 group-hover:text-[#1E88E5] transition-colors">
                      {{ item.title }}
                    </h3>
                  </div>
                </div>

                <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-2xl ring-1 ring-white/10">
          <img
              src="https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=800&auto=format&fit=crop"
              class="absolute inset-0 w-full h-full object-cover blur-sm scale-110 transition-all duration-700 group-hover:blur-0 group-hover:scale-105"
              alt="Anime Room"
          />

          <div class="absolute inset-0 bg-black/40 group-hover:bg-indigo-900/30 transition-colors duration-500"></div>

          <div class="absolute inset-0 flex flex-col justify-center items-center text-white z-10">
            <h3 class="text-5xl md:text-6xl font-black italic tracking-tighter drop-shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:-rotate-2">
              一起看放映室
            </h3>
            <div class="flex items-center gap-3 mt-4 opacity-80 group-hover:opacity-100 transition-opacity">
              <div class="h-[2px] w-12 bg-white"></div>
              <p class="text-lg font-bold tracking-[0.2em] uppercase">Watch Together</p>
              <div class="h-[2px] w-12 bg-white"></div>
            </div>
          </div>
        </div>

        <div class="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-2xl ring-1 ring-white/10">
          <img
              src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=800&auto=format&fit=crop"
              class="absolute inset-0 w-full h-full object-cover scale-110 transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-1"
              alt="Starry Sky"
          />

          <div class="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-black/40 group-hover:from-purple-900/60 transition-colors duration-500"></div>

          <div class="absolute inset-0 flex flex-col justify-center items-center text-white z-10">
            <h3 class="text-5xl md:text-6xl font-black italic tracking-tighter drop-shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-2">
              AI 预测
            </h3>
            <div class="flex items-center gap-3 mt-4 opacity-80 group-hover:opacity-100 transition-opacity">
              <svg class="w-5 h-5 animate-pulse text-cyan-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
              <p class="text-lg font-bold tracking-[0.2em] uppercase">Get Your Likes</p>
              <svg class="w-5 h-5 animate-pulse text-cyan-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            </div>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
/* 添加简单的入场动画，让文字看起来有质感 */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation-name: fadeInUp;
  animation-duration: 0.6s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scanFast {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
.animate-scan-fast {
  animation: scanFast 1.5s linear infinite;
}
</style>