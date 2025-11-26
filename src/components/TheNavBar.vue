<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // 导入 router 用于跳转(如果需要)
import LoginModal from './LoginModal.vue'
import UserProfileModal from './UserProfileModal.vue' // 引入新写的组件

const router = useRouter()
const showLoginModal = ref(false)
const showProfileModal = ref(false)

// 用户状态
const userInfo = ref(null)

const navItems = [
  { name: '主  页', path: '/' },
  { name: '动  漫', path: '/library' },
  { name: '预  测', path: '/prediction' },
  { name: '一  起  看', path: '/watch' },
  { name: '收  藏', path: '/collection' }
]

// 检查登录状态的方法
const checkLoginStatus = () => {
  const storedInfo = localStorage.getItem('userInfo')
  if (storedInfo) {
    try {
      userInfo.value = JSON.parse(storedInfo)
    } catch (e) {
      console.error('解析用户信息失败', e)
      localStorage.removeItem('userInfo') // 清除无效数据
    }
  } else {
    userInfo.value = null
  }
}

// 处理登录成功（供 LoginModal 调用）
const handleLoginSuccess = () => {
  checkLoginStatus()
  showLoginModal.value = false
}

// 处理登出（供 ProfileModal 调用）
const handleLogout = () => {
  userInfo.value = null
  // 可以选择跳回主页
  router.push('/')
}

// 初始化检查
onMounted(() => {
  checkLoginStatus()
})
</script>

<template>
  <header class="fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/40 bg-white/70 backdrop-blur-xl shadow-sm/50">
    <div class="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

      <router-link to="/" class="flex items-center gap-3 cursor-pointer group select-none">
        <div class="relative w-11 h-11  from-[#1E88E5] to-cyan-400 rounded-xl flex items-center justify-center group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
          <div class="relative w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-out">
            <svg class="w-full h-full drop-shadow-lg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#3B82F6" />
                  <stop offset="100%" stop-color="#9333EA" />
                </linearGradient>
                <linearGradient id="starGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stop-color="#0074D9" /> <stop offset="100%" stop-color="#7ABAF2" /> </linearGradient>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
                  <stop offset="60%" stop-color="#22D3EE" stop-opacity="0.6" />
                  <stop offset="100%" stop-color="#000000" stop-opacity="0.1" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <g transform="rotate(45 32 32)">
                <ellipse cx="32" cy="32" rx="10" ry="30" stroke="url(#orbitGrad)" stroke-width="4" stroke-linecap="round" opacity="0.9" />
                <ellipse cx="32" cy="32" rx="30" ry="10" stroke="url(#orbitGrad)" stroke-width="2.5" stroke-linecap="round" opacity="0.9" />
              </g>
              <path d="M32 4 C35 22 42 29 60 32 C42 35 35 42 32 60 C29 42 22 35 4 32 C22 29 29 22 32 4 Z" fill="url(#starGrad)" filter="url(#glow)"/>
            </svg>
          </div>
          <div class="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-pulse"></div>
        </div>
        <div class="flex flex-col justify-center h-10">
          <span class="text-2xl font-black italic tracking-tighter text-gray-800 leading-none group-hover:text-[#1E88E5] transition-colors duration-300">
            Stella-rium
          </span>
          <span class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-none mt-1 group-hover:text-cyan-500 transition-colors">
            Anime Platform
          </span>
        </div>
      </router-link>

      <div class="flex items-center gap-10">

        <nav class="hidden md:flex items-center gap-8">
          <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="group relative flex items-center gap-1 py-2"
              active-class="active-link"
          >
            <span class="text-[#1E88E5] font-black italic text-lg tracking-tighter opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              //
            </span>
            <span class="text-base font-black italic tracking-tighter text-gray-400 transition-all duration-300 group-hover:text-[#1E88E5] group-hover:translate-x-1">
              {{ item.name }}
            </span>
          </router-link>
        </nav>

        <div class="hidden md:block w-[2px] h-6 bg-gray-200 transform skew-x-[-12deg]"></div>

        <div
            v-if="userInfo"
            @click="showProfileModal = true"
            class="cursor-pointer flex items-center gap-3 group pl-2"
        >
          <div class="hidden lg:flex flex-col items-end opacity-80 group-hover:opacity-100 transition-opacity">
             <span class="text-sm font-black text-gray-800 tracking-tight leading-none mb-1">
              {{ userInfo.nickname }}
            </span>
            <span class="text-[8px] font-bold text-[#1E88E5] tracking-wider uppercase leading-none flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Active
            </span>
          </div>

          <div class="relative">
            <div class="absolute inset-0 rounded-full bg-[#1E88E5] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>

            <img
                :src="userInfo.avatar"
                class="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300 object-cover"
                alt="User"
            >
          </div>
        </div>

        <div
            v-else
            @click="showLoginModal = true"
            class="cursor-pointer flex items-center gap-3 group pl-2"
        >
          <div class="hidden lg:flex flex-col items-end opacity-60 group-hover:opacity-100 transition-opacity">
            <span class="text-[10px] font-black text-gray-800 tracking-widest uppercase leading-none mb-0.5">Guest User</span>
            <span class="text-[8px] font-bold text-[#1E88E5] tracking-wider uppercase leading-none flex items-center gap-1">
              <span class="w-1 h-1 rounded-full bg-[#1E88E5] animate-pulse"></span>
              System Online
            </span>
          </div>

          <div class="relative">
            <div class="absolute inset-0 rounded-full bg-[#1E88E5] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
            <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                class="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300 object-cover grayscale group-hover:grayscale-0"
                alt="Guest"
            >
          </div>
        </div>

      </div>
    </div>
  </header>

  <div class="h-20"></div>

  <Teleport to="body">
    <Transition name="fade">
      <LoginModal
          v-if="showLoginModal"
          @close="showLoginModal = false"
          @success="handleLoginSuccess"
      />
    </Transition>

    <Transition name="fade">
      <UserProfileModal
          v-if="showProfileModal && userInfo"
          :initial-user-id="userInfo.userId"
          @close="showProfileModal = false"
          @logout="handleLogout"
      />
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Active 状态样式 */
.active-link span:first-child {
  opacity: 1 !important;
  transform: translateX(0) !important;
}
.active-link span:last-child {
  color: #1E88E5 !important;
  transform: translateX(4px) !important;
}
</style>