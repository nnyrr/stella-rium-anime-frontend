<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// --- 数据逻辑 ---
const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const todayIndex = new Date().getDay() // 0-6
const activeDay = ref(todayIndex) // 默认选中今天
const currentTime = ref('00:00:00')
let timer = null

// 模拟数据
const dailyAnimeList = ref(Array.from({ length: 5 }, (_, i) => ({
  id: i,
  title: i % 2 === 0 ? '我推的孩子 第二季' : '无职转生 到了异世界就拿出真本事',
  time: '23:00',
  score: '9.5',
  img: `https://picsum.photos/400/250?random=${i + 100}`
})))

// 时钟逻辑
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 切换日期
const handleDayChange = (index) => {
  activeDay.value = index
  // 这里可以添加重新获取数据的逻辑
}
</script>

<template>
  <section class="mt-20">

    <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
      <h2 class="text-2xl font-bold text-gray-800 border-l-4 border-[#1E88E5] pl-3">每日放送</h2>

      <div class="flex items-baseline gap-2 select-none">
        <div class="text-4xl font-black tracking-tighter text-gray-800 leading-none">
          {{ currentTime }}
        </div>
        <span class="text-sm font-bold text-gray-300">CN</span> <div class="w-1 h-8 bg-[#1E88E5] animate-pulse"></div>
      </div>
    </div>

    <div class="relative mb-12 px-4">
      <div class="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -z-10 -translate-y-1/2"></div>

      <div class="flex justify-between items-center max-w-3xl mx-auto">
        <button
            v-for="(day, index) in weekDays"
            :key="index"
            @click="handleDayChange(index)"
            class="group relative flex items-center justify-center transition-all duration-500 outline-none"
        >
          <div
              class="absolute inset-0 rounded-full bg-[#1E88E5]/20 animate-ping"
              v-if="activeDay === index"
          ></div>

          <div
              class="relative flex items-center justify-center rounded-full border-2 transition-all duration-300 z-10"
              :class="[
              activeDay === index
                ? 'w-12 h-12 bg-[#1E88E5] border-[#1E88E5] shadow-lg shadow-blue-500/30 scale-110'
                : 'w-8 h-8 bg-white border-gray-200 hover:border-blue-300 hover:scale-110'
            ]"
          >
            <span
                class="font-bold transition-colors duration-300"
                :class="activeDay === index ? 'text-white text-lg' : 'text-gray-400 text-xs group-hover:text-[#1E88E5]'"
            >
              {{ day }}
            </span>
          </div>

          <div v-if="activeDay === index" class="absolute -bottom-2 w-1 h-4 bg-gradient-to-b from-[#1E88E5] to-transparent opacity-50"></div>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div
          v-for="item in dailyAnimeList"
          :key="item.id"
          class="group relative h-36 md:h-44 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        <img :src="item.img" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />

        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

        <div class="absolute inset-0 p-3 flex flex-col justify-between text-white">
          <div class="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
            <span class="bg-[#1E88E5]/90 backdrop-blur-sm text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm">
              {{ item.time }}
            </span>
            <span class="text-yellow-400 text-xs font-bold flex items-center gap-0.5">
              ★ {{ item.score }}
            </span>
          </div>

          <div>
            <h3 class="font-bold text-sm md:text-base leading-tight line-clamp-2 group-hover:text-[#1E88E5] transition-colors">
              {{ item.title }}
            </h3>
            <p class="text-[10px] text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity delay-75">
              第8话 更新中
            </p>
          </div>
        </div>

        <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <svg class="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>