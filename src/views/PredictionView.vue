<script setup>
import { ref } from 'vue'

const predictionType = ref('anime') // 'anime' | 'character'
const isPredicting = ref(false)

const startPrediction = () => {
  if (isPredicting.value) return
  isPredicting.value = true

  // 模拟预测过程
  setTimeout(() => {
    isPredicting.value = false
    alert('运算完成：匹配到最高契合度结果！')
  }, 3000)
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-5 py-20 min-h-[80vh] flex flex-col items-center justify-start">

    <div class="text-center mb-12 select-none">
      <h1 class="text-6xl md:text-8xl font-black italic tracking-tighter text-gray-900 leading-none opacity-90">
        NEURAL
        <span class="text-[#1E88E5]">LINK</span>
      </h1>
      <div class="flex items-center justify-center gap-4 mt-2">
        <div class="h-[1px] w-12 bg-gray-300"></div>
        <p class="text-xs font-bold text-gray-400 tracking-[0.5em] uppercase">
          神经网络 · 深度匹配系统
        </p>
        <div class="h-[1px] w-12 bg-gray-300"></div>
      </div>
    </div>

    <div class="mb-10 relative w-full max-w-sm h-14 border-2 border-gray-200 bg-white/50 backdrop-blur-sm p-1 flex items-center rounded-sm shadow-sm">

      <div
          class="absolute top-1 bottom-1 w-[calc(50%-6px)] bg-gray-900 shadow-md transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-sm flex items-center justify-center"
          :class="predictionType === 'anime' ? 'left-1' : 'left-[calc(50%+2px)]'"
      >

      </div>

      <button
          @click="predictionType = 'anime'"
          class="flex-1 relative z-10 h-full text-sm font-black italic tracking-widest transition-colors duration-300"
          :class="predictionType === 'anime' ? 'text-white' : 'text-gray-400 hover:text-gray-600'"
      >
        番剧 · ANIME
      </button>

      <button
          @click="predictionType = 'character'"
          class="flex-1 relative z-10 h-full text-sm font-black italic tracking-widest transition-colors duration-300"
          :class="predictionType === 'character' ? 'text-white' : 'text-gray-400 hover:text-gray-600'"
      >
        角色 · CHARA
      </button>
    </div>

    <div
        @click="startPrediction"
        class="relative w-full h-48 md:h-56 rounded-sm overflow-hidden cursor-pointer group shadow-2xl ring-1 ring-black/5 select-none"
    >
      <img
          src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1000&auto=format&fit=crop"
          class="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
          :class="isPredicting ? 'scale-125 blur-sm' : 'blur-[2px] group-hover:blur-0'"
          alt="Space"
      />

      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-blue-900/30 mix-blend-multiply transition-colors duration-500 group-hover:bg-black/60"></div>

      <div v-if="isPredicting" class="absolute inset-0 bg-blue-500/10 animate-pulse z-0"></div>
      <div v-if="isPredicting" class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#1E88E5]/50 to-transparent -translate-y-full animate-scan z-0"></div>

      <div class="absolute inset-0 flex flex-col items-center justify-center text-white z-10">

        <div class="mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-90">
          <svg v-if="isPredicting" class="animate-spin w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <svg v-else class="w-12 h-12 text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        </div>

        <h2 class="text-4xl md:text-5xl font-black italic tracking-[0.2em] indent-[0.2em] group-hover:tracking-[0.3em] group-hover:indent-[0.3em] transition-all duration-500 drop-shadow-lg">
          {{ isPredicting ? '数据解析中...' : '启动预测序列' }}
        </h2>

        <p class="mt-3 text-xs font-bold text-blue-200 tracking-[0.3em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">
          {{ isPredicting ? 'System Synchronizing' : 'Initiate AI Prediction Model' }}
        </p>
      </div>
    </div>

    <div class="w-full mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
          v-for="i in 3" :key="i"
          class="aspect-[3/4] rounded-sm border border-dashed border-gray-400/50 bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center relative group hover:border-[#1E88E5]/80 hover:bg-white/30 transition-all duration-300"
      >
        <div class="text-center opacity-40 group-hover:opacity-100 transition-opacity duration-300">
          <div class="text-7xl font-black italic text-gray-300 mb-4 group-hover:text-[#1E88E5] transition-colors select-none">?</div>
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Data Slot 0{{ i }}</p>
        </div>

        <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-400 group-hover:border-[#1E88E5] transition-colors"></div>
        <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-400 group-hover:border-[#1E88E5] transition-colors"></div>
        <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-400 group-hover:border-[#1E88E5] transition-colors"></div>
        <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-400 group-hover:border-[#1E88E5] transition-colors"></div>

        <div v-if="isPredicting" class="absolute inset-0 overflow-hidden">
          <div class="w-full h-[2px] bg-[#1E88E5] shadow-[0_0_10px_#1E88E5] animate-scan-card" :style="{ animationDelay: `${i * 0.2}s` }"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* 主按钮扫描动画 */
@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
.animate-scan {
  animation: scan 2s linear infinite;
}

/* 卡片扫描动画 */
@keyframes scanCard {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(400px); opacity: 0; } /* 400px是大概的高度 */
}
.animate-scan-card {
  animation: scanCard 1.5s ease-in-out infinite;
}
</style>