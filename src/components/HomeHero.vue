<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const handleHeroClick = () => {
  router.push('/player') // 跳转到播放页
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-5 pt-8">
    <div
        @click="handleHeroClick"
        class="relative h-[400px] md:h-[450px] w-full rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer transition-all duration-300 hover:shadow-blue-900/20 active:scale-[0.98]"
    >

      <img
          src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
          alt="Hero Landscape"
      >

      <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>

      <div class="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 text-white max-w-3xl">

        <div class="flex items-center gap-3 mb-4 opacity-0 translate-y-4 animate-fade-in-up" style="animation-delay: 0.1s; animation-fill-mode: forwards;">
          <div class="h-[2px] w-8 bg-[#1E88E5] transition-all duration-500 group-hover:w-12"></div>
          <span class="text-[#1E88E5] font-bold tracking-[0.3em] uppercase text-sm italic">今日推荐</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-black italic tracking-tighter mb-4 leading-tight drop-shadow-xl opacity-0 translate-y-4 animate-fade-in-up group-hover:text-blue-50 transition-colors duration-500" style="animation-delay: 0.2s; animation-fill-mode: forwards;">
          进击的巨人
          <span class="block text-3xl md:text-4xl text-white/80 mt-1 font-extrabold tracking-tighter italic">Final Season</span>
        </h1>

        <p class="text-gray-400 text-sm md:text-base line-clamp-2 mb-10 font-medium max-w-lg leading-relaxed opacity-0 translate-y-4 animate-fade-in-up" style="animation-delay: 0.3s; animation-fill-mode: forwards;">
          那一天，人类终于回想起了被巨人支配的恐惧... 史诗般的终结篇章，艾伦的选择将决定世界的命运。
        </p>

        <div class="flex items-center gap-4 opacity-0 translate-y-4 animate-fade-in-up group/btn" style="animation-delay: 0.4s; animation-fill-mode: forwards;">

          <div class="w-14 h-14 rounded-full border border-white/30 bg-white/5 backdrop-blur-md flex items-center justify-center transition-all duration-500 group-hover:border-[#1E88E5] group-hover:bg-[#1E88E5]/20 group-hover:shadow-[0_0_20px_rgba(30,136,229,0.3)] group-hover:scale-100">
            <svg class="w-6 h-6 text-white fill-current translate-x-0.5 drop-shadow-md" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>

          <div class="flex flex-col">
            <span class="text-lg font-black italic tracking-wide transition-all duration-500 group-hover:text-[#1E88E5] group-hover:tracking-[0.2em]">立即播放</span>
            <span class="text-[10px] text-gray-500 uppercase tracking-[0.3em] group-hover:text-blue-300 transition-colors ">Play Now</span>
          </div>

          <svg class="w-5 h-5 text-white/50 transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* 保持之前的动画 */
@keyframes fadeInUp {
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation-name: fadeInUp;
  animation-duration: 0.6s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
</style>