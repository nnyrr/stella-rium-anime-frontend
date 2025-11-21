<script setup>
import TheNavBar from './components/TheNavBar.vue'
</script>

<template>
  <div class="min-h-screen font-sans text-gray-800 relative selection:bg-[#1E88E5] selection:text-white">

    <div class="fixed inset-0 -z-10 h-full w-full overflow-hidden">

      <div class="absolute top-[-10%] right-[-10%] h-[700px] w-[700px] rounded-full bg-[#1E88E5]/20 blur-[100px]"></div>

      <div class="absolute bottom-[-10%] left-[-5%] h-[700px] w-[700px] rounded-full bg-sky-400/20 blur-[120px]"></div>

      <div class="absolute top-[40%] left-[30%] h-[400px] w-[400px] rounded-full bg-cyan-300/15 blur-[90px]"></div>

      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 brightness-100 contrast-150 mix-blend-overlay"></div>
    </div>

    <TheNavBar />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <footer class="mt-20 py-12  backdrop-blur-sm text-center">
      <div class="text-[#999999] text-sm font-medium tracking-wide">
        © 2025 Stellarium Anime <span class="mx-2 text-gray-300">|</span>
        <span class="hover:text-[#1E88E5] cursor-pointer transition-colors">隐私政策</span>
      </div>
    </footer>
  </div>
</template>